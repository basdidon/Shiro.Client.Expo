import AppText from "@/components/ui/AppText";
import { CartItem } from "@/types/CartItem";
import { Link } from "expo-router";
import { Pressable, View } from "react-native";

const CartItemView = ({ item }: { item: CartItem }) => {
    return (
        <Link href={{ pathname: "/products/[id]", params: { id: item.id } }} asChild>
            <Pressable style={{ flexDirection: "row", gap: 8 }}>
                <View style={{ backgroundColor: "cyan", width: 92, aspectRatio: 1 }} />
                <View style={{ flex: 1 }}>
                    <AppText size="large">{item.name}</AppText>
                    <AppText size="small">@ {item.unitPrice}</AppText>
                    <AppText size="display" style={{ textAlign: "right" }}>
                        {item.quantity}
                    </AppText>
                </View>
            </Pressable>
        </Link>
    );
};

export default CartItemView;
