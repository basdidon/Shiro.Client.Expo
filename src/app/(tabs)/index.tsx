import AppText from "@/components/ui/AppText";
import { useBestSellers } from "@/hooks/useDashboard";
import { Link } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

export default function Index() {
    const { data: bestSellers, isPending, isError } = useBestSellers(5);

    return (
        <View style={styles.container}>
            <View style={styles.cardContainer}>
                <View style={[styles.cardLarge, { backgroundColor: "cornflowerblue" }]}>
                    <AppText style={{ color: "white", fontWeight: "600" }}>ยอดขายวันนี้</AppText>
                    <AppText size="display" style={{ color: "white", textAlign: "right" }}>
                        12,500
                    </AppText>
                </View>
                <View style={[styles.cardLarge, { backgroundColor: "royalblue" }]}>
                    <AppText style={{ color: "white", fontWeight: "600" }}>ยอดขายเดือนนี้</AppText>
                    <AppText size="display" style={{ color: "white", textAlign: "right" }}>
                        930,000
                    </AppText>
                </View>
            </View>
            <View style={styles.cardContainer}>
                <Link href={"/orders"} asChild>
                    <Pressable
                        style={{
                            flex: 1,
                            height: 92,
                            padding: 12,
                            borderRadius: 12,
                            justifyContent: "space-between",
                            elevation: 5,
                            backgroundColor: "#2DD4BF",
                        }}
                    >
                        <AppText style={{ color: "white", fontWeight: "600" }}>รอดำเนินการ</AppText>
                        <AppText size="display" style={{ color: "white", textAlign: "right" }}>
                            1
                        </AppText>
                    </Pressable>
                </Link>
                <View
                    style={{
                        flex: 1,
                        height: 92,
                        padding: 12,
                        borderRadius: 12,
                        justifyContent: "space-between",
                        elevation: 5,
                        backgroundColor: "#0D9488",
                    }}
                >
                    <AppText style={{ color: "white", fontWeight: "600" }}>กำลังจัดส่ง</AppText>
                    <AppText size="display" style={{ color: "white", textAlign: "right" }}>
                        3
                    </AppText>
                </View>
                <View style={styles.cardSmall}>
                    <AppText style={{ color: "white", fontWeight: "600" }}>เสร็จสิ้น</AppText>
                    <AppText size="display" style={{ color: "white", textAlign: "right" }}>
                        12
                    </AppText>
                </View>
            </View>
            <View style={{ marginVertical: 12 }}>
                <AppText size="title">สินค้าขายดี</AppText>
                <View style={{ borderBottomWidth: 0.5, borderBottomColor: "gray" }} />
            </View>
            {isPending ? (
                <ActivityIndicator size="small" style={{ marginTop: 12 }} />
            ) : isError ? (
                <AppText style={{ color: "gray", textAlign: "center", marginTop: 12 }}>
                    ไม่สามารถโหลดสินค้าขายดีได้
                </AppText>
            ) : bestSellers.length === 0 ? (
                <AppText style={{ color: "gray", textAlign: "center", marginTop: 12 }}>
                    ยังไม่มีข้อมูลสินค้าขายดี
                </AppText>
            ) : (
                bestSellers.map((item, index) => (
                    <Link
                        key={item.productId ?? index}
                        href={{ pathname: "/products/[id]", params: { id: item.productId } }}
                    >
                        <View style={styles.bestSellerRow}>
                            <View style={styles.rankBadge}>
                                <AppText style={{ color: "white", fontWeight: "700" }} size="small">
                                    {index + 1}
                                </AppText>
                            </View>
                            <View style={{ flex: 1 }}>
                                <AppText numberOfLines={1}>{item.productName}</AppText>
                                <AppText style={{ color: "gray" }} size="small">
                                    ขายแล้ว {item.soldQuantity ?? 0}
                                </AppText>
                            </View>
                        </View>
                    </Link>
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 12,
    },
    cardContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        gap: 8,
        marginBottom: 8,
    },
    cardLarge: {
        flex: 1,
        backgroundColor: "navy",
        height: 124,
        padding: 12,
        borderRadius: 12,
        justifyContent: "space-between",
        elevation: 5,
    },
    cardSmall: {
        flex: 1,
        backgroundColor: "#115E59",
        height: 92,
        padding: 12,
        borderRadius: 12,
        justifyContent: "space-between",
        elevation: 5,
    },
    bestSellerRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: "#eee",
    },
    rankBadge: {
        width: 24,
        height: 24,
        borderRadius: 8,
        backgroundColor: "cornflowerblue",
        alignItems: "center",
        justifyContent: "center",
    },
});
