import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Link } from "expo-router";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/components/ui/AppText";
import { useAuthStore } from "@/store/useAuthStore";

export default function Profile() {
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        Alert.alert("ออกจากระบบ", "คุณต้องการออกจากระบบใช่หรือไม่", [
            { text: "ยกเลิก", style: "cancel" },
            { text: "ออกจากระบบ", style: "destructive", onPress: () => logout() },
        ]);
    };

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <View style={styles.header}>
                <MaterialDesignIcons name="account-circle" size={80} color="#ccc" />
                <AppText size="title" style={styles.title}>
                    โปรไฟล์
                </AppText>
            </View>

            <View style={styles.menu}>
                <Link href="/orders" asChild>
                    <Pressable
                        style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                    >
                        <MaterialDesignIcons
                            name="file-document-multiple-outline"
                            size={20}
                            color="#333"
                        />
                        <AppText size="large" style={styles.menuItemText}>
                            คำสั่งซื้อของฉัน
                        </AppText>
                        <MaterialDesignIcons name="chevron-right" size={20} color="#999" />
                    </Pressable>
                </Link>
            </View>

            <Pressable
                style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutButtonPressed]}
                onPress={handleLogout}
            >
                <MaterialDesignIcons name="logout" size={20} color="#d00" />
                <AppText size="large" style={styles.logoutText}>
                    ออกจากระบบ
                </AppText>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: "center",
        paddingVertical: 32,
    },
    title: {
        marginTop: 12,
    },
    menu: {
        marginHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#eee",
        overflow: "hidden",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    menuItemPressed: {
        backgroundColor: "#f5f5f5",
    },
    menuItemText: {
        flex: 1,
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        columnGap: 8,
        marginHorizontal: 16,
        marginTop: 24,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#d00",
    },
    logoutButtonPressed: {
        backgroundColor: "#fdd",
    },
    logoutText: {
        color: "#d00",
    },
});
