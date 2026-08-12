import { StyleSheet, Text, View } from "react-native";

interface TagProps {
    label: string;
}
export default function Tag({ label }: TagProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "blue",
        borderRadius: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    text: {
        color: "white",
        fontSize: 12,
        fontFamily: "Mali_400Regular",
    },
});
