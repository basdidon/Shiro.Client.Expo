import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Button, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/components/ui/AppText";
import FormTextInput from "@/components/ui/FormTextInput";
import FormThailandLocationPicker from "@/components/ui/FormThailandLocationPicker";
import { useAddresses, useUpdateAddress } from "@/hooks/useAddresses";
import { manualAddressSchema, type ManualAddressFormValues } from "@/lib/validation/addressSchema";

export default function EditAddressScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    // addresses are a small, already-loaded list (from the addresses page),
    // so we look the target up there instead of adding a per-address fetch
    const { data: addresses, isPending: isLoadingAddresses } = useAddresses();
    const address = addresses?.find((a) => a.userAddressId === id);

    const { mutateAsync: updateAddress, isPending: isSaving } = useUpdateAddress();
    const [error, setError] = useState<string | null>(null);

    const { control, handleSubmit, reset } = useForm<ManualAddressFormValues>({
        resolver: zodResolver(manualAddressSchema),
        defaultValues: {
            addressLine1: "",
            addressLine2: "",
            province: "",
            district: "",
            subDistrict: "",
            zipCode: "",
        },
    });

    useEffect(() => {
        if (address) {
            reset({
                addressLine1: address.shippingAddress.addressLine1,
                addressLine2: address.shippingAddress.addressLine2,
                province: address.shippingAddress.province,
                district: address.shippingAddress.district,
                subDistrict: address.shippingAddress.subDistrict,
                zipCode: address.shippingAddress.zipCode,
            });
        }
    }, [address, reset]);

    const onSubmit = async ({
        addressLine1,
        addressLine2,
        province,
        district,
        subDistrict,
        zipCode,
    }: ManualAddressFormValues) => {
        setError(null);
        try {
            await updateAddress({
                userAddressId: id,
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

    if (isLoadingAddresses) {
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
                    แก้ไขที่อยู่จัดส่ง
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
});
