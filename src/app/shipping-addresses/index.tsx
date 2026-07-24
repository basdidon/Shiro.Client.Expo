import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { FlashList } from "@shopify/flash-list";
import { Link, Stack } from "expo-router";
import { ActivityIndicator, Button, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/components/ui/AppText";
import { useShippingAddresses } from "@/hooks/useShippingAddresses";

export default function ShippingAddressesScreen() {
    const { data: addresses, isPending, isError, error, refetch } = useShippingAddresses();

    const headerRight = () => (
        <Link href="/shipping-addresses/create" asChild>
            <Pressable>
                <MaterialDesignIcons name="plus" size={22} />
            </Pressable>
        </Link>
    );

    if (isPending) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size={64} />
            </View>
        );
    }

    if (isError) {
        return (
            <View style={styles.loading}>
                <AppText>{error.message}</AppText>
                <Button title="Reload" onPress={() => refetch()} />
            </View>
        );
    }

    return (
        <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
            <Stack.Screen options={{ headerRight }} />
            {addresses.length === 0 ? (
                <View style={styles.loading}>
                    <AppText style={{ color: "gray" }}>ยังไม่มีที่อยู่ที่บันทึกไว้</AppText>
                    <Link href="/shipping-addresses/create" asChild>
                        <Button title="เพิ่มที่อยู่จัดส่ง" />
                    </Link>
                </View>
            ) : (
                <FlashList
                    data={addresses}
                    keyExtractor={(item) => item.userShippingAddressId}
                    contentContainerStyle={{ padding: 12 }}
                    renderItem={({ item }) => {
                        const a = item.shippingAddress;
                        return (
                            <View style={styles.card}>
                                <AppText size="large">{a.addressLine1}</AppText>
                                {a.addressLine2 ? (
                                    <AppText style={styles.muted}>{a.addressLine2}</AppText>
                                ) : null}
                                <AppText style={styles.muted}>
                                    {[a.subDistrict, a.district, a.province, a.zipCode]
                                        .filter(Boolean)
                                        .join(" ")}
                                </AppText>
                            </View>
                        );
                    }}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loading: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16 },
    card: {
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 12,
        padding: 12,
        gap: 2,
        marginBottom: 10,
    },
    muted: { color: "gray" },
});
