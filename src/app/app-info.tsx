import { getHealth } from "@/api/health/getHealth";
import AppText from "@/components/ui/AppText";
import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppDetails() {
    const {
        mutate: ping,
        isPending,
        isSuccess,
        isError,
        data,
        error,
    } = useMutation({ mutationFn: getHealth });

    return (
        <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingRight: 12,
                    marginTop: 12,
                    marginBottom: 24,
                }}
            >
                <AppText size="label">{"Environment"}</AppText>
                <AppText>{__DEV__ ? "Development" : "Production"}</AppText>
            </View>
            <View style={{ marginTop: 12 }}>
                <View style={{ marginBottom: 4 }}>
                    <AppText size="title">Environment Variables</AppText>
                </View>
                <View style={styles.sectionContainer}>
                    <PropertyField
                        label={"EXPO_PUBLIC_API_URL"}
                        value={process.env.EXPO_PUBLIC_API_URL}
                    />
                    <PropertyField
                        label={"EXPO_PUBLIC_API_PORT"}
                        value={process.env.EXPO_PUBLIC_API_PORT}
                    />
                    <PropertyField
                        label={"EXPO_PUBLIC_USE_REMOTE_API"}
                        value={process.env.EXPO_PUBLIC_USE_REMOTE_API}
                    />
                </View>
            </View>
            <View style={{ marginTop: 12 }}>
                <View style={{ marginBottom: 4 }}>
                    <AppText size="title">API Client</AppText>
                </View>
                <View style={styles.sectionContainer}>
                    <PropertyField label={"BaseUrl"} value={api.defaults.baseURL} />
                </View>
            </View>
            <View style={{ marginTop: 12 }}>
                <View style={{ marginBottom: 4 }}>
                    <AppText size="title">Health Check</AppText>
                </View>
                <View style={styles.sectionContainer}>
                    <PropertyField
                        label={"GET /health"}
                        value={
                            isPending
                                ? "Pinging..."
                                : isSuccess
                                  ? data
                                  : isError
                                    ? (error as Error).message
                                    : "-"
                        }
                    />
                </View>
                <Pressable
                    style={styles.pingButton}
                    onPress={() => ping()}
                    disabled={isPending}
                >
                    {isPending ? (
                        <ActivityIndicator color="blue" />
                    ) : (
                        <AppText style={styles.pingButtonText}>Ping /health</AppText>
                    )}
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const PropertyField = ({ label, value }: { label: string; value?: string }) => {
    return (
        <View style={styles.propertyFieldContainer}>
            <AppText size="label">{label}</AppText>
            <AppText style={{ color: "gray" }}>{value}</AppText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 8,
    },
    propertyFieldContainer: {
        backgroundColor: "#fff",
        paddingVertical: 8,
        gap: 4,
    },
    sectionContainer: {
        // backgroundColor: "#ccc",
        gap: 1,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 12,
    },
    pingButton: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "blue",
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 8,
    },
    pingButtonText: {
        color: "blue",
        textAlign: "center",
        fontSize: 16,
    },
});
