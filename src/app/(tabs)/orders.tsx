import RadioPillButtonGroup from "@/components/RadioButtonPillGroup";
import { Order } from "@/types/Product";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const orders: Order[] = [
    {
        id: "15455452256",
        orderNumber: 1,
        itemsCount: 10,
        orderBy: "New York",
    },
    {
        id: "15455452257",
        orderNumber: 2,
        itemsCount: 199,
        orderBy: "New York",
    },
];

export default function Orders() {
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
        <View style={styles.container}>
            <RadioPillButtonGroup
                options={options}
                selectedId={selectedId}
                onPress={setSelectedId}
            />
            <View style={{ marginTop: 24 }}>
                {orders.map((x) => (
                    <View
                        key={x.id}
                        style={{
                            flexDirection: "row",
                            backgroundColor: "white",
                            padding: 12,
                            columnGap: 12,
                        }}
                    >
                        <MaterialDesignIcons
                            name="file-document-outline"
                            size={64}
                            style={{ backgroundColor: "cyan", borderRadius: 12 }}
                        />
                        <View style={{ rowGap: 4 }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold", letterSpacing: 0.5 }}>
                                # {String(x.orderNumber).padStart(4, "0")}
                            </Text>
                            <Text>{x.orderBy}</Text>
                            <Text style={{ fontSize: 12, color: "gray" }}>
                                รายการ {x.itemsCount}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 8,
    },
});
