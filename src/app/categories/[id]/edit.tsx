import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Button, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/components/ui/AppText";
import FormIconPicker from "@/components/ui/FormIconPicker";
import FormTextInput from "@/components/ui/FormTextInput";
import { useCategories, useUpdateCategory } from "@/hooks/useCategories";
import { DEFAULT_CATEGORY_ICON, type CategoryIconName } from "@/lib/categoryIcons";
import {
    categoryFormSchema,
    type CategoryFormInput,
    type CategoryFormOutput,
} from "@/lib/validation/categorySchemas";

export default function EditCategoryScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    // categories are a small, already-loaded list (from the categories page),
    // so we look the target up there instead of adding a per-category fetch
    const { data: categories, isPending: isLoadingCategories } = useCategories();
    const category = categories?.find((c) => String(c.id) === id);

    const { mutateAsync: updateCategory, isPending: isSaving } = useUpdateCategory();
    const [error, setError] = useState<string | null>(null);

    const parentCategoryIdRef = useRef<TextInput>(null);

    const { control, handleSubmit, reset } = useForm<
        CategoryFormInput,
        unknown,
        CategoryFormOutput
    >({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: { name: "", iconName: DEFAULT_CATEGORY_ICON, parentCategoryId: "" },
    });

    useEffect(() => {
        if (category) {
            reset({
                name: category.name ?? "",
                iconName: (category.iconName as CategoryIconName) ?? DEFAULT_CATEGORY_ICON,
                parentCategoryId: category.parentCategoryId
                    ? String(category.parentCategoryId)
                    : "",
            });
        }
    }, [category, reset]);

    const onSubmit = async ({ name, iconName, parentCategoryId }: CategoryFormOutput) => {
        setError(null);
        try {
            await updateCategory({ categoryId: id, name, iconName, parentCategoryId });
            router.back();
        } catch {
            setError("บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        }
    };

    if (isLoadingCategories) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size={64} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.form}>
                <AppText size="heading" style={styles.title}>
                    แก้ไขหมวดหมู่
                </AppText>

                <FormTextInput
                    control={control}
                    name="name"
                    placeholder="ชื่อหมวดหมู่"
                    returnKeyType="next"
                    onSubmitEditing={() => parentCategoryIdRef.current?.focus()}
                />
                <FormIconPicker control={control} name="iconName" />
                <FormTextInput
                    ref={parentCategoryIdRef}
                    control={control}
                    name="parentCategoryId"
                    placeholder="รหัสหมวดหมู่หลัก (ไม่บังคับ)"
                    keyboardType="numeric"
                />

                {error ? <AppText style={styles.error}>{error}</AppText> : null}

                <Button
                    title={isSaving ? "กำลังบันทึก..." : "บันทึก"}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSaving}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loading: { flex: 1, justifyContent: "center" },
    form: { gap: 12, paddingHorizontal: 24, paddingTop: 24 },
    title: { textAlign: "center", marginBottom: 12 },
    error: { color: "red" },
});
