import RadioPillButtonGroup from "@/components/RadioButtonPillGroup";
import AppText from "@/components/ui/AppText";
import { useOrders } from "@/hooks/useOrders";
import { formatDateTime } from "@/lib/date";
import type { components } from "@/types/api";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Link } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type OrderStatus = components["schemas"]["OrderStatus"];

const STATUS_OPTIONS: { id: number; label: string; value: string; status?: OrderStatus }[] = [
    { id: 1, label: "All", value: "all" },
    { id: 2, label: "Created", value: "created", status: 0 },
    { id: 3, label: "Completed", value: "completed", status: 1 },
    { id: 4, label: "Cancelled", value: "cancelled", status: 2 },
];

export default function Orders() {
    const [selectedId, setSelectedId] = useState<string>("2");
    const status = STATUS_OPTIONS.find((x) => x.id.toString() === selectedId)?.status;

    const { data, isPending } = useOrders(20, status);
    const orders = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

    return (
        <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
            <View style={{ margin: 12, marginVertical: 8 }}>
                <RadioPillButtonGroup
                    options={STATUS_OPTIONS}
                    selectedId={selectedId}
                    onPress={setSelectedId}
                />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {isPending ? (
                    <ActivityIndicator style={{ marginTop: 24 }} />
                ) : orders.length === 0 ? (
                    <AppText style={{ textAlign: "center", color: "gray", marginTop: 24 }}>
                        ยังไม่มีคำสั่งซื้อ
                    </AppText>
                ) : (
                    orders.map((x) => (
                        <Link
                            key={x.orderId}
                            href={{ pathname: "/orders/[id]", params: { id: x.orderId! } }}
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
                                <View
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: 88,
                                        aspectRatio: 1,
                                        backgroundColor: "beige",
                                        borderRadius: 12,
                                    }}
                                >
                                    <MaterialDesignIcons
                                        name="file-document-outline"
                                        size={64}
                                        color={"lightsalmon"}
                                    />
                                </View>
                                <View style={{ rowGap: 4 }}>
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: "bold",
                                            letterSpacing: 0.5,
                                        }}
                                    >
                                        # {x.orderId?.slice(0, 8)}
                                    </Text>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <MaterialDesignIcons
                                            name="account-outline"
                                            size={20}
                                            color={"gray"}
                                            style={{ marginRight: 8 }}
                                        />
                                        <AppText style={{ color: "gray" }}>{x.orderByName}</AppText>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <MaterialDesignIcons
                                            name="clock-plus-outline"
                                            size={20}
                                            color={"gray"}
                                            style={{ marginRight: 8 }}
                                        />
                                        <AppText style={{ color: "gray" }}>
                                            {formatDateTime(x.createdAt)}
                                        </AppText>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <MaterialDesignIcons
                                            name="list-box-outline"
                                            size={20}
                                            color={"gray"}
                                            style={{ marginRight: 8 }}
                                        />
                                        <AppText style={{ color: "gray" }}>
                                            {x.orderLines?.length ?? 0} รายการ
                                        </AppText>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <MaterialDesignIcons
                                            name="currency-thb"
                                            size={20}
                                            color={"gray"}
                                            style={{ marginRight: 8 }}
                                        />
                                        <AppText style={{ fontSize: 14, fontWeight: "600" }}>
                                            {x.orderLines?.reduce(
                                                (sum, line) => sum + Number(line.lineTotal ?? 0),
                                                0,
                                            )}
                                            .-
                                        </AppText>
                                    </View>
                                </View>
                            </Pressable>
                        </Link>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
