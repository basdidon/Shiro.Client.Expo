import { BottomSheet, Host, RNHostView } from "@expo/ui";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import AppText from "@/components/ui/AppText";
import { useUploadProductImage } from "@/hooks/useProducts";
import { cropAndResize, getImageSaveFormat } from "@/lib/productImageProcessing";
import { SaveFormat } from "expo-image-manipulator";

const THUMBNAIL_SIZE = { width: 512, height: 512 };
const DETAIL_SIZE = { width: 1024, height: 768 };

type Step = "closed" | "type" | "source";

export default function UploadProductImageButton({ productId }: { productId: string }) {
    const { mutateAsync: uploadImage } = useUploadProductImage();

    const [step, setStep] = useState<Step>("closed");
    const [selectedType, setSelectedType] = useState<"Thumbnail" | "Detail" | null>(null);
    const [uploadingSource, setUploadingSource] = useState<"camera" | "gallery" | null>(null);
    const [error, setError] = useState<string | null>(null);

    const closeAll = () => {
        setStep("closed");
        setSelectedType(null);
        setError(null);
    };

    const selectType = (type: "Thumbnail" | "Detail") => {
        setError(null);
        setSelectedType(type);
        setStep("source");
    };

    // expo-image-picker's `aspect` option is Android-only (iOS's native editor is
    // always a 1:1 square), so only Android gets native cropping for the 4:3 detail
    // image; iOS keeps the programmatic center-crop for that slot.
    const getEditingOptions = (type: "Thumbnail" | "Detail") => {
        if (type === "Thumbnail") {
            return { allowsEditing: true, aspect: [1, 1] as [number, number] };
        }
        if (Platform.OS === "android") {
            return { allowsEditing: true, aspect: [4, 3] as [number, number] };
        }
        return { allowsEditing: false, aspect: undefined };
    };

    const uploadPickedAsset = async (
        type: "Thumbnail" | "Detail",
        asset: ImagePicker.ImagePickerAsset,
    ) => {
        if (!asset.width || !asset.height) {
            setError("ไม่สามารถอ่านขนาดรูปภาพได้ กรุณาลองรูปอื่น");
            return;
        }

        setError(null);
        try {
            const target = type === "Thumbnail" ? THUMBNAIL_SIZE : DETAIL_SIZE;
            const format = getImageSaveFormat(asset);
            const processedUri = await cropAndResize(
                asset.uri,
                asset.width,
                asset.height,
                target.width,
                target.height,
                format,
            );
            const extension = format === SaveFormat.PNG ? "png" : "jpg";
            await uploadImage({
                productId,
                type,
                fileUri: processedUri,
                filename: `${type.toLowerCase()}.${extension}`,
            });
            closeAll();
        } catch (err) {
            console.error("[UploadProductImageButton] upload failed:", err);
            setError("อัปโหลดรูปภาพไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        } finally {
            setUploadingSource(null);
        }
    };

    const pickFromCamera = async () => {
        if (!selectedType) return;
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            setError("กรุณาอนุญาตให้เข้าถึงกล้องเพื่อถ่ายรูปสินค้า");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            ...getEditingOptions(selectedType),
            quality: 1,
        });
        if (result.canceled) return;

        setUploadingSource("camera");
        await uploadPickedAsset(selectedType, result.assets[0]);
    };

    const pickFromGallery = async () => {
        if (!selectedType) return;
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            setError("กรุณาอนุญาตให้เข้าถึงรูปภาพเพื่อเลือกรูปสินค้า");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            ...getEditingOptions(selectedType),
            quality: 1,
        });
        if (result.canceled) return;

        setUploadingSource("gallery");
        await uploadPickedAsset(selectedType, result.assets[0]);
    };

    const typeLabel = selectedType === "Thumbnail" ? "รูปย่อ" : "รูปรายละเอียด";

    return (
        <>
            <Pressable style={styles.trigger} onPress={() => setStep("type")}>
                <Text style={styles.triggerText}>แก้ไขรูปภาพ</Text>
            </Pressable>

            <Host matchContents colorScheme="light">
                <BottomSheet isPresented={step === "type"} onDismiss={closeAll}>
                    <RNHostView matchContents>
                        <View style={styles.sheetContent}>
                            <AppText size="title" style={styles.sheetTitle}>
                                เลือกรูปภาพที่ต้องการอัปโหลด
                            </AppText>

                            <Pressable style={styles.row} onPress={() => selectType("Thumbnail")}>
                                <AppText style={styles.rowText}>รูปย่อ (512x512)</AppText>
                            </Pressable>
                            <Pressable style={styles.row} onPress={() => selectType("Detail")}>
                                <AppText style={styles.rowText}>รูปรายละเอียด (1024x768)</AppText>
                            </Pressable>
                        </View>
                    </RNHostView>
                </BottomSheet>
            </Host>

            <Host matchContents colorScheme="light">
                <BottomSheet isPresented={step === "source"} onDismiss={closeAll}>
                    <RNHostView matchContents>
                        <View style={styles.sheetContent}>
                            <AppText size="title" style={styles.sheetTitle}>
                                {typeLabel}: ถ่ายรูปใหม่หรือเลือกจากคลังภาพ?
                            </AppText>

                            <Pressable
                                style={styles.row}
                                onPress={pickFromCamera}
                                disabled={uploadingSource !== null}
                            >
                                {uploadingSource === "camera" ? (
                                    <ActivityIndicator />
                                ) : (
                                    <AppText style={styles.rowText}>ถ่ายรูป</AppText>
                                )}
                            </Pressable>
                            <Pressable
                                style={styles.row}
                                onPress={pickFromGallery}
                                disabled={uploadingSource !== null}
                            >
                                {uploadingSource === "gallery" ? (
                                    <ActivityIndicator />
                                ) : (
                                    <AppText style={styles.rowText}>คลังภาพ</AppText>
                                )}
                            </Pressable>

                            {error ? <AppText style={styles.error}>{error}</AppText> : null}
                        </View>
                    </RNHostView>
                </BottomSheet>
            </Host>
        </>
    );
}

const styles = StyleSheet.create({
    trigger: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "blue",
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 16,
    },
    triggerText: { color: "blue", textAlign: "center", fontSize: 20, fontFamily: "Mali_400Regular" },
    sheetContent: { padding: 16, paddingBottom: 32 },
    sheetTitle: { textAlign: "center", marginBottom: 12 },
    row: {
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    rowText: { fontSize: 16 },
    error: { color: "red", textAlign: "center", marginTop: 12 },
});
