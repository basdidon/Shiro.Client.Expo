import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="cart" options={{ headerShown: true }} />
            <Stack.Screen name="products" options={{ headerShown: true }} />
            <Stack.Screen name="products/[id]" options={{ headerShown: true }} />
        </Stack>
    );
}
