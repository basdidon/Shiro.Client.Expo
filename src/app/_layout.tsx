import { useNotificationObserver } from "@/hooks/useNotificationObserver";
import { useRegisterPushToken } from "@/hooks/useNotifications";
import { registerForPushNotificationsAsync } from "@/lib/notification";
import { useAuthStore } from "@/store/useAuthStore";
import { CherryBombOne_400Regular } from "@expo-google-fonts/cherry-bomb-one";
import { Coiny_400Regular } from "@expo-google-fonts/coiny";
import {
    Mali_200ExtraLight,
    Mali_300Light,
    Mali_400Regular,
    Mali_500Medium,
    Mali_600SemiBold,
    Mali_700Bold,
    useFonts,
} from "@expo-google-fonts/mali";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function SplashScreenController({ fontsLoaded }: { fontsLoaded: boolean }) {
    const isLoading = useAuthStore((state) => state.isLoading);

    useEffect(() => {
        if (!isLoading && fontsLoaded) {
            SplashScreen.hide();
        }
    }, [isLoading, fontsLoaded]);

    return null;
}

// Registers this device's Expo push token with the backend. Runs on every
// app start (once signed in) rather than only once, since the token can
// rotate and the endpoint upserts, so re-sending it is cheap and keeps the
// backend's copy fresh.
function PushTokenRegistrar() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const { mutate: registerPushToken } = useRegisterPushToken();

    useEffect(() => {
        if (!isAuthenticated) return;

        registerForPushNotificationsAsync()
            .then((token) => {
                if (!token) return;
                registerPushToken({
                    token,
                    platform: Platform.OS === "ios" ? "IOS" : "ANDROID",
                });
            })
            .catch((error: unknown) => console.error("[PushToken] registration failed:", error));
    }, [isAuthenticated, registerPushToken]);

    return null;
}

function RootNavigator() {
    const isLoading = useAuthStore((state) => state.isLoading);
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

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

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
    const [fontsLoaded, fontError] = useFonts({
        Mali_200ExtraLight,
        Mali_300Light,
        Mali_400Regular,
        Mali_500Medium,
        Mali_600SemiBold,
        Mali_700Bold,
        CherryBombOne_400Regular,
        Coiny_400Regular,
    });

    useNotificationObserver();

    useEffect(() => {
        useAuthStore.getState().init();
    }, []);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <KeyboardProvider>
                <StatusBar style="dark" />
                <SplashScreenController fontsLoaded={fontsLoaded || !!fontError} />
                <PushTokenRegistrar />
                <RootNavigator />
            </KeyboardProvider>
        </QueryClientProvider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#208AEF",
    },
});
