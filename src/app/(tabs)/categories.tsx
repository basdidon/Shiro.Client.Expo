import AppText from "@/components/ui/AppText";
import { useCategories } from "@/hooks/useCategories";
import { DEFAULT_CATEGORY_ICON, type CategoryIconName } from "@/lib/categoryIcons";
import { useAuthStore } from "@/store/useAuthStore";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { FlashList } from "@shopify/flash-list";
import { Link, router, Stack } from "expo-router";
import { useRef } from "react";
import { ActivityIndicator, Button, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoriesPage() {
    const isProductManager = useAuthStore((state) => state.role === "ProductManager");
    const { data: categories, isPending, isError, error, refetch } = useCategories();

    // long-pressing a cell should navigate to edit instead of filtering products;
    // this flag suppresses the onPress that Pressable still fires on release
    // after a long press
    const suppressNextPressRef = useRef(false);

    const headerRight = isProductManager
        ? () => (
              <Link href="/categories/create" asChild>
                  <Pressable hitSlop={8}>
                      <MaterialDesignIcons name="plus" size={24} />
                  </Pressable>
              </Link>
          )
        : undefined;

    if (isPending) {
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <Stack.Screen options={{ headerRight }} />
                <ActivityIndicator size={64} />
            </View>
        );
    }

    if (isError) {
        return (
            <View style={{ flex: 1, gap: 16, justifyContent: "center", alignItems: "center" }}>
                <Stack.Screen options={{ headerRight }} />
                <AppText>{error.message}</AppText>
                <Button title="Reload" onPress={() => refetch()} />
            </View>
        );
    }

    return (
        <SafeAreaView edges={["left", "right"]} style={styles.container}>
            <Stack.Screen options={{ headerRight }} />
            <View style={styles.contentContainer}>
                {categories.length === 0 ? (
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <AppText style={{ textAlign: "center", color: "gray" }}>
                            ยังไม่มีรายการหมวดหมู่
                        </AppText>
                    </View>
                ) : (
                    <FlashList
                        numColumns={3}
                        data={categories}
                        contentContainerStyle={{ padding: 8 }}
                        keyExtractor={(item, index) => String(item.id ?? index)}
                        renderItem={({ item }) => (
                            <Pressable
                                style={styles.cell}
                                onPress={() => {
                                    if (suppressNextPressRef.current) {
                                        suppressNextPressRef.current = false;
                                        return;
                                    }
                                    router.push({
                                        pathname: "/products",
                                        params: { categoryId: String(item.id) },
                                    });
                                }}
                                onLongPress={
                                    isProductManager
                                        ? () => {
                                              suppressNextPressRef.current = true;
                                              router.push({
                                                  pathname: "/categories/[id]/edit",
                                                  params: { id: String(item.id) },
                                              });
                                          }
                                        : undefined
                                }
                            >
                                <View style={styles.iconCircle}>
                                    <MaterialDesignIcons
                                        name={
                                            (item.iconName as CategoryIconName) ??
                                            DEFAULT_CATEGORY_ICON
                                        }
                                        size={28}
                                    />
                                </View>
                                <AppText
                                    size="small"
                                    numberOfLines={2}
                                    style={{ textAlign: "center" }}
                                >
                                    {item.name}
                                </AppText>
                            </Pressable>
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    contentContainer: { flex: 1, backgroundColor: "white" },
    cell: {
        flex: 1,
        alignItems: "center",
        gap: 4,
        marginBottom: 16,
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#f0f0f0",
        alignItems: "center",
        justifyContent: "center",
    },
});
