import { forwardRef, type Ref } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

import AppText from "@/components/ui/AppText";

interface FormTextInputProps<
    TFieldValues extends FieldValues,
    TContext = unknown,
    TTransformedValues = TFieldValues,
> extends Omit<TextInputProps, "value" | "onChangeText" | "onBlur"> {
    control: Control<TFieldValues, TContext, TTransformedValues>;
    name: Path<TFieldValues>;
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
        ...props
    }: FormTextInputProps<TFieldValues, TContext, TTransformedValues>,
    ref: Ref<TextInput>,
) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View>
                    <TextInput
                        ref={ref}
                        {...props}
                        style={[styles.input, style]}
                        value={typeof value === "string" ? value : ""}
                        onChangeText={onChange}
                        onBlur={onBlur}
                    />
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
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    error: { color: "red", fontSize: 12, marginTop: 4 },
});
