import AppText from "@/components/ui/AppText";
import { router, useLocalSearchParams } from "expo-router";
import { setParams } from "expo-router/build/global-state/router";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default () => {
    const { param } = useLocalSearchParams<{ param: string }>();
    const onPress = () => {
        router.setParams({ param: "test" });
        router.navigate("/");
        // router.replace({ pathname: "/", params: { param: "test2" } });
    };

    return (
        <SafeAreaView>
            <Pressable onPress={onPress}>
                <AppText>Set param</AppText>
            </Pressable>
            <Pressable onPress={() => setParams({ param: "only" })}>
                <AppText>Set param</AppText>
            </Pressable>
            <AppText>{param}</AppText>
        </SafeAreaView>
    );
};
