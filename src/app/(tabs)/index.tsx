import DashboardScreen from "@/screens/DashboardScreen";
import { useAuthStore } from "@/store/useAuthStore";
import { StyleSheet, View } from "react-native";

export default function Index() {
    const roles = useAuthStore((state) => state.roles);
    const showDashboard =
        roles.includes("super-admin") || roles.includes("owner") || roles.includes("order-manager");

    if (showDashboard) {
        return <DashboardScreen />;
    }

    return <View style={styles.container} />;
}

const styles = StyleSheet.create({
    container: {},
});
