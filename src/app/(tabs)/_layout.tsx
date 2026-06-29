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
                name="orders"
                options={{
                    tabBarIcon: ({ focused, ...rest }) => (
                        <MaterialDesignIcons
                            name={
                                focused
                                    ? "file-document-multiple"
                                    : "file-document-multiple-outline"
                            }
                            {...rest}
                        />
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
