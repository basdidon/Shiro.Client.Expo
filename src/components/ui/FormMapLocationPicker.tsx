import { useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Button, Modal, Pressable, StyleSheet, View } from "react-native";
import MapView, { LatLng, MapPressEvent, Marker, MarkerDragStartEndEvent } from "react-native-maps";

import AppText from "@/components/ui/AppText";

interface FormMapLocationPickerProps<TFieldValues extends FieldValues> {
    control: Control<TFieldValues>;
    name: Path<TFieldValues>;
}

const DEFAULT_REGION = {
    latitude: 13.7563,
    longitude: 100.5018,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
};

const toGoogleMapUrl = (coordinate: LatLng) =>
    `https://www.google.com/maps?q=${coordinate.latitude},${coordinate.longitude}`;

export default function FormMapLocationPicker<TFieldValues extends FieldValues>({
    control,
    name,
}: FormMapLocationPickerProps<TFieldValues>) {
    const { field, fieldState } = useController({ control, name });
    const [isOpen, setIsOpen] = useState(false);
    const [pin, setPin] = useState<LatLng | null>(null);

    const value = typeof field.value === "string" ? field.value : "";

    const handleConfirm = () => {
        if (!pin) return;
        field.onChange(toGoogleMapUrl(pin));
        setIsOpen(false);
    };

    return (
        <View style={{ gap: 8 }}>
            <Pressable
                style={styles.trigger}
                onPress={() => {
                    setPin(null);
                    setIsOpen(true);
                }}
            >
                <AppText style={styles.triggerText} numberOfLines={1}>
                    {value || "เลือกตำแหน่งบนแผนที่"}
                </AppText>
            </Pressable>
            {fieldState.error ? (
                <AppText style={styles.error}>{fieldState.error.message}</AppText>
            ) : null}

            <Modal
                visible={isOpen}
                animationType="slide"
                onRequestClose={() => setIsOpen(false)}
            >
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={DEFAULT_REGION}
                        onPress={(e: MapPressEvent) => setPin(e.nativeEvent.coordinate)}
                    >
                        {pin ? (
                            <Marker
                                coordinate={pin}
                                draggable
                                onDragEnd={(e: MarkerDragStartEndEvent) =>
                                    setPin(e.nativeEvent.coordinate)
                                }
                            />
                        ) : null}
                    </MapView>
                    <View style={styles.footer}>
                        <AppText style={styles.hint}>
                            {pin
                                ? `ตำแหน่งที่เลือก: ${pin.latitude.toFixed(5)}, ${pin.longitude.toFixed(5)}`
                                : "แตะบนแผนที่เพื่อปักหมุด"}
                        </AppText>
                        <View style={styles.buttonRow}>
                            <Button title="ยกเลิก" onPress={() => setIsOpen(false)} />
                            <Button title="ยืนยันตำแหน่ง" onPress={handleConfirm} disabled={!pin} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    trigger: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    triggerText: { color: "#555" },
    error: { color: "red", fontSize: 12 },
    mapContainer: { flex: 1 },
    map: { flex: 1 },
    footer: {
        backgroundColor: "white",
        padding: 16,
        gap: 8,
        borderTopWidth: 1,
        borderColor: "#eee",
    },
    hint: { textAlign: "center", color: "gray" },
    buttonRow: { flexDirection: "row", justifyContent: "space-around" },
});
