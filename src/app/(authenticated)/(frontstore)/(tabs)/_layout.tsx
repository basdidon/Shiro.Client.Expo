import CartButton from "@/components/CartButton";
import HeaderButtonsContainer from "@/components/HeaderButtonsContainer";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Tabs } from "expo-router";

const TAB_BAR_ICON_SIZE = 24;

export default () => {
    return (
        <Tabs
            screenOptions={{
                headerTitleStyle: { fontFamily: "Mali_700Bold" },
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
                    title: "หน้าแรก",
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
                    title: "รายการสินค้า",
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
                    title: "ประวัติ",
                    headerTitle: "ประวัติการซื้อของฉัน",
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
                    title: "โปรไฟล์",
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
