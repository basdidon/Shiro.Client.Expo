import BestSellersView from "@/components/BestSellersView";
import { useProductByBarcode } from "@/hooks/useProducts";
import { showAlert } from "@/lib/alert";
import { formatBarcode } from "@/lib/barcode";
import { useAuthStore } from "@/store/useAuthStore";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import axios from "axios";
import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

export default function Index() {
    const roles = useAuthStore((state) => state.roles);
    const isProductManager = roles.includes("product-manager");
    const showDashboard =
        roles.includes("super-admin") || roles.includes("owner") || roles.includes("order-manager");

    const [barcode, setBarcode] = useState("");
    const { mutateAsync: lookupProductByBarcode, isPending } = useProductByBarcode();

    const handleSearch = async () => {
        const trimmed = barcode.trim();
        if (!trimmed) return;

        try {
            const product = await lookupProductByBarcode(trimmed);
            setBarcode("");
            router.push({ pathname: "/products/[id]", params: { id: product.id } });
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                if (isProductManager) {
                    showAlert(
                        "ไม่พบสินค้า",
                        `ไม่พบสินค้าสำหรับบาร์โค้ด: ${formatBarcode(trimmed)}\n\nต้องการสร้างสินค้าใหม่หรือไม่?`,
                        [
                            { text: "ยกเลิก", style: "cancel" },
                            {
                                text: "สร้างสินค้าใหม่",
                                onPress: () => {
                                    setBarcode("");
                                    router.push({
                                        pathname: "/products/create",
                                        params: { barcode: trimmed },
                                    });
                                },
                            },
                        ],
                    );
                } else {
                    showAlert(
                        "ไม่พบสินค้า",
                        `ไม่พบสินค้าสำหรับบาร์โค้ด: ${formatBarcode(trimmed)}`,
                    );
                }
            } else {
                showAlert("เกิดข้อผิดพลาด", "ไม่สามารถค้นหาสินค้าได้ กรุณาลองใหม่อีกครั้ง");
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <MaterialDesignIcons name="barcode-scan" size={20} color="gray" />
                <TextInput
                    value={barcode}
                    onChangeText={setBarcode}
                    placeholder="กรอกบาร์โค้ดสินค้า"
                    keyboardType="number-pad"
                    returnKeyType="search"
                    style={styles.searchInput}
                    onSubmitEditing={handleSearch}
                    editable={!isPending}
                />
                {isPending ? (
                    <ActivityIndicator size="small" />
                ) : (
                    <Pressable onPress={handleSearch} hitSlop={8} disabled={!barcode.trim()}>
                        <MaterialDesignIcons
                            name="magnify"
                            size={22}
                            color={barcode.trim() ? "#222" : "#ccc"}
                        />
                    </Pressable>
                )}
            </View>
            <ScrollView
                style={{ padding: 12 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 24, paddingBottom: 24 }}
            >
                <View
                    style={{ aspectRatio: 16 / 9, backgroundColor: "lightgray", borderRadius: 8 }}
                />
                {showDashboard && <BestSellersView />}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "white" },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginHorizontal: 12,
        marginTop: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: "#f5f5f5",
        borderRadius: 12,
    },
    searchInput: { flex: 1, fontSize: 14 },
});
