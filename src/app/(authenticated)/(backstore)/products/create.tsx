import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, StyleSheet, TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/components/ui/AppText";
import FormCategoryPicker from "@/components/ui/FormCategoryPicker";
import FormTextInput from "@/components/ui/FormTextInput";
import { useCreateProduct } from "@/hooks/useProducts";
import {
    CreateProductFormInput,
    createProductSchema,
    type CreateProductFormOutput,
} from "@/lib/validation/productSchemas";
import { zodResolver } from "@hookform/resolvers/zod";

export default function CreateProductScreen() {
    const { barcode: barcodeParam } = useLocalSearchParams<{ barcode?: string }>();

    const { mutateAsync: createProduct, isPending } = useCreateProduct();
    const [error, setError] = useState<string | null>(null);

    const unitPriceRef = useRef<TextInput>(null);
    const barcodeRef = useRef<TextInput>(null);

    const {
        control,
        handleSubmit,
        setError: setFieldError,
    } = useForm<CreateProductFormInput, unknown, CreateProductFormOutput>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            name: "",
            unitPrice: "",
            barcode: barcodeParam ?? "",
            categoryId: null,
        },
    });

    const onSubmit = async ({ name, unitPrice, barcode, categoryId }: CreateProductFormOutput) => {
        setError(null);
        try {
            const product = await createProduct({
                name,
                unitPrice,
                barcode: barcode || null,
                categoryId,
            });
            router.replace({
                pathname: "/products/[id]",
                params: { id: product.id },
            });
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 409) {
                setFieldError("barcode", { message: "บาร์โค้ดนี้มีสินค้าอยู่แล้ว" });
            } else {
                setError("สร้างสินค้าไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.form}
                keyboardShouldPersistTaps="handled"
                bottomOffset={62}
            >
                <AppText size="title" style={styles.title}>
                    เพิ่มสินค้าใหม่
                </AppText>

                <FormTextInput
                    control={control}
                    name="name"
                    placeholder="ชื่อสินค้า"
                    autoFocus
                    returnKeyType="next"
                    submitBehavior="submit"
                    onSubmitEditing={() => unitPriceRef.current?.focus()}
                />
                <FormTextInput
                    ref={unitPriceRef}
                    control={control}
                    name="unitPrice"
                    placeholder="ราคา"
                    keyboardType="numeric"
                    returnKeyType="next"
                    submitBehavior="submit"
                    onSubmitEditing={() => barcodeRef.current?.focus()}
                />
                <FormTextInput
                    ref={barcodeRef}
                    control={control}
                    name="barcode"
                    placeholder="บาร์โค้ด (ไม่บังคับ)"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <FormCategoryPicker control={control} name="categoryId" />

                {error ? <AppText style={styles.error}>{error}</AppText> : null}

                <Button
                    title={isPending ? "กำลังบันทึก..." : "บันทึก"}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isPending}
                />
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    form: { gap: 12, paddingHorizontal: 24, paddingTop: 24 },
    title: { textAlign: "center", marginBottom: 12 },
    error: { color: "red" },
    trigger: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
});
