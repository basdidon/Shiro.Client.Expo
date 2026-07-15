import { Tabs } from "expo-router";

import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ focused, ...rest }) => (
                        <MaterialDesignIcons name={focused ? "home" : "home-outline"} {...rest} />
                    ),
                }}
            />
            <Tabs.Screen
                name="categories"
                options={{
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
                    title: "Scan",
                    tabBarIcon: ({ focused: _focused, ...rest }) => (
                        <MaterialDesignIcons name="barcode-scan" {...rest} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
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
