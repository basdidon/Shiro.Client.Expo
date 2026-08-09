import CartButton from "@/components/CartButton";
import HeaderButtonsContainer from "@/components/HeaderButtonsContainer";
import { useAuthStore } from "@/store/useAuthStore";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

const TAB_BAR_ICON_SIZE = 24;

export default () => {
    const canAccessBackstore = useAuthStore(
        (state) =>
            state.roles.includes("super-admin") ||
            state.roles.includes("owner") ||
            state.roles.includes("finance-manager") ||
            state.roles.includes("product-manager") ||
            state.roles.includes("order-manager") ||
            state.roles.includes("staff"),
    );
    return (
        <Tabs
            screenOptions={{
                headerTitle: "frontstore tabs",
                headerTitleStyle: { fontFamily: "Mali_700Bold" },
                headerRight: () => (
                    <HeaderButtonsContainer>
                        <Link href={"/(authenticated)/(backstore)/(tabs)"} replace asChild>
                            <Pressable>
                                <MaterialDesignIcons name="warehouse" color={"#000"} size={24} />
                            </Pressable>
                        </Link>
                        <CartButton />
                    </HeaderButtonsContainer>
                ),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <MaterialDesignIcons
                            name={focused ? "home" : "home-outline"}
                            size={TAB_BAR_ICON_SIZE}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="products"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <MaterialDesignIcons
                            name={focused ? "package-variant" : "package-variant-closed"}
                            size={TAB_BAR_ICON_SIZE}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="scanner"
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialDesignIcons
                            name="barcode-scan"
                            size={TAB_BAR_ICON_SIZE}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="orders"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <MaterialDesignIcons
                            name={
                                focused
                                    ? "file-document-multiple"
                                    : "file-document-multiple-outline"
                            }
                            size={TAB_BAR_ICON_SIZE}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <MaterialDesignIcons
                            name={focused ? "account" : "account-outline"}
                            size={TAB_BAR_ICON_SIZE}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
};
