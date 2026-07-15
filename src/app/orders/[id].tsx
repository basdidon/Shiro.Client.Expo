import AppText from "@/components/ui/AppText";
import { useOrderStore } from "@/store/useOrderStore";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrderDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const order = useOrderStore((state) => state.orders.find((o) => o.id === id));

    if (!order) {
        return (
            <View style={styles.notFound}>
                <AppText>ไม่พบคำสั่งซื้อ</AppText>
            </View>
        );
    }

    return (
        <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
            <View style={styles.header}>
                <AppText size="heading">
                    # {String(order.orderNumber).padStart(4, "0")}
                </AppText>
                <AppText size="small" style={styles.subtleText}>
                    {new Date(order.createdAt).toLocaleString("th-TH")}
                </AppText>
            </View>

            <View style={styles.items}>
                {order.items.map((item) => (
                    <View key={item.id} style={styles.itemRow}>
                        <View style={{ flex: 1 }}>
                            <AppText size="large">{item.name}</AppText>
                            <AppText size="small" style={styles.subtleText}>
                                {item.unitPrice} .- x {item.quantity}
                            </AppText>
                        </View>
                        <AppText size="large">{item.unitPrice * item.quantity} .-</AppText>
                    </View>
                ))}
            </View>

            <View style={styles.totalRow}>
                <AppText size="title">ยอดรวม</AppText>
                <AppText size="heading">{order.totalPrice} .-</AppText>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    notFound: { flex: 1, justifyContent: "center", alignItems: "center" },
    header: { marginBottom: 16 },
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
