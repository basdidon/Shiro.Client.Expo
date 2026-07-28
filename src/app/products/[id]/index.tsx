import HeartButton from "@/components/HeartButton";
import Stepper from "@/components/Stepper";
import AppText from "@/components/ui/AppText";
import Tag from "@/components/ui/Tag";
import { useProduct, useProductImageDownloadUrl } from "@/hooks/useProducts";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Image } from "expo-image";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Button,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SingleProductPage() {
    const { id, type } = useLocalSearchParams<{ id: string; type: string }>();
    const isProductManager = useAuthStore((state) => state.roles.includes("product-manager"));
    const canAddToOrder = useAuthStore(
        (state) =>
            state.roles.includes("super-admin") ||
            state.roles.includes("owner") ||
            state.roles.includes("order-manager") ||
            state.roles.includes("staff"),
    );
    const { data: product, isPending, isError, error, refetch } = useProduct(id);
    const { data: detailImageUrl } = useProductImageDownloadUrl(
        id,
        "Detail",
        !!product?.hasDetailImage,
    );

    const cartItem = useCartStore((state) => state.items.find((item) => item.productId === id));
    const setCartItem = useCartStore((state) => state.setItem);
    const removeCartItem = useCartStore((state) => state.removeItem);

    const [quantity, setQuantity] = useState(cartItem?.quantity ?? 1);
    const [liked, setLiked] = useState(false);

    const isInCart = !!cartItem;
    const isRemoving = isInCart && quantity === 0;

    const handleAddToCart = () => {
        if (!product) return;

        setCartItem({
            productId: product.id,
            productName: product.name,
            unitPrice: Number(product.unitPrice),
            quantity,
        });
    };

    const handleCartButtonPress = () => {
        if (isRemoving) {
            removeCartItem(id);
        } else {
            handleAddToCart();
        }
        router.back();
    };

    const headerRight = () => (
        <Link href="/cart" asChild>
            <Pressable hitSlop={8}>
                <MaterialDesignIcons name="cart-outline" size={22} />
            </Pressable>
        </Link>
    );

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
            <ScrollView
                style={{ flex: 1, backgroundColor: "white" }}
                showsVerticalScrollIndicator={false}
            >
                {detailImageUrl ? (
                    <Image
                        source={{ uri: detailImageUrl }}
                        style={{ aspectRatio: 4 / 3 }}
                        contentFit="cover"
                    />
                ) : (
                    <View style={{ backgroundColor: "cyan", aspectRatio: 4 / 3 }} />
                )}
                <View style={{ margin: 8 }}>
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
                        <AppText>{type}</AppText>
                        <Text style={{ alignSelf: "flex-end", fontSize: 48 }}>{unitPrice}.-</Text>
                    </View>
                    <View>
                        <AppText size="title">เมนู</AppText>
                        <View
                            style={{
                                marginVertical: 12,
                                borderColor: "lightgray",
                                borderWidth: 1,
                                borderRadius: 12,
                                overflow: "hidden",
                                backgroundColor: "lightgray",
                                gap: 1,
                            }}
                        >
                            {canAddToOrder && (
                                <Link
                                    href={{
                                        pathname: "/products/[id]/add-to-order",
                                        params: { id },
                                    }}
                                    asChild
                                >
                                    <TouchableOpacity style={styles.menuBtn}>
                                        <View style={styles.iconContainer}>
                                            <MaterialDesignIcons
                                                name="file-document-plus-outline"
                                                size={24}
                                            />
                                        </View>
                                        <Text style={styles.menuBtnText}>
                                            เพิ่มสินค้าลงคำสั่งซื้อ
                                        </Text>
                                    </TouchableOpacity>
                                </Link>
                            )}
                            {isProductManager && (
                                <Link
                                    href={{ pathname: "/products/[id]/edit", params: { id } }}
                                    asChild
                                >
                                    <TouchableOpacity style={styles.menuBtn}>
                                        <View style={styles.iconContainer}>
                                            <MaterialDesignIcons
                                                name="file-edit-outline"
                                                size={24}
                                            />
                                        </View>
                                        <Text style={styles.menuBtnText}>แก้ไขสินค้า</Text>
                                    </TouchableOpacity>
                                </Link>
                            )}
                            {isProductManager && (
                                <Link
                                    href={{
                                        pathname: "/products/[id]/upload-image",
                                        params: { id },
                                    }}
                                    asChild
                                >
                                    <TouchableOpacity style={styles.menuBtn}>
                                        <View style={styles.iconContainer}>
                                            <MaterialDesignIcons
                                                name="image-edit-outline"
                                                size={24}
                                            />
                                        </View>
                                        <Text style={styles.menuBtnText}>แก้ไขรูปภาพ</Text>
                                    </TouchableOpacity>
                                </Link>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
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
                    <Stepper value={quantity} setValue={setQuantity} min={isInCart ? 0 : 1} />
                </View>
                <View style={styles.footerRow}>
                    <HeartButton value={liked} setValue={setLiked} />
                    <TouchableOpacity
                        style={[styles.btn, isRemoving && styles.removeBtn]}
                        onPress={handleCartButtonPress}
                    >
                        <Text style={styles.textButton}>
                            {isRemoving
                                ? "ลบออกจากตะกร้า"
                                : isInCart
                                  ? "อัปเดตตะกร้า"
                                  : "เพิ่มลงในตะกร้า"}
                        </Text>
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
        elevation: 5,
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
    removeBtn: { backgroundColor: "#c00" },
    iconContainer: {
        height: 36,
        width: 36,
        justifyContent: "center",
        alignItems: "center",
    },
    menuBtn: {
        flexDirection: "row",
        backgroundColor: "white",
        padding: 12,
        gap: 8,
        alignItems: "center",
    },
    menuBtnText: { textAlign: "center", fontSize: 20 },
    textButton: { color: "white", textAlign: "center", fontSize: 20 },
});
