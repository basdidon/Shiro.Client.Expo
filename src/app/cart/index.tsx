import { useCartStore } from "@/store/useCartStore";
import { CartItem } from "@/types/CartItem";
import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Cart() {
    var carts = useCartStore((state) => state.cart);
    var totalPrice = useCartStore((state) =>
        state.cart.reduce((prev, item, idx, array) => prev + item.quantity * item.unitPrice, 0),
    );

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                {carts.map((x) => (
                    <CartItemView item={x} />
                ))}
            </View>
            <View style={styles.footer}>
                <View style={{ marginBottom: 24 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                        }}
                    >
                        <Text>total price</Text>
                        <Text style={{ fontSize: 24 }}>{totalPrice}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.submitBtn}>
                    <Text style={styles.submitTxtBtn}>Place Order</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const CartItemView = ({ item }: { item: CartItem }) => {
    return (
        <Link href={{ pathname: "/products/[id]", params: { id: item.id } }} asChild>
            <View style={{ flexDirection: "row", gap: 8 }}>
                <View style={{ backgroundColor: "cyan", width: 92, aspectRatio: 1 }} />
                <View>
                    <Text>{item.name}</Text>
                    <Text>{item.quantity}</Text>
                </View>
            </View>
        </Link>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    contentContainer: { flex: 1, margin: 12, gap: 8 },
    footer: { backgroundColor: "white", padding: 12, paddingHorizontal: 16 },
    submitBtn: { backgroundColor: "blue", padding: 8, borderRadius: 8 },
    submitTxtBtn: { color: "white", fontSize: 24, fontWeight: "bold", textAlign: "center" },
});
