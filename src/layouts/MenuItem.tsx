import AppText from "@/components/ui/AppText";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Pressable, StyleSheet } from "react-native";

interface Props {
    iconName: React.ComponentProps<typeof MaterialDesignIcons>["name"];
    label: string;
}
export default function MenuItem({ iconName, label }: Props) {
    return (
        <Pressable style={styles.menuItem}>
            <MaterialDesignIcons name={iconName} size={20} color="#333" />
            <AppText size="large" style={styles.menuItemText}>
                {label}
            </AppText>
            <MaterialDesignIcons name="chevron-right" size={20} color="#999" />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    menuItemText: {
        flex: 1,
    },
});
