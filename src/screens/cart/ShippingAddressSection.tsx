import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";

import AppText from "@/components/ui/AppText";
import FormTextInput from "@/components/ui/FormTextInput";
import FormThailandLocationPicker from "@/components/ui/FormThailandLocationPicker";
import { useShippingAddresses } from "@/hooks/useShippingAddresses";
import { manualAddressSchema, type ManualAddressFormValues } from "@/lib/validation/addressSchema";
import type { components } from "@/types/api";

type Address = components["schemas"]["Address"];

interface ShippingAddressSectionProps {
    onAddressChange: (address: Address | null) => void;
}

type Mode = "saved" | "manual";

export default function ShippingAddressSection({ onAddressChange }: ShippingAddressSectionProps) {
    const { data: savedAddresses, isLoading } = useShippingAddresses();
    const [mode, setMode] = useState<Mode>("manual");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const { control, watch, formState } = useForm<ManualAddressFormValues>({
        resolver: zodResolver(manualAddressSchema),
        mode: "onChange",
        defaultValues: {
            addressLine1: "",
            addressLine2: "",
            province: "",
            district: "",
            subDistrict: "",
            zipCode: "",
        },
    });

    const addressLine1 = watch("addressLine1");
    const addressLine2 = watch("addressLine2");
    const province = watch("province");
    const district = watch("district");
    const subDistrict = watch("subDistrict");
    const zipCode = watch("zipCode");

    useEffect(() => {
        if (savedAddresses && savedAddresses.length > 0 && selectedId === null) {
            setMode("saved");
            setSelectedId(savedAddresses[0].userShippingAddressId);
        }
    }, [savedAddresses, selectedId]);

    useEffect(() => {
        if (mode === "saved") {
            const selected = savedAddresses?.find(
                (item) => item.userShippingAddressId === selectedId,
            );
            onAddressChange(selected?.shippingAddress ?? null);
            return;
        }
        if (!formState.isValid) {
            onAddressChange(null);
            return;
        }
        onAddressChange({ addressLine1, addressLine2, province, district, subDistrict, zipCode });
    }, [
        mode,
        selectedId,
        savedAddresses,
        formState.isValid,
        addressLine1,
        addressLine2,
        province,
        district,
        subDistrict,
        zipCode,
        onAddressChange,
    ]);

    return (
        <View style={styles.container}>
            <AppText size="title">ที่อยู่จัดส่ง</AppText>

            {savedAddresses && savedAddresses.length > 0 && (
                <View style={styles.tabRow}>
                    <Pressable
                        style={[styles.tab, mode === "saved" && styles.tabActive]}
                        onPress={() => setMode("saved")}
                    >
                        <AppText style={mode === "saved" ? styles.tabTextActive : styles.tabText}>
                            ที่อยู่ที่บันทึกไว้
                        </AppText>
                    </Pressable>
                    <Pressable
                        style={[styles.tab, mode === "manual" && styles.tabActive]}
                        onPress={() => setMode("manual")}
                    >
                        <AppText
                            style={mode === "manual" ? styles.tabTextActive : styles.tabText}
                        >
                            กรอกที่อยู่ใหม่
                        </AppText>
                    </Pressable>
                </View>
            )}

            {mode === "saved" ? (
                <View style={{ gap: 8 }}>
                    {isLoading ? (
                        <AppText style={styles.muted}>กำลังโหลดที่อยู่...</AppText>
                    ) : (
                        savedAddresses?.map((item) => {
                            const isSelected = item.userShippingAddressId === selectedId;
                            const a = item.shippingAddress;
                            return (
                                <Pressable
                                    key={item.userShippingAddressId}
                                    style={[
                                        styles.addressCard,
                                        isSelected && styles.addressCardSelected,
                                    ]}
                                    onPress={() => setSelectedId(item.userShippingAddressId)}
                                >
                                    <AppText size="large">{a.addressLine1}</AppText>
                                    {a.addressLine2 ? (
                                        <AppText style={styles.muted}>{a.addressLine2}</AppText>
                                    ) : null}
                                    <AppText style={styles.muted}>
                                        {[a.subDistrict, a.district, a.province, a.zipCode]
                                            .filter(Boolean)
                                            .join(" ")}
                                    </AppText>
                                </Pressable>
                            );
                        })
                    )}
                </View>
            ) : (
                <View style={{ gap: 12 }}>
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
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { gap: 12 },
    tabRow: { flexDirection: "row", gap: 8 },
    tab: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    tabActive: { backgroundColor: "blue", borderColor: "blue" },
    tabText: { color: "#555" },
    tabTextActive: { color: "white", fontWeight: "bold" },
    addressCard: {
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 12,
        padding: 12,
        gap: 2,
    },
    addressCardSelected: { borderColor: "blue", borderWidth: 2 },
    muted: { color: "gray" },
});
