import AppText from "@/components/ui/AppText";
import { useOrder } from "@/hooks/useOrders";
import { useAuthStore } from "@/store/useAuthStore";
import type { components } from "@/types/api";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type OrderStatus = components["schemas"]["OrderStatus"];

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    Created: "อยู่ระหว่างดำเนินการ",
    Completed: "เสร็จสมบูรณ์",
    Cancelled: "ยกเลิกแล้ว",
};

const STATUS_CREATED: OrderStatus = "Created";

export default function OrderDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: order, isPending, isError } = useOrder(id);
    const roles = useAuthStore((state) => state.roles);
    const canManageLines = roles.includes("order-manager") || roles.includes("staff");

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

    const totalPrice =
        order.orderLines?.reduce((sum, line) => sum + Number(line.lineTotal ?? 0), 0) ?? 0;

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
            <View style={styles.header}>
                <AppText size="heading"># {order.orderId?.slice(0, 8)}</AppText>
                <AppText size="small" style={styles.subtleText}>
                    {order.createdAt ? new Date(order.createdAt).toLocaleString("th-TH") : ""}
                </AppText>
                <AppText size="medium" style={styles.subtleText}>
                    สถานะ: {order.status ? ORDER_STATUS_LABELS[order.status] : "-"}
                </AppText>
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
});
