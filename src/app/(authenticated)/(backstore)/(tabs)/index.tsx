import BestSellersView from "@/components/BestSellersView";
import AppText from "@/components/ui/AppText";
import DashboardScreen from "@/screens/DashboardScreen";
import { useAuthStore } from "@/store/useAuthStore";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

export default () => {
    const roles = useAuthStore((state) => state.roles);
    const showDashboard =
        roles.includes("super-admin") || roles.includes("owner") || roles.includes("order-manager");
    const isSuperAdmin = roles.includes("super-admin");
    const isOwner = roles.includes("owner");
    const isProductManager = roles.includes("product-manager");
    const isOrderManager = roles.includes("order-manager");
    const isStaffMember = roles.includes("staff");
    const isFinanceManager = roles.includes("finance-manager");
    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={{ padding: 12, gap: 12 }}
                showsVerticalScrollIndicator={false}
            >
                {showDashboard && <DashboardScreen />}
                {showDashboard && <BestSellersView />}
                <>
                    <AppText style={styles.menuGroupHeader} size="title">
                        ฐานข้อมูล
                    </AppText>
                    <View style={styles.menu}>
                        {(isSuperAdmin || isOwner) && (
                            <Link href="/users" asChild>
                                <Pressable style={styles.menuItem}>
                                    <MaterialDesignIcons
                                        name="account-group-outline"
                                        size={20}
                                        color="#333"
                                    />
                                    <AppText size="large" style={styles.menuItemText}>
                                        ผู้ใช้งาน
                                    </AppText>
                                    <MaterialDesignIcons
                                        name="chevron-right"
                                        size={20}
                                        color="#999"
                                    />
                                </Pressable>
                            </Link>
                        )}
                        <Link href="/categories" asChild>
                            <Pressable style={styles.menuItem}>
                                <MaterialDesignIcons
                                    name="view-grid-outline"
                                    size={20}
                                    color="#333"
                                />
                                <AppText size="large" style={styles.menuItemText}>
                                    หมวดหมู่สินค้า
                                </AppText>
                                <MaterialDesignIcons name="chevron-right" size={20} color="#999" />
                            </Pressable>
                        </Link>
                        {isProductManager && (
                            <Link href="/(authenticated)/(backstore)/(tabs)/products" asChild>
                                <Pressable style={styles.menuItem}>
                                    <MaterialDesignIcons
                                        name="package-variant-closed"
                                        size={20}
                                        color="#333"
                                    />
                                    <AppText size="large" style={styles.menuItemText}>
                                        รายการสินค้า
                                    </AppText>
                                    <MaterialDesignIcons
                                        name="chevron-right"
                                        size={20}
                                        color="#999"
                                    />
                                </Pressable>
                            </Link>
                        )}
                        {(isOrderManager || isStaffMember) && (
                            <Link href="/(authenticated)/(backstore)/(tabs)/orders" asChild>
                                <Pressable style={styles.menuItem}>
                                    <MaterialDesignIcons
                                        name="file-document-multiple-outline"
                                        size={20}
                                        color="#333"
                                    />
                                    <AppText size="large" style={styles.menuItemText}>
                                        คำสั่งซื้อ
                                    </AppText>
                                    <MaterialDesignIcons
                                        name="chevron-right"
                                        size={20}
                                        color="#999"
                                    />
                                </Pressable>
                            </Link>
                        )}
                        {isFinanceManager && (
                            <Link href="/payments" asChild>
                                <Pressable style={styles.menuItem}>
                                    <MaterialDesignIcons
                                        name="cash-multiple"
                                        size={20}
                                        color="#333"
                                    />
                                    <AppText size="large" style={styles.menuItemText}>
                                        ประวัติการชำระเงิน
                                    </AppText>
                                    <MaterialDesignIcons
                                        name="chevron-right"
                                        size={20}
                                        color="#999"
                                    />
                                </Pressable>
                            </Link>
                        )}
                    </View>
                </>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    menuGroupHeader: { marginTop: 16, marginBottom: 8 },
    menu: {
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
});
