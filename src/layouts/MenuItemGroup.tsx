import AppText from "@/components/ui/AppText";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

interface Props {
    title: string;
    children: ReactNode;
}

export default function MenuItemGroup({ title, children }: Props) {
    return (
        <View>
            <AppText style={styles.menuGroupHeader} size="title">
                {title}
            </AppText>
            <View style={styles.menu}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    menuGroupHeader: { marginTop: 16, marginBottom: 8, marginHorizontal: 16 },
    menu: {
        marginHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#eee",
        overflow: "hidden",
    },
});
