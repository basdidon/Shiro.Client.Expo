import { useMemo, useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { FlatList, Modal, Pressable, StyleSheet, TextInput, View } from "react-native";

import AppText from "@/components/ui/AppText";
import {
    getDistrictsByProvince,
    getSubdistrictsByDistrict,
    thaiProvinces,
    type ThaiDistrict,
    type ThaiProvince,
    type ThaiSubdistrict,
} from "@/data/thailand";

interface AddressLocationFields {
    province: string;
    district: string;
    subDistrict: string;
    zipCode: string;
}

interface FormThailandLocationPickerProps<
    TFieldValues extends FieldValues & AddressLocationFields,
> {
    control: Control<TFieldValues>;
}

type PickerKind = "province" | "district" | "subDistrict" | null;

export default function FormThailandLocationPicker<
    TFieldValues extends FieldValues & AddressLocationFields,
>({ control }: FormThailandLocationPickerProps<TFieldValues>) {
    const [openPicker, setOpenPicker] = useState<PickerKind>(null);
    const [search, setSearch] = useState("");

    const province = useController({ control, name: "province" as Path<TFieldValues> });
    const district = useController({ control, name: "district" as Path<TFieldValues> });
    const subDistrict = useController({ control, name: "subDistrict" as Path<TFieldValues> });
    const zipCode = useController({ control, name: "zipCode" as Path<TFieldValues> });

    const selectedProvince = thaiProvinces.find(
        (p) => p.provinceNameTh === province.field.value,
    );
    const districtOptions = selectedProvince
        ? getDistrictsByProvince(selectedProvince.provinceCode)
        : [];
    const selectedDistrict = districtOptions.find(
        (d) => d.districtNameTh === district.field.value,
    );
    const subDistrictOptions = selectedDistrict
        ? getSubdistrictsByDistrict(selectedDistrict.districtCode)
        : [];

    const closePicker = () => {
        setOpenPicker(null);
        setSearch("");
    };

    const handleSelectProvince = (item: ThaiProvince) => {
        province.field.onChange(item.provinceNameTh);
        district.field.onChange("");
        subDistrict.field.onChange("");
        zipCode.field.onChange("");
        closePicker();
    };

    const handleSelectDistrict = (item: ThaiDistrict) => {
        district.field.onChange(item.districtNameTh);
        subDistrict.field.onChange("");
        zipCode.field.onChange("");
        closePicker();
    };

    const handleSelectSubDistrict = (item: ThaiSubdistrict) => {
        subDistrict.field.onChange(item.subdistrictNameTh);
        zipCode.field.onChange(String(item.postalCode));
        closePicker();
    };

    const listData = useMemo((): (ThaiProvince | ThaiDistrict | ThaiSubdistrict)[] => {
        const query = search.trim().toLowerCase();
        if (openPicker === "province") {
            return query
                ? thaiProvinces.filter((p) => p.provinceNameTh.toLowerCase().includes(query))
                : thaiProvinces;
        }
        if (openPicker === "district") {
            return query
                ? districtOptions.filter((d) => d.districtNameTh.toLowerCase().includes(query))
                : districtOptions;
        }
        if (openPicker === "subDistrict") {
            return query
                ? subDistrictOptions.filter((s) =>
                      s.subdistrictNameTh.toLowerCase().includes(query),
                  )
                : subDistrictOptions;
        }
        return [];
    }, [openPicker, search, districtOptions, subDistrictOptions]);

    const isProvince = (item: ThaiProvince | ThaiDistrict | ThaiSubdistrict): item is ThaiProvince =>
        "provinceNameTh" in item;
    const isDistrict = (item: ThaiProvince | ThaiDistrict | ThaiSubdistrict): item is ThaiDistrict =>
        "districtNameTh" in item;

    const pickerTitle =
        openPicker === "province"
            ? "เลือกจังหวัด"
            : openPicker === "district"
              ? "เลือกอำเภอ/เขต"
              : "เลือกตำบล/แขวง";

    return (
        <View style={{ gap: 12 }}>
            <View>
                <AppText size="medium" style={styles.label}>
                    จังหวัด
                </AppText>
                <Pressable style={styles.trigger} onPress={() => setOpenPicker("province")}>
                    <AppText style={styles.triggerText}>
                        {province.field.value || "เลือกจังหวัด"}
                    </AppText>
                </Pressable>
                {province.fieldState.error ? (
                    <AppText style={styles.error}>{province.fieldState.error.message}</AppText>
                ) : null}
            </View>

            <View>
                <AppText size="medium" style={styles.label}>
                    อำเภอ/เขต
                </AppText>
                <Pressable
                    style={[styles.trigger, !selectedProvince && styles.triggerDisabled]}
                    disabled={!selectedProvince}
                    onPress={() => setOpenPicker("district")}
                >
                    <AppText style={styles.triggerText}>
                        {district.field.value || "เลือกอำเภอ/เขต"}
                    </AppText>
                </Pressable>
                {district.fieldState.error ? (
                    <AppText style={styles.error}>{district.fieldState.error.message}</AppText>
                ) : null}
            </View>

            <View>
                <AppText size="medium" style={styles.label}>
                    ตำบล/แขวง
                </AppText>
                <Pressable
                    style={[styles.trigger, !selectedDistrict && styles.triggerDisabled]}
                    disabled={!selectedDistrict}
                    onPress={() => setOpenPicker("subDistrict")}
                >
                    <AppText style={styles.triggerText}>
                        {subDistrict.field.value || "เลือกตำบล/แขวง"}
                    </AppText>
                </Pressable>
                {subDistrict.fieldState.error ? (
                    <AppText style={styles.error}>{subDistrict.fieldState.error.message}</AppText>
                ) : null}
            </View>

            <Modal
                visible={openPicker !== null}
                animationType="slide"
                transparent
                onRequestClose={closePicker}
            >
                <Pressable style={styles.backdrop} onPress={closePicker}>
                    <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
                        <AppText size="title" style={styles.sheetTitle}>
                            {pickerTitle}
                        </AppText>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="ค้นหา"
                            value={search}
                            onChangeText={setSearch}
                            autoFocus
                        />
                        <FlatList
                            data={listData}
                            keyExtractor={(item) => String(item.id)}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={styles.row}
                                    onPress={() => {
                                        if (isProvince(item)) {
                                            handleSelectProvince(item);
                                        } else if (isDistrict(item)) {
                                            handleSelectDistrict(item);
                                        } else {
                                            handleSelectSubDistrict(item);
                                        }
                                    }}
                                >
                                    <AppText style={styles.rowText}>
                                        {isProvince(item)
                                            ? item.provinceNameTh
                                            : isDistrict(item)
                                              ? item.districtNameTh
                                              : item.subdistrictNameTh}
                                    </AppText>
                                </Pressable>
                            )}
                            ListEmptyComponent={
                                <AppText style={styles.emptyText}>ไม่พบข้อมูล</AppText>
                            }
                        />
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    label: { marginBottom: 4 },
    trigger: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    triggerDisabled: { backgroundColor: "#f2f2f2" },
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
        maxHeight: "70%",
    },
    sheetTitle: { textAlign: "center", marginBottom: 12 },
    searchInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 8,
    },
    row: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    rowText: { fontSize: 16 },
    emptyText: { textAlign: "center", color: "gray", paddingVertical: 24 },
});
