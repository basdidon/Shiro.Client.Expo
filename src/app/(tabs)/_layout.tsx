import { Link, Tabs } from "expo-router";

import CartButton from "@/components/CartButton";
import HeaderButtonsContainer from "@/components/HeaderButtonsContainer";
import { useAuthStore } from "@/store/useAuthStore";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Pressable } from "react-native";

export default function TabLayout() {
    const roles = useAuthStore((state) => state.roles);
    const showDashboard =
        roles.includes("super-admin") || roles.includes("owner") || roles.includes("order-manager");
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
            <Tabs.Protected guard={showDashboard}>
                <Tabs.Screen
                    name="dashboard"
                    options={{
                        title: "แดชบอร์ด",
                        headerTitle: "แดชบอร์ด",
                        headerRight: () => (
                            <HeaderButtonsContainer>
                                <Link href="/profile" asChild>
                                    <Pressable hitSlop={8}>
                                        <MaterialDesignIcons name="account-outline" size={22} />
                                    </Pressable>
                                </Link>
                            </HeaderButtonsContainer>
                        ),
                        tabBarIcon: ({ focused, ...rest }) => (
                            <MaterialDesignIcons
                                name={focused ? "view-dashboard" : "view-dashboard-outline"}
                                {...rest}
                            />
                        ),
                    }}
                />
            </Tabs.Protected>
            <Tabs.Screen
                name="index"
                options={{
                    title: "หน้าหลัก",
                    headerTitle: "",
                    tabBarIcon: ({ focused, ...rest }) => (
                        <MaterialDesignIcons name={focused ? "home" : "home-outline"} {...rest} />
                    ),
                }}
            />
            <Tabs.Screen
                name="categories"
                options={{
                    title: "หมวดหมู่",
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
                    title: "รายการสินค้า",
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
                    title: "แสกนสินค้า",
                    headerTitle: "แสกนสินค้า",
                    tabBarIcon: ({ focused: _focused, ...rest }) => (
                        <MaterialDesignIcons name="barcode-scan" {...rest} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "โปรไฟล์",
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
