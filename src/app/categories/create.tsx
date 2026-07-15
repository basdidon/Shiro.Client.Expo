import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/components/ui/AppText";
import FormIconPicker from "@/components/ui/FormIconPicker";
import FormTextInput from "@/components/ui/FormTextInput";
import { useCreateCategory } from "@/hooks/useCategories";
import { DEFAULT_CATEGORY_ICON } from "@/lib/categoryIcons";
import {
    categoryFormSchema,
    type CategoryFormInput,
    type CategoryFormOutput,
} from "@/lib/validation/categorySchemas";

export default function CreateCategoryScreen() {
    const { mutateAsync: createCategory, isPending } = useCreateCategory();
    const [error, setError] = useState<string | null>(null);

    const parentCategoryIdRef = useRef<TextInput>(null);

    const { control, handleSubmit } = useForm<CategoryFormInput, unknown, CategoryFormOutput>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: { name: "", iconName: DEFAULT_CATEGORY_ICON, parentCategoryId: "" },
    });

    const onSubmit = async ({ name, iconName, parentCategoryId }: CategoryFormOutput) => {
        setError(null);
        try {
            await createCategory({ name, iconName, parentCategoryId });
            router.back();
        } catch {
            setError("สร้างหมวดหมู่ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.form}>
                <AppText size="heading" style={styles.title}>
                    เพิ่มหมวดหมู่ใหม่
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
                    title={isPending ? "กำลังบันทึก..." : "บันทึก"}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isPending}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    form: { gap: 12, paddingHorizontal: 24, paddingTop: 24 },
    title: { textAlign: "center", marginBottom: 12 },
    error: { color: "red" },
});
