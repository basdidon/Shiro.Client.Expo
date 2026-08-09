import BestSellersView from "@/components/BestSellersView";
import DashboardScreen from "@/screens/DashboardScreen";
import { useAuthStore } from "@/store/useAuthStore";
import { ScrollView, StyleSheet, View } from "react-native";

export default () => {
    const roles = useAuthStore((state) => state.roles);
    const isProductManager = roles.includes("product-manager");
    const showDashboard =
        roles.includes("super-admin") || roles.includes("owner") || roles.includes("order-manager");
    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={{ padding: 12, gap: 8 }}
                showsVerticalScrollIndicator={false}
            >
                {showDashboard && <DashboardScreen />}
                {showDashboard && <BestSellersView />}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
});
