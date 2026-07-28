import AppText from "@/components/ui/AppText";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
    title: string;
    children: ReactNode;
}
export default ({ title, children }: Props) => {
    return (
        <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
            <AppText size="title" style={styles.titleTxt}>
                {title}
            </AppText>
            <View style={styles.headerUnderline} />
            <View style={styles.contentContainer}>{children}</View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 12 },
    titleTxt: { textAlign: "center" },
    headerUnderline: { borderColor: "#ccc", borderBottomWidth: 1, marginTop: 8, marginBottom: 12 },
    contentContainer: {},
});
