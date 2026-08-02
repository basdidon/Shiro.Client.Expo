import Stepper from "@/components/Stepper";
import AppText from "@/components/ui/AppText";
import { useAddOrderLine, useOrders, useUpdateOrderLine } from "@/hooks/useOrders";
import { useProduct } from "@/hooks/useProducts";
import type { components } from "@/types/api";
import { FlashList } from "@shopify/flash-list";
import { router, useLocalSearchParams } from "expo-router";
import { debounce } from "lodash";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type OrderDto = components["schemas"]["OrderDto"];

export default function AddProductToOrderScreen() {
    const { id: productId } = useLocalSearchParams<{ id: string }>();
    const { data: product } = useProduct(productId);

    const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useOrders(
        20,
        "",
        "Created",
    );
    const orders = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

    const addOrderLine = useAddOrderLine();
    const updateOrderLine = useUpdateOrderLine();

    const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);
    const [quantity, setQuantity] = useState(1);

    const handleEndReached = useCallback(
        debounce(() => {
            if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        }, 300),
        [hasNextPage, isFetchingNextPage, fetchNextPage],
    );

    const handleSelectOrder = (order: OrderDto) => {
        setQuantity(1);
        setSelectedOrder(order);
    };

    const handleConfirm = async () => {
        if (!selectedOrder?.orderId || !product) return;

        const existingLine = selectedOrder.orderLines?.find(
            (line) => line.productId === product.id,
        );

        try {
            if (existingLine?.orderLineId) {
                await updateOrderLine.mutateAsync({
                    orderId: selectedOrder.orderId,
                    orderLineId: existingLine.orderLineId,
                    quantity: Number(existingLine.quantity ?? 0) + quantity,
                });
            } else {
                await addOrderLine.mutateAsync({
                    orderId: selectedOrder.orderId,
                    productId: product.id,
                    quantity,
                });
            }
            setSelectedOrder(null);
            router.back();
        } catch {
            Alert.alert(
                "เกิดข้อผิดพลาด",
                "ไม่สามารถเพิ่มสินค้าลงในคำสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง",
            );
        }
    };

    const isSubmitting = addOrderLine.isPending || updateOrderLine.isPending;

    if (isPending) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size={64} />
            </View>
        );
    }

    return (
        <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
            {orders.length === 0 ? (
                <View style={styles.loading}>
                    <AppText style={{ color: "gray" }}>ไม่มีคำสั่งซื้อที่กำลังดำเนินการ</AppText>
                </View>
            ) : (
                <FlashList
                    data={orders}
                    keyExtractor={(item) => item.orderId!}
                    contentContainerStyle={{ padding: 12 }}
                    onEndReachedThreshold={0.4}
                    onEndReached={handleEndReached}
                    ListFooterComponent={
                        isFetchingNextPage ? (
                            <ActivityIndicator
                                color="blue"
                                size="small"
                                style={{ marginVertical: 12 }}
                            />
                        ) : null
                    }
                    renderItem={({ item }) => (
                        <Pressable style={styles.row} onPress={() => handleSelectOrder(item)}>
                            <View style={{ flex: 1 }}>
                                <AppText size="large"># {item.orderId?.slice(0, 8)}</AppText>
                                <AppText size="small" style={{ color: "gray" }}>
                                    รายการ {item.orderLines?.length ?? 0}
                                </AppText>
                            </View>
                            <AppText size="large">{item.total} .-</AppText>
                        </Pressable>
                    )}
                />
            )}

            <Modal
                visible={!!selectedOrder}
                transparent
                animationType="slide"
                onRequestClose={() => setSelectedOrder(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <AppText size="title">{product?.name}</AppText>
                        <AppText size="medium" style={{ color: "gray" }}>
                            เพิ่มลงคำสั่งซื้อ # {selectedOrder?.orderId?.slice(0, 8)}
                        </AppText>

                        <View style={styles.stepperRow}>
                            <AppText size="large">จำนวน</AppText>
                            <Stepper value={quantity} setValue={setQuantity} />
                        </View>

                        <View style={styles.modalActions}>
                            <Pressable
                                style={[styles.actionBtn, styles.cancelBtn]}
                                onPress={() => setSelectedOrder(null)}
                                disabled={isSubmitting}
                            >
                                <AppText style={[styles.actionBtnText, styles.cancelBtnText]}>
                                    ยกเลิก
                                </AppText>
                            </Pressable>
                            <Pressable
                                style={[styles.actionBtn, styles.confirmBtn]}
                                onPress={handleConfirm}
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
    container: { flex: 1 },
    loading: { flex: 1, justifyContent: "center", alignItems: "center" },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" },
    modalCard: {
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        gap: 12,
    },
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
    actionBtnText: {
        textAlign: "center",
        fontSize: 16,
        fontFamily: "Mali_600SemiBold",
        color: "white",
    },
    cancelBtnText: { color: "#333" },
});
