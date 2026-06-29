import HeartButton from "@/components/HeartButton";
import Stepper from "@/components/Stepper";
import { getProductById } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const product = getProductById(id);

    const cartItem = useCartStore((state) => state.cart.find((item) => item.id == id));
    const setItemToCart = useCartStore((state) => state.setItemToCart);

    const [quantity, setQuantity] = useState(cartItem?.quantity ?? 1);

    const [liked, setLiked] = useState(false);

    if (!product) return;

    return (
        <View style={styles.container}>
            {/* Product Image Placeholder */}
            <View style={{ backgroundColor: "cyan", aspectRatio: 4 / 3 }} />
            <View style={styles.mainContainer}>
                {/* Content */}
                <View style={styles.contentContainer}>
                    <Text style={styles.nameLabel}>{product.name}</Text>
                    <Text style={{ flex: 1, fontSize: 36, fontWeight: "bold", textAlign: "right" }}>
                        <MaterialDesignIcons name="currency-thb" size={36} />
                        {product.unitPrice}
                    </Text>
                    <Text>{id}</Text>
                </View>
                {/* Footer */}
                <View style={styles.footerContainer}>
                    <View style={styles.footerRow}>
                        <View style={{ flex: 1 }}>
                            <Text>Total Price :</Text>
                            <Text style={{ fontSize: 24 }}>
                                <MaterialDesignIcons name="currency-thb" size={24} />
                                {product.unitPrice * quantity}
                            </Text>
                        </View>
                        <Stepper value={quantity} setValue={setQuantity} />
                    </View>
                    <View style={styles.footerRow}>
                        <HeartButton value={liked} setValue={setLiked} />
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() =>
                                setItemToCart({
                                    id: product.id,
                                    name: product.name,
                                    unitPrice: product.unitPrice,
                                    quantity: quantity,
                                })
                            }
                        >
                            <Text style={styles.textButton}>เพิ่มลงในตะกร้า</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainContainer: { flex: 1, margin: 12, marginHorizontal: 20 },
    contentContainer: { flex: 1 },
    nameLabel: { fontSize: 24, fontWeight: "bold" },
    footerContainer: {
        marginTop: 24,
        marginBottom: 12,
        gap: 16,
    },
    footerRow: {
        flexDirection: "row",
        alignItems: "stretch",
        gap: 8,
    },
    btn: {
        backgroundColor: "blue",
        color: "white",
        paddingVertical: 12,
        borderRadius: 12,
        flex: 2,
    },
    textButton: { color: "white", textAlign: "center", fontSize: 20 },
});
