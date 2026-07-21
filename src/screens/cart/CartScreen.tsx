import { useCreateCheckout } from "@/hooks/useCheckouts";
import { useCreateOrder } from "@/hooks/useOrders";
import { useCartStore } from "@/store/useCartStore";
import type { components } from "@/types/api";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CartItemView from "./CartItemView";

type CheckoutDto = components["schemas"]["CheckoutDto"];

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

    const createCheckout = useCreateCheckout();
    const createOrder = useCreateOrder();

    const expiresAtMs = checkout?.expiresAt ? new Date(checkout.expiresAt).getTime() : null;
    const msLeft = expiresAtMs ? expiresAtMs - now : 0;
    const isExpired = !!checkout && msLeft <= 0;

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
        if (!checkout?.checkoutId) return;
        setErrorMessage(null);
        try {
            const order = await createOrder.mutateAsync({ checkoutId: checkout.checkoutId });
            clearCart();
            setCheckout(null);
            router.push({ pathname: "/orders/[id]", params: { id: order.orderId! } });
        } catch {
            setErrorMessage("ยืนยันคำสั่งซื้อไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        }
    };

    if (checkout) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={styles.contentContainer}>
                        {checkout.lines?.map((line) => {
                            const cartItem = items.find((item) => item.productId === line.productId);
                            return (
                                <View key={line.checkoutLineId} style={styles.checkoutLineRow}>
                                    <Text style={{ flex: 1 }}>
                                        {cartItem?.productName ?? line.productId} x {line.quantity}
                                    </Text>
                                    <Text>{line.subTotal} .-</Text>
                                </View>
                            );
                        })}
                    </View>
                    <View style={styles.footer}>
                        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
                        {isExpired ? (
                            <>
                                <Text style={styles.expiredText}>
                                    ราคาหมดอายุแล้ว กดเพื่อล็อกราคาใหม่
                                </Text>
                                <TouchableOpacity
                                    style={[
                                        styles.submitBtn,
                                        createCheckout.isPending && styles.submitBtnDisabled,
                                    ]}
                                    onPress={handleRefreshCheckout}
                                    disabled={createCheckout.isPending}
                                >
                                    <Text style={styles.submitTxtBtn}>
                                        {createCheckout.isPending
                                            ? "กำลังล็อกราคา..."
                                            : "ล็อกราคาใหม่"}
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Text style={styles.countdownText}>
                                    ราคาล็อกไว้อีก {formatCountdown(msLeft)} นาที
                                </Text>
                                <View style={styles.totalRow}>
                                    <Text>total price</Text>
                                    <Text style={{ fontSize: 24 }}>{checkout.total}</Text>
                                </View>
                                <TouchableOpacity
                                    style={[
                                        styles.submitBtn,
                                        createOrder.isPending && styles.submitBtnDisabled,
                                    ]}
                                    onPress={handleConfirm}
                                    disabled={createOrder.isPending}
                                >
                                    <Text style={styles.submitTxtBtn}>
                                        {createOrder.isPending ? "กำลังยืนยัน..." : "ยืนยันคำสั่งซื้อ"}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setCheckout(null)}>
                                    <Text style={styles.editCartText}>กลับไปแก้ไขตะกร้า</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    {items.map((item) => (
                        <CartItemView key={item.productId} item={item} />
                    ))}
                </View>
                <View style={styles.footer}>
                    {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
                    <View style={{ marginBottom: 24 }}>
                        <View style={styles.totalRow}>
                            <Text>total price</Text>
                            <Text style={{ fontSize: 24 }}>{totalPrice}</Text>
                        </View>
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
                            {createCheckout.isPending ? "กำลังล็อกราคา..." : "Place Order"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    contentContainer: { flex: 1, margin: 12, gap: 8 },
    footer: { backgroundColor: "white", padding: 12, paddingHorizontal: 16, gap: 8 },
    totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    submitBtn: { backgroundColor: "blue", padding: 8, borderRadius: 8 },
    submitBtnDisabled: { backgroundColor: "#ccc" },
    submitTxtBtn: { color: "white", fontSize: 20, fontWeight: "bold", textAlign: "center" },
    checkoutLineRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
    countdownText: { textAlign: "center", color: "gray" },
    expiredText: { textAlign: "center", color: "red" },
    editCartText: { textAlign: "center", color: "gray", marginTop: 4 },
    errorText: { color: "red", textAlign: "center" },
});
