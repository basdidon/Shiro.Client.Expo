import HeaderButtonsContainer from "@/components/HeaderButtonsContainer";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

const TAB_BAR_ICON_SIZE = 24;

export default () => {
    return (
        <Tabs
            screenOptions={{
                headerTitleStyle: { fontFamily: "Mali_700Bold" },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "แดชบอร์ด",
                    tabBarIcon: ({ focused, color }) => (
                        <MaterialDesignIcons
                            name={focused ? "view-dashboard" : "view-dashboard-outline"}
                            size={TAB_BAR_ICON_SIZE}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="products"
                options={{
                    title: "รายการสินค้า",
                    headerRight: () => {
                        return (
                            <HeaderButtonsContainer>
                                <Link href={"/(authenticated)/(backstore)/products/create"} asChild>
                                    <Pressable>
                                        <MaterialDesignIcons
                                            name="package-variant-plus"
                                            size={24}
                                        />
                                    </Pressable>
                                </Link>
                            </HeaderButtonsContainer>
                        );
                    },
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
                    title: "แสกนสินค้า",
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
                    title: "คำสั่งซื้อ",
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
                    title: "ผู้ใช้งาน",
                    headerTitle: "",
                    headerRight: () => {
                        return (
                            <HeaderButtonsContainer>
                                <Link href={"/(authenticated)/(frontstore)/(tabs)"} replace asChild>
                                    <Pressable>
                                        <MaterialDesignIcons
                                            name="storefront-outline"
                                            color={"#000"}
                                            size={24}
                                        />
                                    </Pressable>
                                </Link>
                            </HeaderButtonsContainer>
                        );
                    },
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
