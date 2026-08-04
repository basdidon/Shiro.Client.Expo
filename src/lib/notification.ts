import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Ref: https://docs.expo.dev/push-notifications/push-notifications-setup/
// Registers the device for push notifications and returns an Expo push token
// (a string used by your backend/Expo push service to target this device).
export async function registerForPushNotificationsAsync() {
    // Android requires a "notification channel" to be created before any
    // notification can be shown. This defines how the "default" channel
    // behaves (importance/priority, vibration, LED color).
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            // MAX importance = heads-up/banner notifications with sound.
            importance: Notifications.AndroidImportance.MAX,
            // Vibration pattern in ms: [wait, vibrate, wait, vibrate, ...].
            vibrationPattern: [0, 250, 250, 250],
            // Color of the notification LED light (if the device has one).
            lightColor: "#FF231F7C",
        });
    }

    // Check whether the user already granted notification permission.
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Only prompt the user if we don't already have a decision, so we don't
    // spam them with a permission dialog on every app launch.
    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    // Bail out (and surface an error) if the user denied permission — there's
    // no point requesting a push token without it.
    if (finalStatus !== "granted") {
        handleRegistrationError("Permission not granted to get push token for push notification!");
        return;
    }

    // The Expo push token is scoped to a specific EAS project, so we need the
    // project ID from app config (set via `eas init`/`eas build:configure`).
    const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
        handleRegistrationError("Project ID not found");
    }

    try {
        // Ask Expo's push service for a token identifying this device+app+project.
        // Send this token to your backend so it can push notifications to this device.
        const pushTokenString = (
            await Notifications.getExpoPushTokenAsync({
                projectId,
            })
        ).data;
        console.log(pushTokenString);
        // TODO: backend ต้องทำ endpoint POST /user/push-token เพื่อรับ token นี้ไปเก็บ
        // แล้วใช้ยิง notification กลับมาหา user ทีหลัง (ตอนนี้ยังไม่ได้ส่งไป backend)
        return pushTokenString;
    } catch (e: unknown) {
        handleRegistrationError(`${e}`);
    }
}

// Simple helper to surface registration failures to the user (via a native
// alert) and also throw, so callers can catch/handle the error if needed.
function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
}
