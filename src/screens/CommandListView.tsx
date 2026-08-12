import AppText from "@/components/ui/AppText";
import { useAuthStore } from "@/store/useAuthStore";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Href, Link } from "expo-router";
import { Pressable, View } from "react-native";

export default () => {
    const roles = useAuthStore((state) => state.roles);
    const isProductManager = roles.includes("product-manager");
    const isOrderManager = roles.includes("order-manager");
    const canManageUser = roles.includes("super-admin") || roles.includes("owner");
    const isFinanceManager = roles.includes("finance-manager");

    if (!isProductManager && !isOrderManager && !canManageUser && !isFinanceManager) return <></>;

    return (
        <View
            style={{
                flexDirection: "row",
                columnGap: 12,
                rowGap: 16,
                flexWrap: "wrap",
            }}
        >
            {isProductManager && (
                <>
                    <CommandItem
                        iconName="view-grid-plus-outline"
                        pathname="/categories/create"
                        label="เพิ่มหมวดหมู่สินค้า"
                    />
                    <CommandItem
                        iconName="package-variant-closed-plus"
                        pathname="/products/create"
                        label="เพิ่มรายการสินค้า"
                    />
                </>
            )}
            {isOrderManager && (
                <CommandItem
                    iconName="file-document-multiple-outline"
                    pathname="/orders"
                    label="คำสั่งซื้อ"
                />
            )}
            {canManageUser && (
                <CommandItem iconName="account-group-outline" pathname="/users" label="ผู้ใช้งาน" />
            )}
            {isFinanceManager && (
                <CommandItem iconName="cash-multiple" pathname="/payments" label="การชำระเงิน" />
            )}
        </View>
    );
};

interface CommandItemProps {
    iconName: React.ComponentProps<typeof MaterialDesignIcons>["name"];
    pathname: Href;
    label?: string;
}
const CommandItem = ({ iconName, pathname, label }: CommandItemProps) => {
    return (
        <Link href={pathname} asChild>
            <Pressable
                style={{
                    alignItems: "center",
                    gap: 8,
                    width: 78,
                }}
            >
                <View
                    style={{
                        width: 52,
                        aspectRatio: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "cyan",
                        borderRadius: 8,
                    }}
                >
                    <MaterialDesignIcons name={iconName} size={40} color={"#fff"} />
                </View>
                <AppText style={{ textAlign: "center" }} numberOfLines={2}>
                    {label || ""}
                </AppText>
            </Pressable>
        </Link>
    );
};
