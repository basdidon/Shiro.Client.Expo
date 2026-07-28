import { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { FlatList, Modal, Pressable, StyleSheet, View } from "react-native";

import AppText from "@/components/ui/AppText";
import { CATEGORY_ICON_NAMES, DEFAULT_CATEGORY_ICON } from "@/lib/categoryIcons";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface FormIconPickerProps<
    TFieldValues extends FieldValues,
    TContext = unknown,
    TTransformedValues = TFieldValues,
> {
    control: Control<TFieldValues, TContext, TTransformedValues>;
    name: Path<TFieldValues>;
    label?: string;
}

export default function FormIconPicker<
    TFieldValues extends FieldValues,
    TContext = unknown,
    TTransformedValues = TFieldValues,
>({
    control,
    name,
    label = "ไอคอน",
}: FormIconPickerProps<TFieldValues, TContext, TTransformedValues>) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View>
                    <Pressable style={styles.trigger} onPress={() => setIsOpen(true)}>
                        <View style={styles.iconContainer}>
                            <MaterialDesignIcons
                                name={typeof value === "string" ? value : DEFAULT_CATEGORY_ICON}
                                size={28}
                            />
                        </View>
                        <AppText style={styles.triggerText}>แตะเพื่อเลือกไอคอน</AppText>
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
                                        เลือกไอคอน
                                    </AppText>
                                    <FlatList
                                        data={CATEGORY_ICON_NAMES}
                                        numColumns={5}
                                        showsVerticalScrollIndicator={false}
                                        keyExtractor={(item) => item}
                                        renderItem={({ item }) => (
                                            <Pressable
                                                style={[
                                                    styles.iconCell,
                                                    value === item && styles.iconCellSelected,
                                                ]}
                                                onPress={() => {
                                                    onChange(item);
                                                    setIsOpen(false);
                                                }}
                                            >
                                                <MaterialDesignIcons name={item} size={28} />
                                            </Pressable>
                                        )}
                                    />
                                </Pressable>
                            </Pressable>
                        </SafeAreaView>
                    </Modal>
                </View>
            )}
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
    iconContainer: { width: 32, height: 32, justifyContent: "center", alignItems: "center" },
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
        maxHeight: "65%",
    },
    sheetTitle: { textAlign: "center", marginBottom: 12 },
    iconCell: {
        flex: 1,
        aspectRatio: 1,
        margin: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#eee",
        alignItems: "center",
        justifyContent: "center",
    },
    iconCellSelected: {
        borderColor: "#007aff",
        backgroundColor: "#e6f2ff",
    },
});
