import UserOrdersScreen from "@/screens/UserOrdersScreen";
import { useAuthStore } from "@/store/useAuthStore";
import { SafeAreaView } from "react-native-safe-area-context";

export default () => {
    const userId = useAuthStore((state) => state.userId);

    return (
        <SafeAreaView edges={["left", "right", "bottom"]} style={{ flex: 1 }}>
            <UserOrdersScreen orderById={userId!} />
        </SafeAreaView>
    );
};
