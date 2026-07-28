import { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { FlatList, Modal, Pressable, StyleSheet, View } from "react-native";

import AppText from "@/components/ui/AppText";
import { useCategories } from "@/hooks/useCategories";
import { DEFAULT_CATEGORY_ICON, type CategoryIconName } from "@/lib/categoryIcons";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface FormCategoryPickerProps<
    TFieldValues extends FieldValues,
    TContext = unknown,
    TTransformedValues = TFieldValues,
> {
    control: Control<TFieldValues, TContext, TTransformedValues>;
    name: Path<TFieldValues>;
    label?: string;
}

export default function FormCategoryPicker<
    TFieldValues extends FieldValues,
    TContext = unknown,
    TTransformedValues = TFieldValues,
>({
    control,
    name,
    label = "หมวดหมู่",
}: FormCategoryPickerProps<TFieldValues, TContext, TTransformedValues>) {
    const [isOpen, setIsOpen] = useState(false);
    const { data: categories } = useCategories();

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
                const selected = categories?.find((c) => Number(c.id) === value);

                return (
                    <View>
                        <AppText size="medium" style={styles.label}>
                            {label}
                        </AppText>
                        <Pressable style={styles.trigger} onPress={() => setIsOpen(true)}>
                            <MaterialDesignIcons
                                name={
                                    (selected?.iconName as CategoryIconName) ??
                                    DEFAULT_CATEGORY_ICON
                                }
                                size={24}
                            />
                            <AppText style={styles.triggerText}>
                                {selected?.name ?? "ไม่มีหมวดหมู่"}
                            </AppText>
                        </Pressable>
                        {error ? <AppText style={styles.error}>{error.message}</AppText> : null}

                        <Modal
                            visible={isOpen}
                            animationType="slide"
                            transparent
                            onRequestClose={() => setIsOpen(false)}
                        >
                            <SafeAreaView edges={["left", "right", "bottom"]} style={{ flex: 1 }}>
                                <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)}>
                                    <Pressable
                                        style={styles.sheet}
                                        onPress={(e) => e.stopPropagation()}
                                    >
                                        <AppText size="title" style={styles.sheetTitle}>
                                            เลือกหมวดหมู่
                                        </AppText>
                                        <FlatList
                                            data={categories ?? []}
                                            keyExtractor={(item, index) => String(item.id ?? index)}
                                            showsVerticalScrollIndicator={false}
                                            ListHeaderComponent={
                                                <Pressable
                                                    style={styles.row}
                                                    onPress={() => {
                                                        onChange(null);
                                                        setIsOpen(false);
                                                    }}
                                                >
                                                    <MaterialDesignIcons name="cancel" size={24} />
                                                    <AppText style={styles.rowText}>
                                                        ไม่มีหมวดหมู่
                                                    </AppText>
                                                </Pressable>
                                            }
                                            renderItem={({ item }) => (
                                                <Pressable
                                                    style={styles.row}
                                                    onPress={() => {
                                                        onChange(Number(item.id));
                                                        setIsOpen(false);
                                                    }}
                                                >
                                                    <MaterialDesignIcons
                                                        name={
                                                            (item.iconName as CategoryIconName) ??
                                                            DEFAULT_CATEGORY_ICON
                                                        }
                                                        size={24}
                                                    />
                                                    <AppText style={styles.rowText}>
                                                        {item.name}
                                                    </AppText>
                                                </Pressable>
                                            )}
                                        />
                                    </Pressable>
                                </Pressable>
                            </SafeAreaView>
                        </Modal>
                    </View>
                );
            }}
        />
    );
}

const styles = StyleSheet.create({
    label: { marginBottom: 4 },
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
    triggerText: { color: "#555" },
    error: { color: "red", fontSize: 12, marginTop: 4 },
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: "white",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
        maxHeight: "60%",
    },
    sheetTitle: { textAlign: "center", marginBottom: 12 },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    rowText: { fontSize: 16 },
});
