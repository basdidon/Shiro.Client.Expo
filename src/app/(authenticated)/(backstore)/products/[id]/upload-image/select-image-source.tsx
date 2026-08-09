import AppText from "@/components/ui/AppText";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import * as ImagePicker from "expo-image-picker";
import { ActivityIndicator, BackHandler, Platform, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useUploadProductImage } from "@/hooks/useProducts";
import { cropAndResize, getImageSaveFormat } from "@/lib/productImageProcessing";
import { SaveFormat } from "expo-image-manipulator";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";

const THUMBNAIL_SIZE = { width: 512, height: 512 };
const DETAIL_SIZE = { width: 1024, height: 768 };

export default function () {
    const { id: productId, type: selectedType } = useLocalSearchParams<{
        id: string;
        type: "Thumbnail" | "Detail";
    }>();

    const { mutateAsync: uploadImage, isPending: isUploading } = useUploadProductImage();

    const [error, setError] = useState<string | null>(null);

    // Guards against calling router.back() a second time if the upload finishes
    // after the screen has already been dismissed some other way.
    const isMountedRef = useRef(true);
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // Block the user from dismissing the sheet mid-upload (swipe gesture on iOS,
    // hardware back button on Android) so router.back() on success can't race
    // with a dismissal the user triggered themselves.
    useEffect(() => {
        if (!isUploading || Platform.OS !== "android") return;
        const subscription = BackHandler.addEventListener("hardwareBackPress", () => true);
        return () => subscription.remove();
    }, [isUploading]);

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
            if (isMountedRef.current) {
                router.back();
            }
        } catch (err) {
            console.error("[UploadProductImageButton] upload failed:", err);
            if (isMountedRef.current) {
                setError("อัปโหลดรูปภาพไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
            }
        }
    };

    const pickFromCamera = async () => {
        console.log(selectedType);
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

        await uploadPickedAsset(selectedType, result.assets[0]);
    };

    return (
        <SafeAreaView edges={["bottom"]}>
            <Stack.Screen options={{ gestureEnabled: !isUploading }} />
            <View style={styles.container}>
                <AppText size="title" style={styles.title}>
                    อัปโหลดจาก
                </AppText>
                <View style={styles.btnContainer}>
                    <Pressable
                        style={[styles.btn, isUploading && styles.btnDisabled]}
                        onPress={pickFromCamera}
                        disabled={isUploading}
                    >
                        <View style={styles.iconContainer}>
                            <MaterialDesignIcons name="camera" size={32} />
                        </View>
                        <AppText size="large">กล้องถ่ายรูป</AppText>
                    </Pressable>
                    <Pressable
                        style={[styles.btn, isUploading && styles.btnDisabled]}
                        onPress={pickFromGallery}
                        disabled={isUploading}
                    >
                        <View style={styles.iconContainer}>
                            <MaterialDesignIcons name="image" size={32} />
                        </View>
                        <AppText size="large">คลังภาพ</AppText>
                    </Pressable>
                </View>
                {isUploading && (
                    <View style={styles.uploadingRow}>
                        <ActivityIndicator />
                        <AppText>กำลังอัปโหลดรูปภาพ...</AppText>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        paddingHorizontal: 12,
        paddingVertical: 24,
        minHeight: 240,
    },
    title: {
        marginBottom: 24,
    },
    btnContainer: { gap: 8 },
    btn: {
        flexDirection: "row",
        backgroundColor: "#efefef",
        padding: 12,
        borderRadius: 12,
        alignItems: "center",
        gap: 24,
    },
    btnDisabled: {
        opacity: 0.5,
    },
    iconContainer: {
        width: 36,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
    },
    uploadingRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginTop: 16,
    },
});
