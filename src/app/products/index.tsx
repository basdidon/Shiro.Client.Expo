import { getProducts } from "@/data/products";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
    const products = getProducts();

    return (
        <View style={styles.container}>
            {products.map((x) => (
                <Link id={x.id} href={{ pathname: "/products/[id]", params: { id: x.id } }} asChild>
                    <View style={{ padding: 12, backgroundColor: "white" }}>
                        <Text>{x.name}</Text>
                    </View>
                </Link>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 12,
        padding: 12,
    },
});
