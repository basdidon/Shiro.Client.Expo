import AppText from "@/components/ui/AppText";
import { useCreateCheckout } from "@/hooks/useCheckouts";
import { useCreateOrder } from "@/hooks/useOrders";
import { useCartStore } from "@/store/useCartStore";
import type { components } from "@/types/api";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import CartItemView from "./CartItemView";
import ShippingAddressSection from "./ShippingAddressSection";

type CheckoutDto = components["schemas"]["CheckoutDto"];
type Address = components["schemas"]["Address"];

const formatCountdown = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function Cart() {
    const items = useCartStore((state) => state.items);
    const clearCart = useCartStore((state) => state.clear);

    const [checkout, setCheckout] = useState<CheckoutDto | null>(null);
    const [now, setNow] = useState(() => Date.now());
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [address, setAddress] = useState<Address | null>(null);

    const createCheckout = useCreateCheckout();
    const createOrder = useCreateOrder();

    const expiresAtMs = checkout?.expiresAt ? new Date(checkout.expiresAt).getTime() : null;
    const msLeft = expiresAtMs ? expiresAtMs - now : 0;
    const isExpired = !!checkout && msLeft <= 0;
    const isUrgent = !!checkout && !isExpired && msLeft < 60_000;

    useEffect(() => {
        if (!checkout) return;
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, [checkout]);

    const totalPrice = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    const checkoutLines = (checkoutItems: typeof items) =>
        checkoutItems.map((item) => ({ productId: item.productId, quantity: item.quantity }));

    const handlePlaceOrder = async () => {
        if (items.length === 0) return;
        setErrorMessage(null);
        try {
            const result = await createCheckout.mutateAsync({ lines: checkoutLines(items) });
            setCheckout(result);
        } catch {
            setErrorMessage("ล็อกราคาไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        }
    };

    const handleRefreshCheckout = async () => {
        setErrorMessage(null);
        try {
            const result = await createCheckout.mutateAsync({ lines: checkoutLines(items) });
            setCheckout(result);
        } catch {
            setErrorMessage("ล็อกราคาไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        }
    };

    const handleConfirm = async () => {
        if (!checkout?.checkoutId || !address) return;
        setErrorMessage(null);
        try {
            const order = await createOrder.mutateAsync({
                checkoutId: checkout.checkoutId,
                address,
            });
            clearCart();
            setCheckout(null);
            setAddress(null);
            router.push({ pathname: "/orders/[id]", params: { id: order.orderId! } });
        } catch {
            setErrorMessage("ยืนยันคำสั่งซื้อไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        }
    };

    if (checkout) {
        return (
            <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    bottomOffset={62}
                >
                    <AppText size="title">สรุปคำสั่งซื้อ</AppText>
                    <AppText style={styles.muted}>ราคาถูกล็อกไว้แล้ว</AppText>
                    {checkout.lines?.map((line) => {
                        const cartItem = items.find((item) => item.productId === line.productId);
                        return (
                            <View key={line.checkoutLineId} style={styles.checkoutLineCard}>
                                <View style={{ flex: 1 }}>
                                    <AppText size="large" numberOfLines={1}>
                                        {cartItem?.productName ?? line.productId}
                                    </AppText>
                                    <AppText size="small" style={styles.muted}>
                                        จำนวน {line.quantity}
                                    </AppText>
                                </View>
                                <AppText size="label">{line.subTotal} .-</AppText>
                            </View>
                        );
                    })}

                    <ShippingAddressSection onAddressChange={setAddress} />
                </KeyboardAwareScrollView>
                <View style={styles.footer}>
                    {errorMessage && <AppText style={styles.errorText}>{errorMessage}</AppText>}
                    {isExpired ? (
                        <>
                            <View style={styles.statusRow}>
                                <MaterialDesignIcons
                                    name="clock-alert-outline"
                                    size={18}
                                    color="#d64545"
                                />
                                <AppText style={styles.expiredText}>
                                    ราคาหมดอายุแล้ว กดเพื่อล็อกราคาใหม่
                                </AppText>
                            </View>
                            <TouchableOpacity
                                style={[
                                    styles.submitBtn,
                                    createCheckout.isPending && styles.submitBtnDisabled,
                                ]}
                                onPress={handleRefreshCheckout}
                                disabled={createCheckout.isPending}
                            >
                                <Text style={styles.submitTxtBtn}>
                                    {createCheckout.isPending ? "กำลังล็อกราคา..." : "ล็อกราคาใหม่"}
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <View style={styles.statusRow}>
                                <MaterialDesignIcons
                                    name="clock-outline"
                                    size={16}
                                    color={isUrgent ? "#e67e22" : "gray"}
                                />
                                <AppText
                                    style={[
                                        styles.countdownText,
                                        isUrgent && styles.countdownUrgent,
                                    ]}
                                >
                                    ราคาล็อกไว้อีก {formatCountdown(msLeft)} นาที
                                </AppText>
                            </View>
                            <View style={styles.totalRow}>
                                <AppText size="large">ยอดรวมทั้งหมด</AppText>
                                <AppText size="display">{checkout.total} .-</AppText>
                            </View>
                            <TouchableOpacity
                                style={[
                                    styles.submitBtn,
                                    (createOrder.isPending || !address) && styles.submitBtnDisabled,
                                ]}
                                onPress={handleConfirm}
                                disabled={createOrder.isPending || !address}
                            >
                                <Text style={styles.submitTxtBtn}>
                                    {createOrder.isPending ? "กำลังยืนยัน..." : "ยืนยันคำสั่งซื้อ"}
                                </Text>
                            </TouchableOpacity>
                            <Pressable onPress={() => setCheckout(null)} hitSlop={8}>
                                <AppText style={styles.editCartText}>กลับไปแก้ไขตะกร้า</AppText>
                            </Pressable>
                        </>
                    )}
                </View>
            </SafeAreaView>
        );
    }

    if (items.length === 0) {
        return (
            <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
                <View style={styles.emptyContainer}>
                    <MaterialDesignIcons name="cart-outline" size={72} color="#ccc" />
                    <AppText size="title" style={{ marginTop: 8 }}>
                        ตะกร้าของคุณว่างเปล่า
                    </AppText>
                    <AppText style={styles.emptySubtitle}>
                        เลือกสินค้าที่คุณสนใจแล้วเพิ่มลงตะกร้า
                    </AppText>
                    <Link href="/products" asChild>
                        <TouchableOpacity style={styles.submitBtn}>
                            <Text style={styles.submitTxtBtn}>เลือกซื้อสินค้า</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {items.map((item) => (
                    <CartItemView key={item.productId} item={item} />
                ))}
            </ScrollView>
            <View style={styles.footer}>
                {errorMessage && <AppText style={styles.errorText}>{errorMessage}</AppText>}
                <View style={styles.totalRow}>
                    <AppText size="large">ยอดรวมทั้งหมด</AppText>
                    <AppText size="display">{totalPrice} .-</AppText>
                </View>
                <TouchableOpacity
                    style={[
                        styles.submitBtn,
                        (items.length === 0 || createCheckout.isPending) &&
                            styles.submitBtnDisabled,
                    ]}
                    onPress={handlePlaceOrder}
                    disabled={items.length === 0 || createCheckout.isPending}
                >
                    <Text style={styles.submitTxtBtn}>
                        {createCheckout.isPending ? "กำลังล็อกราคา..." : "ยืนยันคำสั่งซื้อ"}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f7f7f8" },
    scrollContent: { padding: 12, gap: 10 },
    footer: {
        backgroundColor: "white",
        padding: 16,
        gap: 8,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderTopWidth: 1,
        borderColor: "#eee",
    },
    totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    submitBtn: { backgroundColor: "blue", padding: 14, borderRadius: 12 },
    submitBtnDisabled: { backgroundColor: "#ccc" },
    submitTxtBtn: { color: "white", fontSize: 18, fontFamily: "Mali_700Bold", textAlign: "center" },
    checkoutLineCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#eee",
        padding: 12,
    },
    statusRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
    countdownText: { textAlign: "center", color: "gray" },
    countdownUrgent: { color: "#e67e22", fontFamily: "Mali_600SemiBold" },
    expiredText: { textAlign: "center", color: "#d64545" },
    editCartText: { textAlign: "center", color: "gray", marginTop: 4 },
    errorText: { color: "red", textAlign: "center" },
    muted: { color: "gray" },
    emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
    emptySubtitle: { color: "gray", textAlign: "center", marginTop: 4, marginBottom: 20 },
});
