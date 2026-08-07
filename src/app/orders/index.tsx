import OrderListItem from "@/components/OrderListItem";
import RadioPillButtonGroup from "@/components/RadioButtonPillGroup";
import AppText from "@/components/ui/AppText";
import { useOrders } from "@/hooks/useOrders";
import type { components } from "@/types/api";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type OrderStatus = components["schemas"]["OrderStatus"];

const STATUS_OPTIONS: { id: number; label: string; value: string; status?: OrderStatus }[] = [
    { id: 1, label: "ทั้งหมด", value: "all" },
    { id: 2, label: "รอดำเนินการ", value: "created", status: "Created" },
    { id: 3, label: "กำลังจัดส่ง", value: "shipped", status: "Shipped" },
    { id: 4, label: "เสร็จสมบูรณ์", value: "completed", status: "Completed" },
    { id: 5, label: "ยกเลิก", value: "cancelled", status: "Cancelled" },
];

export default function Orders() {
    const { orderById } = useLocalSearchParams<{ orderById: string }>();
    const [selectedId, setSelectedId] = useState<string>("2");
    const status = STATUS_OPTIONS.find((x) => x.id.toString() === selectedId)?.status;

    const { data, isPending, refetch, isRefetching } = useOrders(20, orderById, status);
    const orders = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

    return (
        <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
            <View style={{ marginVertical: 8 }}>
                <RadioPillButtonGroup
                    options={STATUS_OPTIONS}
                    selectedId={selectedId}
                    onPress={setSelectedId}
                />
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl tintColor="blue" refreshing={isRefetching} onRefresh={refetch} />
                }
            >
                {isPending ? (
                    <ActivityIndicator style={{ marginTop: 24 }} />
                ) : orders.length === 0 ? (
                    <AppText style={{ textAlign: "center", color: "gray", marginTop: 24 }}>
                        ยังไม่มีคำสั่งซื้อ
                    </AppText>
                ) : (
                    orders.map((x) => <OrderListItem key={x.orderId} order={x} />)
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
});
