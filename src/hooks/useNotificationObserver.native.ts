import * as Notifications from "expo-notifications";
import { router, type Href } from "expo-router";
import { useEffect, useState } from "react";

// Defines how notifications are handled while the app is in the foreground
// (by default, foreground notifications are silent/hidden unless you set
// this handler). This tells Expo to still play a sound, show a banner,
// update the app badge, and appear in the notification list/tray.
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

function redirect(response: Notifications.NotificationResponse) {
    const { notification } = response;
    const url = notification.request.content.data?.url;
    console.log(url);
    if (typeof url === "string") {
        router.push(url as Href);
    }
}

export function useNotificationObserver() {
    // Holds the most recently received notification while the app is open,
    // e.g. to display an in-app banner. Currently unused elsewhere.
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
        undefined,
    );

    // Covers the case where the app was completely killed and gets launched
    // by the user tapping a notification. addNotificationResponseReceivedListener
    // below only fires for taps that happen while the JS runtime is already
    // alive (foreground/background), so a cold start needs this separately.
    const lastNotificationResponse = Notifications.useLastNotificationResponse();

    useEffect(() => {
        if (lastNotificationResponse) {
            redirect(lastNotificationResponse);
            Notifications.clearLastNotificationResponse();
        }
    }, [lastNotificationResponse]);

    useEffect(() => {
        // Fires whenever a notification arrives while the app is running
        // (foreground or background), regardless of whether the user taps it.
        const notificationListener = Notifications.addNotificationReceivedListener(
            (notification) => {
                console.log("NotificationReceivedListener");

                setNotification(notification);
            },
        );

        // Fires when the user taps/interacts with a notification (e.g. taps
        // it to open the app). Useful for deep-linking to a specific screen
        // based on the notification's data payload.
        const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log("NotificationResponseReceivedListener");
            redirect(response);
        });

        return () => {
            notificationListener.remove();
            subscription.remove();
        };
    }, []);
}
