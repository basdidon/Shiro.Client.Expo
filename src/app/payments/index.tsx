import AppText from "@/components/ui/AppText";
import { usePayments } from "@/hooks/usePayments";
import { useAuthStore } from "@/store/useAuthStore";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { FlashList } from "@shopify/flash-list";
import { Link } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentsScreen() {
    const roles = useAuthStore((state) => state.roles);
    const userId = useAuthStore((state) => state.userId);
    const isFinanceManager = roles.includes("finance-manager");

    const { data, isPending } = usePayments(
        isFinanceManager ? {} : { userId: userId ?? undefined },
        isFinanceManager || !!userId,
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
                    {isFinanceManager ? "การชำระเงินทั้งหมด" : "การชำระเงินของฉัน"}
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
                    renderItem={({ item }) => (
                        <Link
                            href={{ pathname: "/orders/[id]", params: { id: item.orderId! } }}
                            asChild
                        >
                            <Pressable style={styles.card}>
                                <View
                                    style={[
                                        styles.iconWrap,
                                        item.cancelledAt && styles.iconWrapCancelled,
                                    ]}
                                >
                                    <MaterialDesignIcons
                                        name={
                                            item.paymentMethod === "Cash"
                                                ? "cash"
                                                : "bank-transfer"
                                        }
                                        size={28}
                                        color={item.cancelledAt ? "gray" : "green"}
                                    />
                                </View>
                                <View style={styles.cardBody}>
                                    <AppText
                                        size="large"
                                        style={item.cancelledAt ? styles.subtleText : undefined}
                                    >
                                        {item.amount} .- (
                                        {item.paymentMethod === "Cash" ? "เงินสด" : "โอนเงิน"})
                                    </AppText>
                                    <AppText size="small" style={styles.subtleText}>
                                        # {item.orderId?.slice(0, 8)}
                                    </AppText>
                                    {item.cancelledAt && (
                                        <AppText size="small" style={styles.subtleText}>
                                            ยกเลิกแล้ว
                                        </AppText>
                                    )}
                                </View>
                                <MaterialDesignIcons name="chevron-right" size={20} color="#999" />
                            </Pressable>
                        </Link>
                    )}
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
