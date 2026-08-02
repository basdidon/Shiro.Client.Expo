import AppText from "@/components/ui/AppText";
import { useDashboardSummary } from "@/hooks/useDashboard";
import { Link } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

const formatCurrency = (value: number | string | undefined) =>
    Number(value ?? 0).toLocaleString("th-TH", { maximumFractionDigits: 0 });

export default function DashboardScreen() {
    const { data: summary, isPending, isError } = useDashboardSummary();

    if (isPending) {
        return (
            <View style={styles.stateContainer}>
                <ActivityIndicator size="small" />
            </View>
        );
    }

    if (isError) {
        return (
            <View style={styles.stateContainer}>
                <AppText style={{ color: "gray" }}>ไม่สามารถโหลดข้อมูลแดชบอร์ดได้</AppText>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.cardContainer}>
                <View style={[styles.cardLarge, { backgroundColor: "cornflowerblue" }]}>
                    <AppText style={{ color: "white", fontFamily: "Mali_600SemiBold" }}>ยอดขายวันนี้</AppText>
                    <AppText size="display" style={{ color: "white", textAlign: "right" }}>
                        {formatCurrency(summary.salesToday)}
                    </AppText>
                </View>
                <View style={[styles.cardLarge, { backgroundColor: "royalblue" }]}>
                    <AppText style={{ color: "white", fontFamily: "Mali_600SemiBold" }}>ยอดขายเดือนนี้</AppText>
                    <AppText size="display" style={{ color: "white", textAlign: "right" }}>
                        {formatCurrency(summary.salesThisMonth)}
                    </AppText>
                </View>
            </View>
            <View style={styles.cardContainer}>
                <Link href={"/orders"} asChild>
                    <Pressable
                        style={StyleSheet.flatten([
                            styles.cardSmall,
                            { backgroundColor: "#2DD4BF" },
                        ])}
                    >
                        <AppText style={{ color: "white", fontFamily: "Mali_600SemiBold" }}>รอดำเนินการ</AppText>
                        <AppText size="display" style={{ color: "white", textAlign: "right" }}>
                            {summary.pendingOrdersCount ?? 0}
                        </AppText>
                    </Pressable>
                </Link>
                <View style={[styles.cardSmall, { backgroundColor: "#0D9488" }]}>
                    <AppText style={{ color: "white", fontFamily: "Mali_600SemiBold" }}>กำลังจัดส่ง</AppText>
                    <AppText
                        size="display"
                        style={{
                            color: "white",
                            textAlign: "right",
                        }}
                    >
                        {summary.shippingOrdersCount ?? 0}
                    </AppText>
                </View>
                <View style={styles.cardSmall}>
                    <AppText style={{ color: "white", fontFamily: "Mali_600SemiBold" }}>เสร็จสิ้นวันนี้</AppText>
                    <AppText size="display" style={{ color: "white", textAlign: "right" }}>
                        {summary.completedTodayCount ?? 0}
                    </AppText>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    stateContainer: { paddingVertical: 24, alignItems: "center" },
    cardContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        gap: 8,
        marginBottom: 8,
    },
    cardLarge: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        justifyContent: "space-between",
        elevation: 5,
    },
    cardSmall: {
        flex: 1,
        backgroundColor: "#115E59",
        padding: 12,
        borderRadius: 12,
        justifyContent: "space-between",
        elevation: 5,
    },
});
