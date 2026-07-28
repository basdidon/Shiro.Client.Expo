import AppText from "@/components/ui/AppText";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

export default function DashboardScreen() {
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
                        0
                    </AppText>
                </View>
                <View style={styles.cardSmall}>
                    <AppText style={{ color: "white", fontWeight: "600" }}>เสร็จสิ้น</AppText>
                    <AppText size="display" style={{ color: "white", textAlign: "right" }}>
                        12
                    </AppText>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
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
});
