import AppText from "@/components/ui/AppText";
import { usePayments } from "@/hooks/usePayments";
import { formatDate, formatTime } from "@/lib/date";
import { useAuthStore } from "@/store/useAuthStore";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { FlashList } from "@shopify/flash-list";
import { Link } from "expo-router";
import { ActivityIndicator, RefreshControl, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentsScreen() {
    const userId = useAuthStore((state) => state.userId);

    const { data, isPending, refetch, isRefetching } = usePayments(
        { userId: userId ?? undefined },
        !!userId,
    );

    const payments = data?.items ?? [];

    if (isPending) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size={64} />
            </View>
        );
    }

    return (
        <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
            <View style={styles.subHeader}>
                <AppText size="small" style={styles.subtleText}>
                    การชำระเงินของฉัน
                </AppText>
            </View>
            {payments.length === 0 ? (
                <View style={styles.loading}>
                    <AppText style={{ color: "gray" }}>ยังไม่มีการชำระเงิน</AppText>
                </View>
            ) : (
                <FlashList
                    data={payments}
                    keyExtractor={(item) => item.paymentId!}
                    contentContainerStyle={{ padding: 12 }}
                    refreshControl={
                        <RefreshControl
                            tintColor="blue"
                            refreshing={isRefetching}
                            onRefresh={refetch}
                        />
                    }
                    renderItem={({ item }) => {
                        var isCancelled = !!item.cancelledAt;
                        return (
                            <Link
                                href={{ pathname: "/orders/[id]", params: { id: item.orderId! } }}
                                asChild
                            >
                                <View
                                    style={{
                                        borderLeftColor: isCancelled ? "gray" : "green",
                                        borderLeftWidth: 8,
                                        backgroundColor: "white",
                                        padding: 8,
                                        paddingLeft: 0,
                                        borderRadius: 4,
                                        marginBottom: 8,
                                    }}
                                >
                                    <View style={{ flexDirection: "row" }}>
                                        <View style={{ margin: 4, marginHorizontal: 8 }}>
                                            <MaterialDesignIcons
                                                name="account-circle-outline"
                                                size={36}
                                                color={"#222"}
                                            />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <AppText size="label">Name PlaceHolder</AppText>
                                            <AppText size="small">
                                                OrderID : #{item.orderId?.slice(0, 8)}
                                            </AppText>
                                            <AppText size="small">
                                                {item.paymentMethod == "Cash"
                                                    ? "เงินสด"
                                                    : "โอนจ่าย"}
                                            </AppText>
                                        </View>
                                        <View style={{ alignItems: "flex-end", gap: 2 }}>
                                            <View
                                                style={{
                                                    padding: 2,
                                                    paddingHorizontal: 8,
                                                    backgroundColor: isCancelled ? "gray" : "green",
                                                    borderRadius: 8,
                                                }}
                                            >
                                                <AppText
                                                    size="extraSmall"
                                                    style={{
                                                        color: "#fff",
                                                        fontFamily: "Mali_600SemiBold",
                                                    }}
                                                >
                                                    {isCancelled ? "ยกเลิกแล้ว" : "ชำระแล้ว"}
                                                </AppText>
                                            </View>
                                            <View style={{ flexDirection: "row", gap: 4 }}>
                                                <AppText size="extraSmall">
                                                    {formatTime(item.createdAt)}
                                                </AppText>
                                                <MaterialDesignIcons name="clock-outline" />
                                            </View>
                                            <View style={{ flexDirection: "row", gap: 4 }}>
                                                <AppText size="extraSmall">
                                                    {formatDate(item.createdAt)}
                                                </AppText>
                                                <MaterialDesignIcons name="calendar-month-outline" />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 8 }}>
                                        <AppText style={{ textAlign: "right" }}>
                                            ฿ {Number(item.amount).toFixed(2)}
                                        </AppText>
                                    </View>
                                </View>
                            </Link>
                        );
                    }}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loading: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16 },
    subHeader: { paddingHorizontal: 16, paddingTop: 12 },
    subtleText: { color: "gray" },
    card: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 12,
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
    },
    iconWrap: {
        justifyContent: "center",
        alignItems: "center",
        width: 48,
        aspectRatio: 1,
        backgroundColor: "#eaffea",
        borderRadius: 12,
    },
    iconWrapCancelled: { backgroundColor: "#eee" },
    cardBody: { flex: 1, gap: 2 },
});
