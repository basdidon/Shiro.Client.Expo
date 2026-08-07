import axios from "axios";
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from "expo-camera";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";
import { Button, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/components/ui/AppText";
import { useProductByBarcode } from "@/hooks/useProducts";
import { showAlert } from "@/lib/alert";
import { formatBarcode } from "@/lib/barcode";
import { useAuthStore } from "@/store/useAuthStore";

export default function ScannerScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const isProductManager = useAuthStore((state) => state.roles.includes("product-manager"));
    const { mutateAsync: lookupProductByBarcode } = useProductByBarcode();

    // guards against onBarcodeScanned firing repeatedly for the same scan while
    // the lookup/alert for the previous one is still in flight
    const lockedRef = useRef(false);

    useFocusEffect(
        useCallback(() => {
            lockedRef.current = false;
        }, []),
    );

    const unlock = () => {
        lockedRef.current = false;
    };

    const handleBarcodeScanned = async ({ data: barcode }: BarcodeScanningResult) => {
        if (lockedRef.current) return;
        lockedRef.current = true;

        try {
            const product = await lookupProductByBarcode(barcode);
            router.push({ pathname: "/products/[id]", params: { id: product.id } });
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                if (isProductManager) {
                    showAlert(
                        "ไม่พบสินค้า",
                        `ไม่พบสินค้าสำหรับบาร์โค้ด: ${formatBarcode(barcode)}\n\nต้องการสร้างสินค้าใหม่หรือไม่?`,
                        [
                            { text: "ยกเลิก", style: "cancel", onPress: unlock },
                            {
                                text: "สร้างสินค้าใหม่",
                                onPress: () =>
                                    router.push({
                                        pathname: "/products/create",
                                        params: { barcode },
                                    }),
                            },
                        ],
                    );
                } else {
                    showAlert(
                        "ไม่พบสินค้า",
                        `ไม่พบสินค้าสำหรับบาร์โค้ด: ${formatBarcode(barcode)}`,
                        [{ text: "ตกลง", onPress: unlock }],
                    );
                }
            } else {
                showAlert("เกิดข้อผิดพลาด", "ไม่สามารถค้นหาสินค้าได้ กรุณาลองใหม่อีกครั้ง", [
                    { text: "ตกลง", onPress: unlock },
                ]);
            }
        }
    };

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <SafeAreaView style={[styles.container, styles.centered]}>
                <AppText style={styles.message}>
                    แอปต้องการสิทธิ์เข้าถึงกล้องเพื่อสแกนบาร์โค้ด
                </AppText>
                <Button title="อนุญาตให้ใช้กล้อง" onPress={requestPermission} />
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing="back"
                barcodeScannerSettings={{
                    barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "code128", "code39"],
                }}
                onBarcodeScanned={handleBarcodeScanned}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "black" },
    centered: { justifyContent: "center", alignItems: "center", gap: 16, paddingHorizontal: 24 },
    message: { textAlign: "center" },
    camera: { flex: 1 },
});
