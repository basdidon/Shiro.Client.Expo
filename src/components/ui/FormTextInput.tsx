import { forwardRef, useState, type Ref } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Pressable, StyleSheet, TextInput, TextInputProps, View } from "react-native";

import AppText from "@/components/ui/AppText";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

function mergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
    return (node: T | null) => {
        for (const ref of refs) {
            if (typeof ref === "function") {
                ref(node);
            } else if (ref && "current" in ref) {
                (ref as { current: T | null }).current = node;
            }
        }
    };
}

interface FormTextInputProps<
    TFieldValues extends FieldValues,
    TContext = unknown,
    TTransformedValues = TFieldValues,
> extends Omit<TextInputProps, "value" | "onChangeText" | "onBlur"> {
    control: Control<TFieldValues, TContext, TTransformedValues>;
    name: Path<TFieldValues>;
    showPasswordToggle?: boolean;
}

function FormTextInputInner<
    TFieldValues extends FieldValues,
    TContext = unknown,
    TTransformedValues = TFieldValues,
>(
    {
        control,
        name,
        style,
        showPasswordToggle,
        secureTextEntry,
        ...props
    }: FormTextInputProps<TFieldValues, TContext, TTransformedValues>,
    ref: Ref<TextInput>,
) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isSecure = showPasswordToggle ? !isPasswordVisible : secureTextEntry;

    return (
        <Controller
            control={control}
            name={name}
            render={({
                field: { onChange, onBlur, value, ref: fieldRef },
                fieldState: { error },
            }) => (
                <View>
                    <View style={styles.inputRow}>
                        <TextInput
                            ref={mergeRefs(fieldRef, ref)}
                            {...props}
                            secureTextEntry={isSecure}
                            style={[
                                styles.input,
                                showPasswordToggle && styles.inputWithToggle,
                                style,
                            ]}
                            value={typeof value === "string" ? value : ""}
                            onChangeText={onChange}
                            onBlur={onBlur}
                        />
                        {showPasswordToggle ? (
                            <Pressable
                                onPress={() => setIsPasswordVisible((prev) => !prev)}
                                style={styles.toggleButton}
                                hitSlop={8}
                            >
                                <MaterialDesignIcons
                                    name={isPasswordVisible ? "eye-off" : "eye"}
                                    size={20}
                                    color="#666"
                                />
                            </Pressable>
                        ) : null}
                    </View>
                    {error ? <AppText style={styles.error}>{error.message}</AppText> : null}
                </View>
            )}
        />
    );
}

const FormTextInput = forwardRef(FormTextInputInner) as <
    TFieldValues extends FieldValues,
    TContext = unknown,
    TTransformedValues = TFieldValues,
>(
    props: FormTextInputProps<TFieldValues, TContext, TTransformedValues> & {
        ref?: Ref<TextInput>;
    },
) => ReturnType<typeof FormTextInputInner>;

export default FormTextInput;

const styles = StyleSheet.create({
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontFamily: "Mali_400Regular",
    },
    inputWithToggle: {
        paddingRight: 40,
    },
    toggleButton: {
        position: "absolute",
        right: 12,
    },
    error: { color: "red", fontSize: 12, marginTop: 4 },
});
