import AppText from "@/components/ui/AppText";
import { useUsers } from "@/hooks/useUsers";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { FlashList } from "@shopify/flash-list";
import { Link } from "expo-router";
import { debounce } from "lodash";
import { useCallback, useMemo } from "react";
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
                        <Link
                            href={{ pathname: "/users/[id]", params: { id: item.userId! } }}
                            asChild
                        >
                            <Pressable style={styles.row}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        paddingHorizontal: 18,
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 48,
                                            aspectRatio: 1,
                                            marginRight: 12,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "wheat",
                                            borderRadius: 12,
                                        }}
                                    >
                                        <MaterialDesignIcons name="account" size={32} color="tan" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <AppText size="large">{item.username}</AppText>
                                        {(item.firstname || item.lastname) && (
                                            <AppText size="small" style={{ color: "gray" }}>
                                                {`${item.firstname ?? ""} ${item.lastname ?? ""}`.trim()}
                                            </AppText>
                                        )}
                                        <AppText size="small" style={{ color: "gray" }}>
                                            {item.roles && item.roles.length > 0
                                                ? item.roles.join(", ")
                                                : "ไม่มีบทบาท"}
                                        </AppText>
                                    </View>
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
        backgroundColor: "white",
    },
});
