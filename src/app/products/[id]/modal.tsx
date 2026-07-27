import AppText from "@/components/ui/AppText";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function () {
    return (
        <SafeAreaView edges={["bottom"]}>
            <View style={Styles.container}>
                <AppText size="title">อัปโหลดรูปภาพ</AppText>
            </View>
        </SafeAreaView>
    );
}

const Styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        paddingHorizontal: 12,
        paddingVertical: 24,
        minHeight: 240,
    },
});
