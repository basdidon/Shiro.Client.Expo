import OfflineBanner from "@/components/OfflineBanner";
import { useNotificationObserver } from "@/hooks/useNotificationObserver";
import { useRegisterPushToken } from "@/hooks/useNotifications";
import "@/lib/networkStatus";
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
                <Stack.Screen name="(authenticated)" />
            </Stack.Protected>

            <Stack.Protected guard={!isAuthenticated}>
                <Stack.Screen name="login" options={{ headerShown: true, headerTitle: "" }} />
                <Stack.Screen name="register" options={{ headerShown: true, headerTitle: "" }} />
                <Stack.Screen name="verify-otp" options={{ headerShown: true, headerTitle: "" }} />
            </Stack.Protected>

            <Stack.Screen name="app-info" options={{ headerShown: true, headerTitle: "" }} />
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
                <OfflineBanner />
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
