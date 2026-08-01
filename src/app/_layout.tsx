import { useAuthStore } from "@/store/useAuthStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function SplashScreenController() {
    const isLoading = useAuthStore((state) => state.isLoading);

    useEffect(() => {
        if (!isLoading) {
            SplashScreen.hide();
        }
    }, [isLoading]);

    return null;
}

function RootNavigator() {
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

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={isAuthenticated}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen
                    name="cart"
                    options={{ headerShown: true, headerTitle: "ตะกร้าของฉัน" }}
                />
                <Stack.Screen
                    name="orders"
                    options={{ headerShown: true, headerTitle: "คำสั่งซื้อ" }}
                />
                <Stack.Screen name="orders/[id]" options={{ headerShown: true, headerTitle: "" }} />
                <Stack.Screen name="products/[id]" options={{ headerShown: true }} />
                <Stack.Screen
                    name="payments/index"
                    options={{ headerShown: true, headerTitle: "การชำระเงิน" }}
                />
                <Stack.Screen name="addresses" options={{ title: "" }} />
            </Stack.Protected>

            <Stack.Protected guard={isAuthenticated && isProductManager}>
                <Stack.Screen
                    name="products/create"
                    options={{ headerShown: true, headerTitle: "" }}
                />
                <Stack.Screen
                    name="products/[id]/edit"
                    options={{ headerShown: true, headerTitle: "" }}
                />
                <Stack.Screen
                    name="categories/create"
                    options={{ headerShown: true, headerTitle: "" }}
                />
                <Stack.Screen
                    name="categories/manage"
                    options={{ headerShown: true, headerTitle: "หมวดหมู่" }}
                />
                <Stack.Screen
                    name="categories/[id]/edit"
                    options={{ headerShown: true, headerTitle: "" }}
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

            <Stack.Protected guard={!isAuthenticated}>
                <Stack.Screen name="login" options={{ headerShown: true, headerTitle: "" }} />
                <Stack.Screen name="register" options={{ headerShown: true, headerTitle: "" }} />
                <Stack.Screen name="verify-otp" options={{ headerShown: true, headerTitle: "" }} />
            </Stack.Protected>

            <Stack.Screen name="app-info" options={{ headerShown: true, headerTitle: "" }} />
            <Stack.Screen
                name="products/[id]/upload-image/select-image-type"
                options={{ presentation: "formSheet", sheetAllowedDetents: "fitToContents" }}
            />
            <Stack.Screen
                name="products/[id]/upload-image/select-image-source"
                options={{ presentation: "formSheet", sheetAllowedDetents: "fitToContents" }}
            />
        </Stack>
    );
}

export default function RootLayout() {
    useEffect(() => {
        useAuthStore.getState().init();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <KeyboardProvider>
                <StatusBar style="dark" />
                <SplashScreenController />
                <RootNavigator />
            </KeyboardProvider>
        </QueryClientProvider>
    );
}
