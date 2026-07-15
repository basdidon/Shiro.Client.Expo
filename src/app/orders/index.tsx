import RadioPillButtonGroup from "@/components/RadioButtonPillGroup";
import AppText from "@/components/ui/AppText";
import { useOrderStore } from "@/store/useOrderStore";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Link } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Orders() {
    const orders = useOrderStore((state) => state.orders);
    const [selectedId, setSelectedId] = useState<string | undefined>();
    const options = useMemo(
        () => [
            {
                id: 1,
                label: "All",
                value: "all",
            },
            {
                id: 2,
                label: "Pending",
                value: "pending",
            },
            {
                id: 3,
                label: "Preparing",
                value: "preparing",
            },
            {
                id: 4,
                label: "On Delivery",
                value: "onDelivery",
            },
            {
                id: 5,
                label: "Completed",
                value: "completed",
            },
        ],
        [],
    );

    return (
        <SafeAreaView edges={["left", "right"]} style={styles.container}>
            <RadioPillButtonGroup
                options={options}
                selectedId={selectedId}
                onPress={setSelectedId}
            />
            <View style={{ marginTop: 24 }}>
                {orders.length === 0 ? (
                    <AppText style={{ textAlign: "center", color: "gray", marginTop: 24 }}>
                        ยังไม่มีคำสั่งซื้อ
                    </AppText>
                ) : (
                    orders.map((x) => (
                        <Link
                            key={x.id}
                            href={{ pathname: "/orders/[id]", params: { id: x.id } }}
                            asChild
                        >
                            <Pressable
                                style={{
                                    flexDirection: "row",
                                    backgroundColor: "white",
                                    padding: 12,
                                    columnGap: 12,
                                    marginBottom: 8,
                                }}
                            >
                                <MaterialDesignIcons
                                    name="file-document-outline"
                                    size={64}
                                    style={{ backgroundColor: "cyan", borderRadius: 12 }}
                                />
                                <View style={{ rowGap: 4 }}>
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: "bold",
                                            letterSpacing: 0.5,
                                        }}
                                    >
                                        # {String(x.orderNumber).padStart(4, "0")}
                                    </Text>
                                    <Text style={{ fontSize: 12, color: "gray" }}>
                                        รายการ {x.items.length}
                                    </Text>
                                    <Text style={{ fontSize: 14, fontWeight: "600" }}>
                                        {x.totalPrice} .-
                                    </Text>
                                </View>
                            </Pressable>
                        </Link>
                    ))
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 8,
    },
});
