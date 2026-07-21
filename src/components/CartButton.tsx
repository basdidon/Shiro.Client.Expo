import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Link } from "expo-router";
import { Pressable } from "react-native";

function CartButton() {
    return (
        <Link href="/cart" asChild>
            <Pressable hitSlop={8}>
                <MaterialDesignIcons name="cart-outline" size={22} />
            </Pressable>
        </Link>
    );
}

export default CartButton;
