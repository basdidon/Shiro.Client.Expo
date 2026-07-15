import HeartButton from "@/components/HeartButton";
import Stepper from "@/components/Stepper";
import Tag from "@/components/ui/Tag";
import { useProduct } from "@/hooks/useProducts";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Button,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SingleProductPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const isProductManager = useAuthStore((state) => state.role === "ProductManager");
    const { data: product, isPending, isError, error, refetch } = useProduct(id);

    const cartItem = useCartStore((state) => state.cart.find((item) => item.id == id));
    const setItemToCart = useCartStore((state) => state.setItemToCart);

    const [quantity, setQuantity] = useState(cartItem?.quantity ?? 1);

    const [liked, setLiked] = useState(false);

    const headerRight = isProductManager
        ? () => (
              <Link href={{ pathname: "/products/[id]/edit", params: { id } }} asChild>
                  <Pressable hitSlop={8}>
                      <MaterialDesignIcons name="pencil" size={20} />
                  </Pressable>
              </Link>
          )
        : undefined;

    if (isPending) {
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <Stack.Screen options={{ title: "", headerRight }} />
                <ActivityIndicator size={64} />
            </View>
        );
    }

    if (isError) {
        return (
            <View style={{ flex: 1, gap: 16, justifyContent: "center", alignItems: "center" }}>
                <Stack.Screen options={{ title: "", headerRight }} />
                <Text>{error.message}</Text>
                <Button title="Reload" onPress={() => refetch()} />
            </View>
        );
    }

    const unitPrice = Number(product.unitPrice);

    return (
        <SafeAreaView
            edges={["left", "right", "bottom"]}
            style={{ flexDirection: "column", flex: 1 }}
        >
            <Stack.Screen options={{ title: "", headerRight }} />
            <View style={{ backgroundColor: "cyan", aspectRatio: 4 / 3 }} />
            <View style={{ margin: 8, flex: 1 }}>
                <View style={{ gap: 4, flexDirection: "column", alignItems: "flex-start" }}>
                    <Text style={{ fontSize: 10, color: "gray" }}>{id}</Text>
                    <Text style={{ fontSize: 28 }} numberOfLines={2}>
                        {product.name}
                    </Text>

                    <View style={{ flexDirection: "row", gap: 4 }}>
                        {product.barcodes.map((x) => (
                            <Tag key={x} label={x} />
                        ))}
                    </View>
                    <Text style={{ alignSelf: "flex-end", fontSize: 48 }}>{unitPrice}.-</Text>
                </View>
            </View>
            {/* Footer */}
            <View style={styles.footerContainer}>
                <View style={styles.footerRow}>
                    <View style={{ flex: 1 }}>
                        <Text>Total Price :</Text>
                        <Text style={{ fontSize: 24 }}>
                            <MaterialDesignIcons name="currency-thb" size={24} />
                            {unitPrice * quantity}
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
                                unitPrice,
                                quantity: quantity,
                            })
                        }
                    >
                        <Text style={styles.textButton}>เพิ่มลงในตะกร้า</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
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
        backgroundColor: "white",
        padding: 12,
        paddingTop: 18,
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
