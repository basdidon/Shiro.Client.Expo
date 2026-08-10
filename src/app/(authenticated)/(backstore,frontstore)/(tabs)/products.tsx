import AppText from "@/components/ui/AppText";
import { useCategories } from "@/hooks/useCategories";
import { useProductImageDownloadUrl, useProducts } from "@/hooks/useProducts";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { debounce } from "lodash";
import { useCallback, useMemo } from "react";
import {
    ActivityIndicator,
    Button,
    Pressable,
    RefreshControl,
    StyleSheet,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ROW_GAP = 8;
const COLUMN_GAP = 4;
const HAFT_COLUMN_GAP = COLUMN_GAP / 2;

export default function ProductPage() {
    const { categoryId: categoryIdParam } = useLocalSearchParams<{ categoryId?: string }>();
    const categoryId = categoryIdParam ? Number(categoryIdParam) : undefined;
    const {
        data,
        isError,
        error,
        isPending,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching,
    } = useProducts(20, categoryId);
    const { data: categories } = useCategories();

    const items = useMemo(() => data?.pages.flatMap((page) => page.items) || [], [data]);

    const categoryName = categoryId
        ? categories?.find((category) => Number(category.id) === categoryId)?.name
        : undefined;

    const handleEndReached = useCallback(
        debounce(() => {
            if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        }, 300),
        [hasNextPage, isFetchingNextPage, fetchNextPage],
    );

    const clearFilter = () => router.setParams({ categoryId: undefined });

    const filterBar = categoryId ? (
        <View style={styles.filterBar}>
            <MaterialDesignIcons name="filter" size={16} color="#555" />
            <AppText size="small" style={styles.filterBarText}>
                {categoryName ?? "หมวดหมู่ที่เลือก"}
            </AppText>
            <Pressable style={styles.clearFilterButton} onPress={clearFilter} hitSlop={8}>
                <MaterialDesignIcons name="close" size={14} color="#555" />
                <AppText size="small" style={styles.filterBarText}>
                    ล้างตัวกรอง
                </AppText>
            </Pressable>
        </View>
    ) : null;

    if (isError) {
        return (
            <View style={{ flex: 1, gap: 16, justifyContent: "center", alignItems: "center" }}>
                <Stack.Screen options={{ title: categoryName }} />
                {filterBar}
                {isRefetching ? (
                    <ActivityIndicator size={48} />
                ) : (
                    <AppText>{error.message}</AppText>
                )}
                <Button title="Reload" onPress={() => refetch()} />
            </View>
        );
    }

    return (
        <SafeAreaView edges={["left", "right"]} style={styles.container}>
            {filterBar}
            <View style={styles.contentContainer}>
                {isPending ? (
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <ActivityIndicator size={64} />
                    </View>
                ) : items.length === 0 ? (
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <AppText style={{ textAlign: "center", color: "gray" }}>
                            {categoryId
                                ? "ไม่พบสินค้าในหมวดหมู่นี้"
                                : "ดูเหมือนว่าจะยังไม่มีรายการขาย"}
                        </AppText>
                    </View>
                ) : (
                    <FlashList
                        numColumns={2}
                        data={items}
                        contentContainerStyle={{ padding: 8 }}
                        keyExtractor={(item) => item.id}
                        refreshControl={
                            <RefreshControl
                                tintColor={"blue"}
                                refreshing={isRefetching}
                                onRefresh={refetch}
                            />
                        }
                        showsVerticalScrollIndicator={false}
                        //estimatedItemSize={210}
                        drawDistance={600}
                        renderItem={({ item, index }) => {
                            const isLeft = index % 2 === 0;
                            return (
                                <Link
                                    href={{
                                        pathname: "/products/[id]",
                                        params: { id: item.id },
                                    }}
                                    asChild
                                >
                                    <Pressable
                                        style={{
                                            flex: 1,
                                            gap: 4,
                                            marginRight: isLeft ? HAFT_COLUMN_GAP : 0,
                                            marginLeft: isLeft ? 0 : HAFT_COLUMN_GAP,
                                            marginBottom: ROW_GAP,
                                        }}
                                    >
                                        <ProductThumbnail
                                            productId={item.id}
                                            hasThumbnailImage={item.hasThumbnailImage}
                                        />
                                        <View>
                                            <AppText
                                                size="large"
                                                numberOfLines={2}
                                                style={{ height: 48 }}
                                            >
                                                {item.name}
                                            </AppText>
                                            <AppText size="heading" style={{ textAlign: "right" }}>
                                                {item.unitPrice} .-
                                            </AppText>
                                        </View>
                                    </Pressable>
                                </Link>
                            );
                        }}
                        onEndReachedThreshold={0.4}
                        onEndReached={handleEndReached}
                        ListFooterComponent={
                            isFetchingNextPage ? (
                                <ActivityIndicator
                                    color="blue"
                                    size="small"
                                    style={{ marginBottom: 5 }}
                                />
                            ) : null
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

function ProductThumbnail({
    productId,
    hasThumbnailImage,
}: {
    productId: string;
    hasThumbnailImage: boolean;
}) {
    const { data: thumbnailUrl } = useProductImageDownloadUrl(
        productId,
        "Thumbnail",
        hasThumbnailImage,
    );

    if (thumbnailUrl) {
        return (
            <Image
                source={{ uri: thumbnailUrl }}
                style={{ aspectRatio: 1, borderRadius: 8 }}
                contentFit="cover"
            />
        );
    }

    return (
        <View
            style={{
                aspectRatio: 1,
                backgroundColor: "#faf9f6",
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <MaterialDesignIcons name="image-off-outline" size={92} color={"#d3d3d3"} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    contentContainer: { flex: 1, backgroundColor: "white" },
    filterBar: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: "#f0f0f0",
    },
    filterBarText: { color: "#555" },
    clearFilterButton: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 2,
        marginLeft: "auto",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ccc",
    },
});
