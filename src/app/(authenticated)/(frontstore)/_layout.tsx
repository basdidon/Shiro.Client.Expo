import { Stack } from "expo-router";

export default () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />

            <Stack.Screen
                name="products/[id]/index"
                options={{ headerShown: true, presentation: "modal" }}
            />
            <Stack.Screen
                name="cart"
                options={{ headerShown: true, headerTitle: "ตะกร้าของฉัน" }}
            />
        </Stack>
    );
};
