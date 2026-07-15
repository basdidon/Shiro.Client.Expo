import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { useAuthStore } from "@/store/useAuthStore";

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
    const isProductManager = useAuthStore((state) => state.role === "ProductManager");

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={isAuthenticated}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="cart" options={{ headerShown: true }} />
                <Stack.Screen name="orders" options={{ headerShown: true }} />
                <Stack.Screen name="orders/[id]" options={{ headerShown: true }} />
                <Stack.Screen name="products/[id]" options={{ headerShown: true }} />
            </Stack.Protected>

            <Stack.Protected guard={isAuthenticated && isProductManager}>
                <Stack.Screen name="products/create" options={{ headerShown: true }} />
                <Stack.Screen name="products/[id]/edit" options={{ headerShown: true }} />
                <Stack.Screen name="categories/create" options={{ headerShown: true }} />
                <Stack.Screen name="categories/[id]/edit" options={{ headerShown: true }} />
            </Stack.Protected>

            <Stack.Protected guard={!isAuthenticated}>
                <Stack.Screen name="login" options={{ headerShown: true }} />
                <Stack.Screen name="register" options={{ headerShown: true }} />
            </Stack.Protected>
        </Stack>
    );
}

export default function RootLayout() {
    useEffect(() => {
        useAuthStore.getState().init();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <SplashScreenController />
            <RootNavigator />
        </QueryClientProvider>
    );
}
