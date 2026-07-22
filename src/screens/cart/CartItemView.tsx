import Stepper from "@/components/Stepper";
import AppText from "@/components/ui/AppText";
import { useCartStore, type CartItem } from "@/store/useCartStore";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

const CartItemView = ({ item }: { item: CartItem }) => {
    const setItem = useCartStore((state) => state.setItem);
    const removeItem = useCartStore((state) => state.removeItem);

    return (
        <View style={styles.card}>
            <Link href={{ pathname: "/products/[id]", params: { id: item.productId } }} asChild>
                <Pressable style={styles.infoRow}>
                    <View style={styles.image} />
                    <View style={{ flex: 1, gap: 2 }}>
                        <AppText size="large" numberOfLines={2}>
                            {item.productName}
                        </AppText>
                        <AppText size="small" style={styles.muted}>
                            @ {item.unitPrice} .-
                        </AppText>
                    </View>
                    <AppText size="label">{item.unitPrice * item.quantity} .-</AppText>
                </Pressable>
            </Link>
            <View style={styles.actionsRow}>
                <Pressable
                    hitSlop={8}
                    onPress={() => removeItem(item.productId)}
                    style={styles.deleteBtn}
                >
                    <MaterialDesignIcons name="trash-can-outline" size={20} color="#999" />
                </Pressable>
                <Stepper
                    value={item.quantity}
                    setValue={(quantity) => setItem({ ...item, quantity })}
                    size="small"
                />
            </View>
        </View>
    );
};

export default CartItemView;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#eee",
        padding: 12,
        gap: 8,
    },
    infoRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    image: { backgroundColor: "cyan", width: 64, height: 64, borderRadius: 8 },
    muted: { color: "gray" },
    actionsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    deleteBtn: { padding: 4 },
});
