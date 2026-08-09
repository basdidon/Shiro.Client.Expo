import AppText from "@/components/ui/AppText";
import { useCategories } from "@/hooks/useCategories";
import { DEFAULT_CATEGORY_ICON, type CategoryIconName } from "@/lib/categoryIcons";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { FlashList } from "@shopify/flash-list";
import { Link, Stack } from "expo-router";
import {
    ActivityIndicator,
    Button,
    Pressable,
    RefreshControl,
    StyleSheet,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditCategoriesScreen() {
    const { data: categories, isPending, isError, error, refetch, isRefetching } = useCategories();

    const headerRight = () => (
        <Link href={"/categories/create"} asChild>
            <Pressable>
                <MaterialDesignIcons name="plus" size={22} />
            </Pressable>
        </Link>
    );

    if (isPending) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size={64} />
            </View>
        );
    }

    if (isError) {
        return (
            <View style={styles.loading}>
                <AppText>{error.message}</AppText>
                <Button title="Reload" onPress={() => refetch()} />
            </View>
        );
    }

    return (
        <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
            <Stack.Screen options={{ headerRight }} />
            {categories.length === 0 ? (
                <View style={styles.loading}>
                    <AppText style={{ color: "gray" }}>ยังไม่มีรายการหมวดหมู่</AppText>
                </View>
            ) : (
                <FlashList
                    data={categories}
                    keyExtractor={(item, index) => String(item.id ?? index)}
                    contentContainerStyle={{ padding: 12 }}
                    refreshControl={
                        <RefreshControl
                            tintColor="blue"
                            refreshing={isRefetching}
                            onRefresh={refetch}
                        />
                    }
                    renderItem={({ item }) => (
                        <Link
                            href={{
                                pathname: "/categories/[id]/edit",
                                params: { id: String(item.id) },
                            }}
                            asChild
                        >
                            <Pressable style={styles.row}>
                                <View style={styles.iconCircle}>
                                    <MaterialDesignIcons
                                        name={
                                            (item.iconName as CategoryIconName) ??
                                            DEFAULT_CATEGORY_ICON
                                        }
                                        size={22}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <AppText size="large">{item.name}</AppText>
                                    {item.parentCategoryName ? (
                                        <AppText size="small" style={{ color: "gray" }}>
                                            หมวดหมู่หลัก: {item.parentCategoryName}
                                        </AppText>
                                    ) : null}
                                </View>
                                <MaterialDesignIcons name="chevron-right" size={22} color="gray" />
                            </Pressable>
                        </Link>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loading: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16 },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#f0f0f0",
        alignItems: "center",
        justifyContent: "center",
    },
});
