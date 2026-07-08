import { getProducts } from "@/api/products/getProducts";
import AppText from "@/components/ui/AppText";
import { useProducts } from "@/hooks/useProducts";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
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
    const {} = useQuery({
        queryKey: ["products"],
        queryFn: () => getProducts,
    });

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
    } = useProducts(20);
    const items = useMemo(() => data?.pages.flatMap((page) => page.items) || [], [data]);

    const handleEndReached = useCallback(
        debounce(() => {
            if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        }, 300),
        [hasNextPage, isFetchingNextPage, fetchNextPage],
    );

    if (isError) {
        return (
            <View style={{ flex: 1, gap: 16, justifyContent: "center", alignItems: "center" }}>
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
            <View style={styles.contentContainer}>
                {isPending ? (
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <ActivityIndicator size={64} />
                    </View>
                ) : items.length === 0 ? (
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <AppText style={{ textAlign: "center", color: "gray" }}>
                            ดูเหมือนว่าจะยังไม่มีรายการขาย
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
                                        <View
                                            style={{
                                                aspectRatio: 1,
                                                backgroundColor: "skyblue",
                                                borderRadius: 8,
                                            }}
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

const styles = StyleSheet.create({
    container: { flex: 1 },
    contentContainer: { flex: 1, backgroundColor: "white" },
});
