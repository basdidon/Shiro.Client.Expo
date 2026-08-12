import AppText from "@/components/ui/AppText";
import * as Network from "expo-network";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OfflineBanner() {
    const { isConnected, isInternetReachable } = Network.useNetworkState();
    const isOffline = isConnected === false || isInternetReachable === false;

    if (!isOffline) return null;

    return (
        <SafeAreaView edges={["top"]} style={styles.safeArea}>
            <View style={styles.banner}>
                <AppText size="small" style={styles.text}>
                    ไม่มีการเชื่อมต่ออินเทอร์เน็ต
                </AppText>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { backgroundColor: "#d64545" },
    banner: { paddingVertical: 6, alignItems: "center" },
    text: { color: "white" },
});
