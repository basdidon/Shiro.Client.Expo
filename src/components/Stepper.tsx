import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
    value: number;
    setValue: (newValue: number) => void;
}

export default function Stepper({ value, setValue }: Props) {
    const onIncrease = () => {
        setValue(value + 1);
    };

    const onDecrease = () => {
        if (value <= 1) return;

        setValue(value - 1);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={onDecrease}>
                <MaterialDesignIcons
                    name="minus"
                    color={"white"}
                    size={24}
                    style={styles.iconButton}
                />
            </TouchableOpacity>
            <Text style={styles.text}>{value}</Text>
            <TouchableOpacity style={styles.button} onPress={onIncrease}>
                <MaterialDesignIcons
                    name="plus"
                    color={"white"}
                    size={24}
                    style={styles.iconButton}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 24 },
    button: { backgroundColor: "blue", padding: 8, borderRadius: 24 },
    iconButton: {},
    text: { fontSize: 20, fontWeight: "bold" },
});
