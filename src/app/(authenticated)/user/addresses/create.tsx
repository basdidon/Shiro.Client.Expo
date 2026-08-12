import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/components/ui/AppText";
import FormTextInput from "@/components/ui/FormTextInput";
import FormThailandLocationPicker from "@/components/ui/FormThailandLocationPicker";
import { useAddAddress } from "@/hooks/useAddresses";
import { addAddressSchema, type AddAddressFormValues } from "@/lib/validation/addressSchema";

export default function CreateAddressScreen() {
    const { mutateAsync: addAddress, isPending } = useAddAddress();
    const [error, setError] = useState<string | null>(null);

    const { control, handleSubmit } = useForm<AddAddressFormValues>({
        resolver: zodResolver(addAddressSchema),
        defaultValues: {
            addressLine1: "",
            addressLine2: "",
            province: "",
            district: "",
            subDistrict: "",
            zipCode: "",
        },
    });

    const onSubmit = async ({
        addressLine1,
        addressLine2,
        province,
        district,
        subDistrict,
        zipCode,
    }: AddAddressFormValues) => {
        setError(null);
        try {
            await addAddress({
                addressLine1,
                addressLine2: addressLine2 ?? "",
                province,
                district,
                subDistrict,
                zipCode,
            });
            router.back();
        } catch {
            setError("บันทึกที่อยู่ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.form}
                keyboardShouldPersistTaps="handled"
                bottomOffset={62}
            >
                <AppText size="heading" style={styles.title}>
                    เพิ่มที่อยู่จัดส่ง
                </AppText>

                <FormTextInput
                    control={control}
                    name="addressLine1"
                    placeholder="ที่อยู่ (บ้านเลขที่ ถนน ซอย)"
                />
                <FormTextInput
                    control={control}
                    name="addressLine2"
                    placeholder="ที่อยู่เพิ่มเติม (ไม่บังคับ)"
                />
                <FormThailandLocationPicker control={control} />
                <FormTextInput
                    control={control}
                    name="zipCode"
                    placeholder="รหัสไปรษณีย์"
                    keyboardType="numeric"
                />
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
});
