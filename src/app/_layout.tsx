import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

const queryClient = new QueryClient();
export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="cart" options={{ headerShown: true }} />
                <Stack.Screen name="products" options={{ headerShown: true }} />
                <Stack.Screen name="products/[id]" options={{ headerShown: true }} />
            </Stack>
        </QueryClientProvider>
    );
}
