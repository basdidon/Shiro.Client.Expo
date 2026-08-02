import AppText from "@/components/ui/AppText";
import { useBestSellers } from "@/hooks/useDashboard";
import { Link } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default () => {
    const { data: bestSellers, isPending, isError } = useBestSellers(5);

    return (
        <View>
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
                                <AppText
                                    style={{ color: "white", fontFamily: "Mali_700Bold" }}
                                    size="small"
                                >
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
};

const styles = StyleSheet.create({
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
