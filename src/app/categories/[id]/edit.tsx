import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Button,
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/components/ui/AppText";
import FormIconPicker from "@/components/ui/FormIconPicker";
import FormTextInput from "@/components/ui/FormTextInput";
import { useCategories, useDeleteCategory, useUpdateCategory } from "@/hooks/useCategories";
import { showAlert } from "@/lib/alert";
import { DEFAULT_CATEGORY_ICON, type CategoryIconName } from "@/lib/categoryIcons";
import {
    categoryFormSchema,
    type CategoryFormInput,
    type CategoryFormOutput,
} from "@/lib/validation/categorySchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function EditCategoryScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    // categories are a small, already-loaded list (from the categories page),
    // so we look the target up there instead of adding a per-category fetch
    const { data: categories, isPending: isLoadingCategories } = useCategories();
    const category = categories?.find((c) => String(c.id) === id);

    const { mutateAsync: updateCategory, isPending: isSaving } = useUpdateCategory();
    const { mutateAsync: deleteCategory, isPending: isDeleting } = useDeleteCategory();
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

    const handleDelete = () => {
        showAlert(
            "ลบหมวดหมู่",
            `ต้องการลบหมวดหมู่ "${category?.name ?? ""}" หรือไม่?`,
            [
                { text: "ยกเลิก", style: "cancel" },
                {
                    text: "ลบ",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteCategory(id);
                            router.back();
                        } catch {
                            setError("ลบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
                        }
                    },
                },
            ],
        );
    };

    const headerRight = () => (
        <Pressable onPress={handleDelete} disabled={isDeleting} hitSlop={8}>
            <MaterialDesignIcons name="trash-can-outline" size={22} color="#c00" />
        </Pressable>
    );

    if (isLoadingCategories) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size={64} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerRight }} />
            <KeyboardAwareScrollView
                contentContainerStyle={styles.form}
                keyboardShouldPersistTaps="handled"
                bottomOffset={62}
            >
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
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
});
