import { useCartStore } from "@/store/useCartStore";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CartItemView from "./CartItemView";

export default function Cart() {
    var carts = useCartStore((state) => state.cart);
    var totalPrice = useCartStore((state) =>
        state.cart.reduce((prev, item, idx, array) => prev + item.quantity * item.unitPrice, 0),
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    {carts.map((x) => (
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
                    <TouchableOpacity style={styles.submitBtn}>
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
    submitTxtBtn: { color: "white", fontSize: 20, fontWeight: "bold", textAlign: "center" },
});
