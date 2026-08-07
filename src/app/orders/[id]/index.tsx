import RadioPillButtonGroup from "@/components/RadioButtonPillGroup";
import AppText from "@/components/ui/AppText";
import { useCancelOrder, useCompleteOrder, useOrder, useShipOrder } from "@/hooks/useOrders";
import { useCancelPayment, useCreatePayment, usePayments } from "@/hooks/usePayments";
import { formatDateTime } from "@/lib/date";
import { showAlert } from "@/lib/alert";
import { getStatusIcon } from "@/lib/orderStatusIcon";
import { useAuthStore } from "@/store/useAuthStore";
import type { components } from "@/types/api";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type OrderStatus = components["schemas"]["OrderStatus"];
type PaymentMethod = components["schemas"]["PaymentMethod"];

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    Created: "อยู่ระหว่างดำเนินการ",
    Shipped: "จัดส่งแล้ว",
    Completed: "เสร็จสมบูรณ์",
    Cancelled: "ยกเลิกแล้ว",
};

const STATUS_CREATED: OrderStatus = "Created";
const STATUS_SHIPPED: OrderStatus = "Shipped";

const PAYMENT_METHOD_OPTIONS: { id: number; label: string; value: PaymentMethod }[] = [
    { id: 1, label: "เงินสด", value: "Cash" },
    { id: 2, label: "โอนเงิน", value: "BankTransfer" },
];

function PaymentsSection({ orderId, remaining }: { orderId: string; remaining: number }) {
    const { data, isPending } = usePayments({ orderId });
    const createPayment = useCreatePayment();
    const cancelPayment = useCancelPayment();
    const [amount, setAmount] = useState("");
    const [methodId, setMethodId] = useState("1");

    const payments = data?.items ?? [];
    const method =
        PAYMENT_METHOD_OPTIONS.find((x) => x.id.toString() === methodId)?.value ?? "Cash";

    const handleCreate = () => {
        const value = Number(amount);
        if (!value || value <= 0) return;
        createPayment.mutate(
            { orderId, paymentMethod: method, amount: value },
            { onSuccess: () => setAmount("") },
        );
    };

    const handleCancelPayment = (paymentId?: string) => {
        if (!paymentId) return;
        showAlert("ยกเลิกการชำระเงิน", "ต้องการยกเลิกรายการชำระเงินนี้หรือไม่?", [
            { text: "ไม่", style: "cancel" },
            {
                text: "ยกเลิก",
                style: "destructive",
                onPress: () => cancelPayment.mutate(paymentId),
            },
        ]);
    };

    return (
        <View style={styles.paymentsSection}>
            <AppText size="title">การชำระเงิน</AppText>

            {isPending ? (
                <ActivityIndicator />
            ) : payments.length === 0 ? (
                <AppText size="small" style={styles.subtleText}>
                    ยังไม่มีการชำระเงิน
                </AppText>
            ) : (
                payments.map((p) => (
                    <View key={p.paymentId} style={styles.paymentRow}>
                        <View>
                            <AppText style={p.cancelledAt ? styles.subtleText : undefined}>
                                {p.amount} .- ({p.paymentMethod === "Cash" ? "เงินสด" : "โอนเงิน"})
                            </AppText>
                            {p.cancelledAt && (
                                <AppText size="small" style={styles.subtleText}>
                                    ยกเลิกแล้ว
                                </AppText>
                            )}
                        </View>
                        {!p.cancelledAt && (
                            <Pressable onPress={() => handleCancelPayment(p.paymentId)} hitSlop={8}>
                                <MaterialDesignIcons
                                    name="close-circle-outline"
                                    size={22}
                                    color="#c00"
                                />
                            </Pressable>
                        )}
                    </View>
                ))
            )}

            <AppText size="small" style={styles.subtleText}>
                ยอดคงเหลือ: {remaining} .-
            </AppText>

            <RadioPillButtonGroup
                options={PAYMENT_METHOD_OPTIONS}
                selectedId={methodId}
                onPress={setMethodId}
            />
            <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="จำนวนเงิน"
                keyboardType="numeric"
                style={styles.amountInput}
            />
            <Pressable
                style={[styles.actionBtn, styles.addPaymentBtn]}
                onPress={handleCreate}
                disabled={createPayment.isPending}
            >
                <AppText style={styles.actionBtnText}>เพิ่มการชำระเงิน</AppText>
            </Pressable>
        </View>
    );
}

