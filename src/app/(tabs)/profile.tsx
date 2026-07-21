import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Link } from "expo-router";
import { Alert, Pressable, StyleSheet, View } from "react-native";

import AppText from "@/components/ui/AppText";
import { useAuthStore } from "@/store/useAuthStore";

export default function Profile() {
    const logout = useAuthStore((state) => state.logout);
    const username = useAuthStore((state) => state.username);
    const roles = useAuthStore((state) => state.roles);
    const canManageUsers = roles.includes("super-admin") || roles.includes("owner");

    const handleLogout = () => {
        Alert.alert("ออกจากระบบ", "คุณต้องการออกจากระบบใช่หรือไม่", [
            { text: "ยกเลิก", style: "cancel" },
            { text: "ออกจากระบบ", style: "destructive", onPress: () => logout() },
        ]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <MaterialDesignIcons name="account-circle" size={80} color="#ccc" />
                <AppText size="title" style={styles.title}>
                    {username ?? "โปรไฟล์"}
                </AppText>
                {roles.length > 0 && (
                    <View style={styles.roleRow}>
                        {roles.map((role) => (
                            <View key={role} style={styles.roleChip}>
                                <AppText size="small" style={styles.roleChipText}>
                                    {role}
                                </AppText>
                            </View>
                        ))}
                    </View>
                )}
            </View>
            <View>
                <AppText style={styles.menuGroupHeader} size="title">
                    ฐานข้อมูล
                </AppText>
                <View style={styles.menu}>
                    <Link href="/categories/create" asChild>
                        <Pressable style={styles.menuItem}>
                            <MaterialDesignIcons
                                name="view-grid-plus-outline"
                                size={20}
                                color="#333"
                            />
                            <AppText size="large" style={styles.menuItemText}>
                                เพิ่มหมวดหมู่สินค้า
                            </AppText>
                            <MaterialDesignIcons name="chevron-right" size={20} color="#999" />
                        </Pressable>
                    </Link>
                    <Link href="/products/create" asChild>
                        <Pressable style={styles.menuItem}>
                            <MaterialDesignIcons
                                name="package-variant-closed-plus"
                                size={20}
                                color="#333"
                            />
                            <AppText size="large" style={styles.menuItemText}>
                                เพิ่มสินค้า
                            </AppText>
                            <MaterialDesignIcons name="chevron-right" size={20} color="#999" />
                        </Pressable>
                    </Link>
                </View>
                <AppText style={styles.menuGroupHeader} size="title">
                    การจัดการ
                </AppText>
                <View style={styles.menu}>
                    <Link href="/orders" asChild>
                        <Pressable style={styles.menuItem}>
                            <MaterialDesignIcons
                                name="file-document-multiple-outline"
                                size={20}
                                color="#333"
                            />
                            <AppText size="large" style={styles.menuItemText}>
                                คำสั่งซื้อ
                            </AppText>
                            <MaterialDesignIcons name="chevron-right" size={20} color="#999" />
                        </Pressable>
                    </Link>

                    {canManageUsers && (
                        <Link href="/users" asChild>
                            <Pressable style={styles.menuItem}>
                                <MaterialDesignIcons
                                    name="account-multiple-outline"
                                    size={20}
                                    color="#333"
                                />
                                <AppText size="large" style={styles.menuItemText}>
                                    ผู้ใช้งาน
                                </AppText>
                                <MaterialDesignIcons name="chevron-right" size={20} color="#999" />
                            </Pressable>
                        </Link>
                    )}
                </View>
            </View>

            <Pressable
                style={({ pressed }) => [
                    styles.logoutButton,
                    pressed && styles.logoutButtonPressed,
                ]}
                onPress={handleLogout}
            >
                <MaterialDesignIcons name="logout" size={20} color="#d00" />
                <AppText size="large" style={styles.logoutText}>
                    ออกจากระบบ
                </AppText>
            </Pressable>
        </View>
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
    roleRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 6,
        marginTop: 8,
        paddingHorizontal: 24,
    },
    roleChip: {
        backgroundColor: "#eee",
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    roleChipText: {
        color: "#555",
    },
    menuGroupHeader: { marginTop: 16, marginBottom: 8, marginHorizontal: 16 },
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
