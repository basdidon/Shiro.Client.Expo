import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Button, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/components/ui/AppText";
import FormCategoryPicker from "@/components/ui/FormCategoryPicker";
import FormTextInput from "@/components/ui/FormTextInput";
import { useProduct, useUpdateProduct } from "@/hooks/useProducts";
import { getApiErrorDetail } from "@/lib/api";
import {
    UpdateProductFormInput,
    updateProductSchema,
    type UpdateProductFormOutput,
} from "@/lib/validation/productSchemas";
import { zodResolver } from "@hookform/resolvers/zod";

export default function EditProductScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: product, isPending: isLoadingProduct } = useProduct(id);
    const { mutateAsync: updateProduct, isPending: isSaving } = useUpdateProduct();
    const [error, setError] = useState<string | null>(null);

    const { control, handleSubmit, reset } = useForm<
        UpdateProductFormInput,
        unknown,
        UpdateProductFormOutput
    >({
        resolver: zodResolver(updateProductSchema),
        defaultValues: { name: "", unitPrice: "", categoryId: null },
    });

    useEffect(() => {
        if (product) {
            reset({
                name: product.name,
                unitPrice: String(product.unitPrice),
                categoryId: product.category?.id != null ? Number(product.category.id) : null,
            });
        }
    }, [product, reset]);

    const onSubmit = async ({ name, unitPrice, categoryId }: UpdateProductFormOutput) => {
        setError(null);
        try {
            await updateProduct({
                productId: id,
                name,
                unitPrice,
                categoryId,
            });
            router.back();
        } catch (err) {
            setError(getApiErrorDetail(err) ?? "บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        }
    };

    if (isLoadingProduct) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size={64} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.form}
                keyboardShouldPersistTaps="handled"
                bottomOffset={62}
            >
                <AppText size="heading" style={styles.title}>
                    แก้ไขสินค้า
                </AppText>

                <FormTextInput control={control} name="name" placeholder="ชื่อสินค้า" />
                <FormTextInput
                    control={control}
                    name="unitPrice"
                    placeholder="ราคา"
                    keyboardType="numeric"
                />
                <FormCategoryPicker control={control} name="categoryId" />

                {error ? <AppText style={styles.error}>{error}</AppText> : null}

                <Button
                    title={isSaving ? "กำลังบันทึก..." : "บันทึก"}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSaving}
                />
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loading: { flex: 1, justifyContent: "center" },
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
