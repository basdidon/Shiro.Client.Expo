import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Pressable, StyleSheet } from "react-native";

interface Props {
    value: boolean;
    setValue: (value: boolean) => void;
}

export default function HeartButton({ value, setValue }: Props) {
    const onClicked = () => {
        setValue(!value);
    };

    return (
        <Pressable style={styles.button} onPress={onClicked}>
            <MaterialDesignIcons
                name={value ? "heart" : "heart-outline"}
                color={value ? "red" : "gray"}
                size={48}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
