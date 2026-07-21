import AppText from "@/components/ui/AppText";
import { useUsers } from "@/hooks/useUsers";
import { FlashList } from "@shopify/flash-list";
import { Link } from "expo-router";
import { useCallback, useMemo } from "react";
import { debounce } from "lodash";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UsersScreen() {
    const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useUsers(20);
    const users = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

    const handleEndReached = useCallback(
        debounce(() => {
            if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        }, 300),
        [hasNextPage, isFetchingNextPage, fetchNextPage],
    );

    if (isPending) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size={64} />
            </View>
        );
    }

    return (
        <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
            {users.length === 0 ? (
                <View style={styles.loading}>
                    <AppText style={{ color: "gray" }}>ยังไม่มีผู้ใช้</AppText>
                </View>
            ) : (
                <FlashList
                    data={users}
                    keyExtractor={(item) => item.userId!}
                    contentContainerStyle={{ padding: 12 }}
                    onEndReachedThreshold={0.4}
                    onEndReached={handleEndReached}
                    ListFooterComponent={
                        isFetchingNextPage ? (
                            <ActivityIndicator
                                color="blue"
                                size="small"
                                style={{ marginVertical: 12 }}
                            />
                        ) : null
                    }
                    renderItem={({ item }) => (
                        <Link href={{ pathname: "/users/[id]", params: { id: item.userId! } }} asChild>
                            <Pressable style={styles.row}>
                                <View style={{ flex: 1 }}>
                                    <AppText size="large">{item.username}</AppText>
                                    <AppText size="small" style={{ color: "gray" }}>
                                        {item.roles && item.roles.length > 0
                                            ? item.roles.join(", ")
                                            : "ไม่มีบทบาท"}
                                    </AppText>
                                </View>
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
    loading: { flex: 1, justifyContent: "center", alignItems: "center" },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
});
