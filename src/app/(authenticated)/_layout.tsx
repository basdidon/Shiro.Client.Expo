import { useAuthStore } from "@/store/useAuthStore";
import { Stack } from "expo-router";

export default function AuthenticatedLayout() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const canAccessBackstore = useAuthStore(
        (state) =>
            state.roles.includes("super-admin") ||
            state.roles.includes("owner") ||
            state.roles.includes("finance-manager") ||
            state.roles.includes("product-manager") ||
            state.roles.includes("order-manager") ||
            state.roles.includes("staff"),
    );

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={isAuthenticated && canAccessBackstore}>
                <Stack.Screen name="(backstore)" />
            </Stack.Protected>

            <Stack.Screen name="(frontstore)" />
            <Stack.Screen name="user/payments" options={{ headerShown: true, title: "" }} />
            <Stack.Screen name="user/addresses" options={{ headerShown: true, title: "" }} />
            <Stack.Screen
                name="user/addresses/[id]/edit"
                options={{ headerShown: true, title: "" }}
            />
            <Stack.Screen
                name="user/orders"
                options={{ headerShown: true, title: "คำสั่งซื้อของฉัน" }}
            />
            <Stack.Screen name="orders/[id]" options={{ headerShown: true, title: "" }} />
        </Stack>
    );
}