export default function OrderDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: order, isPending, isError } = useOrder(id);
    const roles = useAuthStore((state) => state.roles);
    const canManageLines = roles.includes("order-manager") || roles.includes("staff");
    const canManageStatus = roles.includes("order-manager");
    const canManagePayments = roles.includes("finance-manager");

    const shipOrder = useShipOrder();
    const completeOrder = useCompleteOrder();
    const cancelOrder = useCancelOrder();

    const isShipped = order?.status === STATUS_SHIPPED;
    const { data: paymentsData } = usePayments({ orderId: id }, isShipped);
    const paidAmount =
        paymentsData?.items?.reduce(
            (sum, p) => (p.cancelledAt ? sum : sum + Number(p.amount ?? 0)),
            0,
        ) ?? 0;

    const handleShip = () => {
        showAlert("จัดส่งคำสั่งซื้อ", "ต้องการทำเครื่องหมายคำสั่งซื้อนี้ว่าจัดส่งแล้วหรือไม่?", [
            { text: "ยกเลิก", style: "cancel" },
            { text: "ยืนยัน", onPress: () => shipOrder.mutate(id) },
        ]);
    };

    const handleComplete = () => {
        showAlert(
            "ยืนยันคำสั่งซื้อ",
            "ต้องการทำเครื่องหมายคำสั่งซื้อนี้ว่าเสร็จสมบูรณ์หรือไม่?",
            [
                { text: "ยกเลิก", style: "cancel" },
                { text: "ยืนยัน", onPress: () => completeOrder.mutate(id) },
            ],
        );
    };

    const handleCancel = () => {
        showAlert("ยกเลิกคำสั่งซื้อ", "ต้องการยกเลิกคำสั่งซื้อนี้หรือไม่?", [
            { text: "ไม่", style: "cancel" },
            {
                text: "ยกเลิกคำสั่งซื้อ",
                style: "destructive",
                onPress: () => cancelOrder.mutate(id),
            },
        ]);
    };

    if (isPending) {
        return (
            <View style={styles.notFound}>
                <ActivityIndicator size={64} />
            </View>
        );
    }

    if (isError || !order) {
        return (
            <View style={styles.notFound}>
                <AppText>ไม่พบคำสั่งซื้อ</AppText>
            </View>
        );
    }

    const isCreated = order.status === STATUS_CREATED;
    const showEditLink = canManageLines && isCreated;
    const showPaymentSection = canManagePayments && isShipped;
    const showStatusControls = canManageStatus && (isCreated || isShipped);

    const totalPrice =
        order.orderLines?.reduce((sum, line) => sum + Number(line.lineTotal ?? 0), 0) ?? 0;
    const isFullyPaid = isShipped && paidAmount === totalPrice;

    const headerRight = showEditLink
        ? () => (
              <Link href={{ pathname: "/orders/[id]/edit", params: { id } }} asChild>
                  <Pressable hitSlop={8}>
                      <MaterialDesignIcons name="pencil" size={20} />
                  </Pressable>
              </Link>
          )
        : undefined;

    return (
        <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
            <Stack.Screen options={{ headerRight }} />
            <ScrollView
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ flexDirection: "row", gap: 12 }}>
                    <View
                        style={{
                            width: 120,
                            aspectRatio: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 12,
                            backgroundColor: "beige",
                        }}
                    >
                        <MaterialDesignIcons
                            name={getStatusIcon(order.status)}
                            size={92}
                            color={"lightsalmon"}
                        />
                    </View>
                    <View style={styles.header}>
                        <AppText size="heading"># {order.orderId?.slice(0, 8)}</AppText>
                        <AppText size="medium" style={styles.subtleText}>
                            สถานะ: {order.status ? ORDER_STATUS_LABELS[order.status] : "-"}
                        </AppText>
                        <View style={styles.timestamps}>
                            <View style={styles.timestampRow}>
                                <AppText size="small" style={styles.subtleText}>
                                    สร้างเมื่อ
                                </AppText>
                                <AppText size="small">{formatDateTime(order.createdAt)}</AppText>
                            </View>
                            {order.completedAt ? (
                                <View style={styles.timestampRow}>
                                    <AppText size="small" style={styles.subtleText}>
                                        เสร็จสมบูรณ์เมื่อ
                                    </AppText>
                                    <AppText size="small">
                                        {formatDateTime(order.completedAt)}
                                    </AppText>
                                </View>
                            ) : null}
                            {order.cancelledAt ? (
                                <View style={styles.timestampRow}>
                                    <AppText size="small" style={styles.subtleText}>
                                        ยกเลิกเมื่อ
                                    </AppText>
                                    <AppText size="small">
                                        {formatDateTime(order.cancelledAt)}
                                    </AppText>
                                </View>
                            ) : null}
                        </View>
                    </View>
                </View>

                <View style={styles.items}>
                    {order.orderLines?.map((line) => (
                        <View key={line.orderLineId} style={styles.itemRow}>
                            <View style={{ flex: 1 }}>
                                <AppText size="large">{line.productName}</AppText>
                                <AppText size="small" style={styles.subtleText}>
                                    {line.unitPrice} .- x {line.quantity}
                                </AppText>
                            </View>
                            <AppText size="large">{line.lineTotal} .-</AppText>
                        </View>
                    ))}
                </View>

                <View style={styles.totalRow}>
                    <AppText size="title">ยอดรวม</AppText>
                    <AppText size="heading">{totalPrice} .-</AppText>
                </View>

                {showPaymentSection && (
                    <PaymentsSection orderId={id} remaining={totalPrice - paidAmount} />
                )}

                {showStatusControls && (
                    <View style={styles.statusActions}>
                        {isCreated && (
                            <Pressable
                                style={[styles.actionBtn, styles.shipBtn]}
                                onPress={handleShip}
                                disabled={shipOrder.isPending}
                            >
                                <AppText style={styles.actionBtnText}>
                                    ทำเครื่องหมายว่าจัดส่งแล้ว
                                </AppText>
                            </Pressable>
                        )}
                        {isShipped && (
                            <Pressable
                                style={[
                                    styles.actionBtn,
                                    styles.completeBtn,
                                    !isFullyPaid && styles.disabledBtn,
                                ]}
                                onPress={handleComplete}
                                disabled={completeOrder.isPending || !isFullyPaid}
                            >
                                <AppText style={styles.actionBtnText}>
                                    ทำเครื่องหมายว่าเสร็จสมบูรณ์
                                </AppText>
                            </Pressable>
                        )}
                        <Pressable
                            style={[styles.actionBtn, styles.cancelBtn]}
                            onPress={handleCancel}
                            disabled={cancelOrder.isPending}
                        >
                            <AppText style={styles.actionBtnText}>ยกเลิกคำสั่งซื้อ</AppText>
                        </Pressable>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    notFound: { flex: 1, justifyContent: "center", alignItems: "center" },
    header: { marginBottom: 16, gap: 8, flex: 1 },
    subtleText: { color: "gray" },
    timestamps: {
        gap: 4,
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    timestampRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    items: { gap: 12 },
    itemRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
    },
    paymentsSection: {
        marginTop: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        gap: 8,
    },
    paymentRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 6,
    },
    amountInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    statusActions: { marginTop: 24, gap: 8 },
    actionBtn: { paddingVertical: 12, borderRadius: 12 },
    shipBtn: { backgroundColor: "blue" },
    completeBtn: { backgroundColor: "blue" },
    cancelBtn: { backgroundColor: "#c00" },
    addPaymentBtn: { backgroundColor: "green" },
    disabledBtn: { opacity: 0.4 },
    actionBtnText: {
        color: "white",
        textAlign: "center",
        fontSize: 16,
        fontFamily: "Mali_600SemiBold",
    },
});
