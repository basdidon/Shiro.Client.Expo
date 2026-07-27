import AppText from "@/components/ui/AppText";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Link, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function () {
    const { id } = useLocalSearchParams<{ id: string }>();
    return (
        <SafeAreaView edges={["bottom"]}>
            <View style={styles.container}>
                <AppText size="title" style={styles.title}>
                    อัปโหลดรูปภาพ {id}
                </AppText>
                <View style={styles.btnContainer}>
                    <Link
                        href={{
                            pathname: "/products/[id]/upload-image/select-image-source",
                            params: { id, type: "Thumbnail" },
                        }}
                        replace
                        asChild
                    >
                        <Pressable style={styles.btn}>
                            <View style={styles.iconContainer}>
                                <MaterialDesignIcons name="image" color={"lightgray"} size={24} />
                            </View>
                            <AppText size="large">รูปย่อ (512x512)</AppText>
                        </Pressable>
                    </Link>
                    <Link
                        href={{
                            pathname: "/products/[id]/upload-image/select-image-source",
                            params: { id, type: "Detail" },
                        }}
                        replace
                        asChild
                    >
                        <Pressable style={styles.btn}>
                            <View style={styles.iconContainer}>
                                <MaterialDesignIcons name="image" color={"lightgray"} size={24} />
                            </View>
                            <AppText size="large">รูปปก (1024x768)</AppText>
                        </Pressable>
                    </Link>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        paddingHorizontal: 12,
        paddingVertical: 24,
        minHeight: 240,
    },
    title: {
        marginBottom: 24,
    },
    btnContainer: { gap: 8 },
    btn: {
        flexDirection: "row",
        backgroundColor: "lightgray",
        padding: 12,
        borderRadius: 12,
        alignItems: "center",
        gap: 24,
    },
    iconContainer: {
        backgroundColor: "white",
        padding: 8,
        borderRadius: 8,
    },
});
