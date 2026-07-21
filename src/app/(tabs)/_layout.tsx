import { Tabs } from "expo-router";

import CartButton from "@/components/CartButton";
import HeaderButtonsContainer from "@/components/HeaderButtonsContainer";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerRight: () => (
                    <HeaderButtonsContainer>
                        <CartButton />
                    </HeaderButtonsContainer>
                ),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    headerTitle: "",
                    tabBarIcon: ({ focused, ...rest }) => (
                        <MaterialDesignIcons name={focused ? "home" : "home-outline"} {...rest} />
                    ),
                }}
            />
            <Tabs.Screen
                name="categories"
                options={{
                    headerTitle: "หมวดหมู่",
                    tabBarIcon: ({ focused, ...rest }) => (
                        <MaterialDesignIcons
                            name={focused ? "view-grid" : "view-grid-outline"}
                            {...rest}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="products"
                options={{
                    headerTitle: "รายการสินค้า",
                    tabBarIcon: ({ focused, ...rest }) => (
                        <MaterialDesignIcons
                            name={focused ? "package-variant" : "package-variant-closed"}
                            {...rest}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="scanner"
                options={{
                    headerTitle: "แสกนสินค้า",
                    title: "Scan",
                    tabBarIcon: ({ focused: _focused, ...rest }) => (
                        <MaterialDesignIcons name="barcode-scan" {...rest} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    headerTitle: "โปรไฟล์",
                    tabBarIcon: ({ focused, ...rest }) => (
                        <MaterialDesignIcons
                            name={focused ? "account" : "account-outline"}
                            {...rest}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
