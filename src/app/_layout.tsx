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
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
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

// Defines how notifications are handled while the app is in the foreground
// (by default, foreground notifications are silent/hidden unless you set
// this handler). This tells Expo to still play a sound, show a banner,
// update the app badge, and appear in the notification list/tray.
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

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

    // Holds the Expo push token for this device once registration succeeds
    // (or an error message string if it failed). Currently unused elsewhere,
    // but this is where you'd read it to send it to your backend.
    const [expoPushToken, setExpoPushToken] = useState("");
    // Holds the most recently received notification while the app is open,
    // e.g. to display an in-app banner. Currently unused elsewhere.
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
        undefined,
    );

    useEffect(() => {
        useAuthStore.getState().init();

        // Ask for permission and fetch this device's Expo push token.
        registerForPushNotificationsAsync()
            .then((token) => setExpoPushToken(token ?? ""))
            .catch((error: any) => setExpoPushToken(`${error}`));

        // Fires whenever a notification arrives while the app is running
        // (foreground or background), regardless of whether the user taps it.
        const notificationListener = Notifications.addNotificationReceivedListener(
            (notification) => {
                setNotification(notification);
            },
        );

        // Fires when the user taps/interacts with a notification (e.g. taps
        // it to open the app). Useful for deep-linking to a specific screen
        // based on the notification's data payload.
        const responseListener = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                console.log(response);
            },
        );

        // Clean up both listeners on unmount to avoid duplicate handlers /
        // memory leaks.
        return () => {
            notificationListener.remove();
            responseListener.remove();
        };
    }, []);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <KeyboardProvider>
                <StatusBar style="dark" />
                <SplashScreenController fontsLoaded={fontsLoaded || !!fontError} />
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
