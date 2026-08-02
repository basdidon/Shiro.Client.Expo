import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { FlashList } from "@shopify/flash-list";
import { Link, Stack } from "expo-router";
import { ActivityIndicator, Alert, Button, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/components/ui/AppText";
import { useAddresses, useRemoveAddress } from "@/hooks/useAddresses";

export default function AddressesScreen() {
    const { data: addresses, isPending, isError, error, refetch } = useAddresses();
    const { mutate: removeAddress } = useRemoveAddress();

    const headerRight = () => (
        <Link href="/addresses/create" asChild>
            <Pressable>
                <MaterialDesignIcons name="plus" size={22} />
            </Pressable>
        </Link>
    );

    const handleRemove = (userAddressId: string) => {
        Alert.alert("ลบที่อยู่", "คุณต้องการลบที่อยู่นี้ใช่หรือไม่", [
            { text: "ยกเลิก", style: "cancel" },
            {
                text: "ลบ",
                style: "destructive",
                onPress: () => removeAddress(userAddressId),
            },
        ]);
    };

    if (isPending) {
        return (
            <View style={styles.loading}>
                <Stack.Screen options={{ headerRight }} />
                <ActivityIndicator size={64} />
            </View>
        );
    }

    if (isError) {
        return (
            <View style={styles.loading}>
                <Stack.Screen options={{ headerRight }} />
                <AppText>{error.message}</AppText>
                <Button title="Reload" onPress={() => refetch()} />
            </View>
        );
    }

    return (
        <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
            <Stack.Screen options={{ headerShown: true, headerRight }} />
            {addresses.length === 0 ? (
                <View style={styles.loading}>
                    <AppText style={{ color: "gray" }}>ยังไม่มีที่อยู่ที่บันทึกไว้</AppText>
                    <Link href="/addresses/create" asChild>
                        <Button title="เพิ่มที่อยู่จัดส่ง" />
                    </Link>
                </View>
            ) : (
                <FlashList
                    data={addresses}
                    keyExtractor={(item) => item.userAddressId}
                    contentContainerStyle={{ padding: 12 }}
                    renderItem={({ item }) => {
                        const a = item.shippingAddress;
                        return (
                            <View style={styles.card}>
                                <View style={styles.cardBody}>
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
                                <View style={styles.cardActions}>
                                    <Link
                                        href={{
                                            pathname: "/addresses/[id]/edit",
                                            params: { id: item.userAddressId },
                                        }}
                                        asChild
                                    >
                                        <Pressable style={styles.actionButton}>
                                            <MaterialDesignIcons
                                                name="pencil-outline"
                                                size={20}
                                                color="#555"
                                            />
                                        </Pressable>
                                    </Link>
                                    <Pressable
                                        style={styles.actionButton}
                                        onPress={() => handleRemove(item.userAddressId)}
                                    >
                                        <MaterialDesignIcons
                                            name="trash-can-outline"
                                            size={20}
                                            color="#d00"
                                        />
                                    </Pressable>
                                </View>
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
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
    },
    cardBody: { flex: 1, gap: 2 },
    cardActions: { flexDirection: "row", gap: 4 },
    actionButton: { padding: 8 },
    muted: { color: "gray" },
});
