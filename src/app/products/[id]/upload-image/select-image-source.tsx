import AppText from "@/components/ui/AppText";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import * as ImagePicker from "expo-image-picker";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useUploadProductImage } from "@/hooks/useProducts";
import { cropAndResize, getImageSaveFormat } from "@/lib/productImageProcessing";
import { SaveFormat } from "expo-image-manipulator";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

const THUMBNAIL_SIZE = { width: 512, height: 512 };
const DETAIL_SIZE = { width: 1024, height: 768 };

export default function () {
    const { id: productId, type: selectedType } = useLocalSearchParams<{
        id: string;
        type: "Thumbnail" | "Detail";
    }>();

    const { mutateAsync: uploadImage } = useUploadProductImage();

    const [error, setError] = useState<string | null>(null);

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
            router.back();
        } catch (err) {
            console.error("[UploadProductImageButton] upload failed:", err);
            setError("อัปโหลดรูปภาพไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        } finally {
            router.dismissTo({ pathname: "/products/[id]", params: { id: productId } });
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
            <View style={styles.container}>
                <AppText size="title" style={styles.title}>
                    อัปโหลดจาก
                </AppText>
                <View style={styles.btnContainer}>
                    <Pressable style={styles.btn} onPress={pickFromCamera}>
                        <View style={styles.iconContainer}>
                            <MaterialDesignIcons name="camera" size={32} />
                        </View>
                        <AppText size="large">กล้องถ่ายรูป</AppText>
                    </Pressable>
                    <Pressable style={styles.btn} onPress={pickFromGallery}>
                        <View style={styles.iconContainer}>
                            <MaterialDesignIcons name="image" size={32} />
                        </View>
                        <AppText size="large">คลังภาพ</AppText>
                    </Pressable>
                </View>
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
    iconContainer: {
        width: 36,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
    },
});
