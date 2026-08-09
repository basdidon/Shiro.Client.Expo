import { useAuthStore } from "@/store/useAuthStore";
import { Stack } from "expo-router";

export default () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isProductManager = useAuthStore((state) => state.roles.includes("product-manager"));
    const canManageOrderLines = useAuthStore(
        (state) => state.roles.includes("order-manager") || state.roles.includes("staff"),
    );
    const canManageUsers = useAuthStore(
        (state) => state.roles.includes("super-admin") || state.roles.includes("owner"),
    );
    const canAddToOrder = useAuthStore(
        (state) =>
            state.roles.includes("super-admin") ||
            state.roles.includes("owner") ||
            state.roles.includes("order-manager") ||
            state.roles.includes("staff"),
    );
    const isFinanceManager = useAuthStore((state) => state.roles.includes("finance-manager"));

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />

            <Stack.Screen
                name="products/[id]/index"
                options={{ headerShown: true, presentation: "modal" }}
            />

            <Stack.Protected guard={isAuthenticated && isProductManager}>
                <Stack.Screen
                    name="categories/create"
                    options={{ headerShown: true, headerTitle: "" }}
                />
                <Stack.Screen
                    name="categories"
                    options={{ headerShown: true, headerTitle: "หมวดหมู่" }}
                />
                <Stack.Screen
                    name="categories/[id]/edit"
                    options={{ headerShown: true, headerTitle: "" }}
                />
                <Stack.Screen
                    name="products/create"
                    options={{ headerShown: true, headerTitle: "" }}
                />
                <Stack.Screen
                    name="products/[id]/edit"
                    options={{ headerShown: true, headerTitle: "" }}
                />
                <Stack.Screen
                    name="products/[id]/upload-image/select-image-type"
                    options={{ presentation: "formSheet", sheetAllowedDetents: "fitToContents" }}
                />
                <Stack.Screen
                    name="products/[id]/upload-image/select-image-source"
                    options={{ presentation: "formSheet", sheetAllowedDetents: "fitToContents" }}
                />
            </Stack.Protected>

            <Stack.Protected guard={isAuthenticated && canManageOrderLines}>
                <Stack.Screen name="orders/[id]/edit" options={{ headerShown: true }} />
                <Stack.Screen name="orders/[id]/scan-item" options={{ headerShown: true }} />
            </Stack.Protected>

            <Stack.Protected guard={isAuthenticated && canManageUsers}>
                <Stack.Screen
                    name="users/index"
                    options={{ headerShown: true, title: "ผู้ใช้งาน" }}
                />
                <Stack.Screen name="users/[id]" options={{ headerShown: true, title: "" }} />
            </Stack.Protected>

            <Stack.Protected guard={isAuthenticated && canAddToOrder}>
                <Stack.Screen
                    name="products/[id]/add-to-order"
                    options={{ headerShown: true, title: "เลือกคำสั่งซื้อ" }}
                />
            </Stack.Protected>

            <Stack.Protected guard={isFinanceManager}>
                <Stack.Screen
                    name="payments/index"
                    options={{ headerShown: true, headerTitle: "" }}
                />
            </Stack.Protected>
        </Stack>
    );
};
