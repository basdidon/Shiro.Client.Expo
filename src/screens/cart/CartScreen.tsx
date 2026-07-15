import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CartItemView from "./CartItemView";

export default function Cart() {
    const cart = useCartStore((state) => state.cart);
    const clearCart = useCartStore((state) => state.clearCart);
    const placeOrder = useOrderStore((state) => state.placeOrder);
    const totalPrice = useCartStore((state) =>
        state.cart.reduce((prev, item) => prev + item.quantity * item.unitPrice, 0),
    );

    const handlePlaceOrder = () => {
        if (cart.length === 0) return;
        const order = placeOrder(cart);
        clearCart();
        router.push({ pathname: "/orders/[id]", params: { id: order.id } });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    {cart.map((x) => (
                        <CartItemView key={x.id} item={x} />
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
                    <TouchableOpacity
                        style={[styles.submitBtn, cart.length === 0 && styles.submitBtnDisabled]}
                        onPress={handlePlaceOrder}
                        disabled={cart.length === 0}
                    >
                        <Text style={styles.submitTxtBtn}>Place Order</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    contentContainer: { flex: 1, margin: 12, gap: 8 },
    footer: { backgroundColor: "white", padding: 12, paddingHorizontal: 16 },
    submitBtn: { backgroundColor: "blue", padding: 8, borderRadius: 8 },
    submitBtnDisabled: { backgroundColor: "#ccc" },
    submitTxtBtn: { color: "white", fontSize: 20, fontWeight: "bold", textAlign: "center" },
});
