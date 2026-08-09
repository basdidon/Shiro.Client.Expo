import HeaderButtonsContainer from "@/components/HeaderButtonsContainer";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

const TAB_BAR_ICON_SIZE = 24;

export default () => {
    return (
        <Tabs
            screenOptions={{
                headerTitle: "backstore tabs",
                headerTitleStyle: { fontFamily: "Mali_700Bold" },
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
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarLabel: "dashboard",
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
