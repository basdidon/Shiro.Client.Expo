import AppText from "@/components/ui/AppText";
import Stepper from "@/components/Stepper";
import {
    useCancelOrder,
    useCompleteOrder,
    useOrder,
    useRemoveOrderLine,
    useUpdateOrderLine,
} from "@/hooks/useOrders";
import { useAuthStore } from "@/store/useAuthStore";
import type { components } from "@/types/api";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { Alert, ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type LineOfOrderDto = components["schemas"]["LineOfOrderDto"];

const STATUS_CREATED = 0;

function OrderLineRow({ orderId, line }: { orderId: string; line: LineOfOrderDto }) {
    const updateOrderLine = useUpdateOrderLine();
    const removeOrderLine = useRemoveOrderLine();

    const handleSetQuantity = (quantity: number) => {
        if (!line.orderLineId) return;
        updateOrderLine.mutate({ orderId, orderLineId: line.orderLineId, quantity });
    };

    const handleRemove = () => {
        if (!line.orderLineId) return;
        Alert.alert("ลบรายการ", `ต้องการลบ "${line.productName}" ออกจากคำสั่งซื้อหรือไม่?`, [
            { text: "ยกเลิก", style: "cancel" },
            {
                text: "ลบ",
                style: "destructive",
                onPress: () => removeOrderLine.mutate({ orderId, orderLineId: line.orderLineId! }),
            },
        ]);
    };

    return (
        <View style={styles.itemRow}>
            <View style={{ flex: 1 }}>
                <AppText size="large">{line.productName}</AppText>
                <AppText size="small" style={styles.subtleText}>
                    {line.unitPrice} .- x {line.quantity}
                </AppText>
            </View>
            <View style={{ alignItems: "flex-end", gap: 8 }}>
                <Pressable onPress={handleRemove} hitSlop={8}>
                    <MaterialDesignIcons name="trash-can-outline" size={20} color="#c00" />
                </Pressable>
                <Stepper value={Number(line.quantity ?? 1)} setValue={handleSetQuantity} />
            </View>
        </View>
    );
}

export default function EditOrderScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: order, isPending, isError } = useOrder(id);
    const roles = useAuthStore((state) => state.roles);
    const canManageLines = roles.includes("order-manager") || roles.includes("staff");
    const canManageStatus = roles.includes("order-manager");

    const completeOrder = useCompleteOrder();
    const cancelOrder = useCancelOrder();

    const handleComplete = () => {
        Alert.alert("ยืนยันคำสั่งซื้อ", "ต้องการทำเครื่องหมายคำสั่งซื้อนี้ว่าเสร็จสมบูรณ์หรือไม่?", [
            { text: "ยกเลิก", style: "cancel" },
            {
                text: "ยืนยัน",
                onPress: () => completeOrder.mutate(id, { onSuccess: () => router.back() }),
            },
        ]);
    };

    const handleCancel = () => {
        Alert.alert("ยกเลิกคำสั่งซื้อ", "ต้องการยกเลิกคำสั่งซื้อนี้หรือไม่?", [
            { text: "ไม่", style: "cancel" },
            {
                text: "ยกเลิกคำสั่งซื้อ",
                style: "destructive",
                onPress: () => cancelOrder.mutate(id, { onSuccess: () => router.back() }),
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

    if (!canManageLines || !isCreated) {
        return (
            <View style={[styles.notFound, { gap: 12 }]}>
                <AppText>ไม่สามารถแก้ไขคำสั่งซื้อนี้ได้</AppText>
                <Pressable onPress={() => router.back()}>
                    <AppText style={{ color: "blue" }}>กลับ</AppText>
                </Pressable>
            </View>
        );
    }

    const showStatusControls = canManageStatus;

    const totalPrice =
        order.orderLines?.reduce((sum, line) => sum + Number(line.lineTotal ?? 0), 0) ?? 0;

    const headerRight = () => (
        <Link href={{ pathname: "/orders/[id]/scan-item", params: { id } }} asChild>
            <Pressable hitSlop={8}>
                <MaterialDesignIcons name="barcode-scan" size={24} />
            </Pressable>
        </Link>
    );

    return (
        <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
            <Stack.Screen options={{ headerRight }} />
            <View style={styles.header}>
                <AppText size="heading"># {order.orderId?.slice(0, 8)}</AppText>
                <AppText size="small" style={styles.subtleText}>
                    {order.createdAt ? new Date(order.createdAt).toLocaleString("th-TH") : ""}
                </AppText>
            </View>

            <View style={styles.items}>
                {order.orderLines?.map((line) => (
                    <OrderLineRow key={line.orderLineId} orderId={id} line={line} />
                ))}
            </View>

            <View style={styles.totalRow}>
                <AppText size="title">ยอดรวม</AppText>
                <AppText size="heading">{totalPrice} .-</AppText>
            </View>

            {showStatusControls && (
                <View style={styles.statusActions}>
                    <Pressable
                        style={[styles.actionBtn, styles.completeBtn]}
                        onPress={handleComplete}
                        disabled={completeOrder.isPending}
                    >
                        <AppText style={styles.actionBtnText}>ทำเครื่องหมายว่าเสร็จสมบูรณ์</AppText>
                    </Pressable>
                    <Pressable
                        style={[styles.actionBtn, styles.cancelBtn]}
                        onPress={handleCancel}
                        disabled={cancelOrder.isPending}
                    >
                        <AppText style={styles.actionBtnText}>ยกเลิกคำสั่งซื้อ</AppText>
                    </Pressable>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    notFound: { flex: 1, justifyContent: "center", alignItems: "center" },
    header: { marginBottom: 16, gap: 4 },
    subtleText: { color: "gray" },
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
    statusActions: { marginTop: 24, gap: 8 },
    actionBtn: { paddingVertical: 12, borderRadius: 12 },
    completeBtn: { backgroundColor: "blue" },
    cancelBtn: { backgroundColor: "#c00" },
    actionBtnText: { color: "white", textAlign: "center", fontSize: 16, fontWeight: "600" },
});
