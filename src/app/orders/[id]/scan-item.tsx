import axios from "axios";
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from "expo-camera";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Alert, Button, Modal, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/components/ui/AppText";
import Stepper from "@/components/Stepper";
import { useAddOrderLine, useOrder, useUpdateOrderLine } from "@/hooks/useOrders";
import { useProductByBarcode } from "@/hooks/useProducts";
import { formatBarcode } from "@/lib/barcode";
import type { components } from "@/types/api";

type ProductDto = components["schemas"]["ProductDto"];

export default function ScanOrderItemScreen() {
    const { id: orderId } = useLocalSearchParams<{ id: string }>();
    const [permission, requestPermission] = useCameraPermissions();
    const { data: order } = useOrder(orderId);
    const { mutateAsync: lookupProductByBarcode } = useProductByBarcode();
    const addOrderLine = useAddOrderLine();
    const updateOrderLine = useUpdateOrderLine();

    const [lastMessage, setLastMessage] = useState<string | null>(null);
    const [scannedProduct, setScannedProduct] = useState<ProductDto | null>(null);
    const [quantity, setQuantity] = useState(1);

    // guards against onBarcodeScanned firing repeatedly for the same scan while
    // the lookup is in flight or the confirm modal is open
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
            setQuantity(1);
            setScannedProduct(product);
            // stays locked while the confirm modal is open; unlock() runs on cancel/confirm
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                Alert.alert("ไม่พบสินค้า", `ไม่พบสินค้าสำหรับบาร์โค้ด: ${formatBarcode(barcode)}`, [
                    { text: "ตกลง", onPress: unlock },
                ]);
            } else {
                Alert.alert(
                    "เกิดข้อผิดพลาด",
                    "ไม่สามารถค้นหาสินค้าได้ กรุณาลองใหม่อีกครั้ง",
                    [{ text: "ตกลง", onPress: unlock }],
                );
            }
        }
    };

    const handleCancelModal = () => {
        setScannedProduct(null);
        unlock();
    };

    const handleConfirmModal = async () => {
        if (!scannedProduct) return;

        const existingLine = order?.orderLines?.find(
            (line) => line.productId === scannedProduct.id,
        );

        try {
            if (existingLine?.orderLineId) {
                const nextQuantity = Number(existingLine.quantity ?? 0) + quantity;
                await updateOrderLine.mutateAsync({
                    orderId,
                    orderLineId: existingLine.orderLineId,
                    quantity: nextQuantity,
                });
                setLastMessage(`${scannedProduct.name} x ${nextQuantity}`);
            } else {
                await addOrderLine.mutateAsync({
                    orderId,
                    productId: scannedProduct.id,
                    quantity,
                });
                setLastMessage(`${scannedProduct.name} x ${quantity}`);
            }
            setScannedProduct(null);
            unlock();
        } catch {
            Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถเพิ่มสินค้าลงในคำสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง");
        }
    };

    const isSubmitting = addOrderLine.isPending || updateOrderLine.isPending;

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
        <SafeAreaView edges={["left", "right", "bottom"]} style={{ flex: 1 }}>
            <View style={styles.container}>
                <CameraView
                    style={styles.camera}
                    facing="back"
                    barcodeScannerSettings={{
                        barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "code128", "code39"],
                    }}
                    onBarcodeScanned={handleBarcodeScanned}
                />
                {lastMessage && (
                    <View style={styles.toast}>
                        <AppText style={styles.toastText}>เพิ่ม {lastMessage}</AppText>
                    </View>
                )}
            </View>

            <Modal
                visible={!!scannedProduct}
                transparent
                animationType="slide"
                onRequestClose={handleCancelModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <AppText size="title">{scannedProduct?.name}</AppText>
                        <AppText size="medium" style={styles.subtleText}>
                            {scannedProduct?.unitPrice} .-
                        </AppText>

                        <View style={styles.stepperRow}>
                            <AppText size="large">จำนวน</AppText>
                            <Stepper value={quantity} setValue={setQuantity} />
                        </View>

                        <View style={styles.modalActions}>
                            <Pressable
                                style={[styles.actionBtn, styles.cancelBtn]}
                                onPress={handleCancelModal}
                                disabled={isSubmitting}
                            >
                                <AppText style={[styles.actionBtnText, styles.cancelBtnText]}>
                                    ยกเลิก
                                </AppText>
                            </Pressable>
                            <Pressable
                                style={[styles.actionBtn, styles.confirmBtn]}
                                onPress={handleConfirmModal}
                                disabled={isSubmitting}
                            >
                                <AppText style={styles.actionBtnText}>
                                    {isSubmitting ? "กำลังเพิ่ม..." : "เพิ่มลงคำสั่งซื้อ"}
                                </AppText>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "black" },
    centered: { justifyContent: "center", alignItems: "center", gap: 16, paddingHorizontal: 24 },
    message: { textAlign: "center" },
    camera: { flex: 1 },
    toast: {
        position: "absolute",
        bottom: 32,
        left: 24,
        right: 24,
        backgroundColor: "rgba(0,0,0,0.75)",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    toastText: { color: "white", textAlign: "center" },
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalCard: {
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        gap: 12,
    },
    subtleText: { color: "gray" },
    stepperRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
    },
    modalActions: { flexDirection: "row", gap: 12, marginTop: 12 },
    actionBtn: { flex: 1, paddingVertical: 12, borderRadius: 12 },
    cancelBtn: { backgroundColor: "#eee" },
    confirmBtn: { backgroundColor: "blue" },
    actionBtnText: { textAlign: "center", fontSize: 16, fontWeight: "600", color: "white" },
    cancelBtnText: { color: "#333" },
});
