import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
    value: number;
    setValue: (newValue: number) => void;
    min?: number;
    size?: "default" | "small";
}

export default function Stepper({ value, setValue, min = 1, size = "default" }: Props) {
    const isSmall = size === "small";

    const onIncrease = () => {
        setValue(value + 1);
    };

    const onDecrease = () => {
        if (value <= min) return;

        setValue(value - 1);
    };

    return (
        <View style={[styles.container, isSmall && styles.containerSmall]}>
            <TouchableOpacity
                style={[styles.button, isSmall && styles.buttonSmall]}
                onPress={onDecrease}
            >
                <MaterialDesignIcons name="minus" color={"white"} size={isSmall ? 16 : 24} />
            </TouchableOpacity>
            <Text style={[styles.text, isSmall && styles.textSmall]}>{value}</Text>
            <TouchableOpacity
                style={[styles.button, isSmall && styles.buttonSmall]}
                onPress={onIncrease}
            >
                <MaterialDesignIcons name="plus" color={"white"} size={isSmall ? 16 : 24} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 24 },
    containerSmall: { gap: 12 },
    button: { backgroundColor: "blue", padding: 8, borderRadius: 24 },
    buttonSmall: { padding: 4, borderRadius: 16 },
    text: { fontSize: 20, fontFamily: "Mali_700Bold" },
    textSmall: { fontSize: 14, minWidth: 16, textAlign: "center" },
});
