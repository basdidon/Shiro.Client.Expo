import { onlineManager } from "@tanstack/react-query";
import * as Network from "expo-network";
import { Platform } from "react-native";

// React Query's default online detection relies on the browser's
// online/offline events, which don't exist in React Native, so paused
// queries/mutations would never know to resume. Wiring this to expo-network
// makes React Query pause requests while offline and auto-refetch/retry once
// connectivity returns.
//
// Skipped during web SSR: expo-network's web implementation touches `window`
// as soon as a listener is added, which throws during Expo Router's static
// server render (no `window` in that Node environment). Client hydration
// re-imports this module with `window` defined, so the listener still gets
// wired up for the browser session.
if (Platform.OS !== "web" || typeof window !== "undefined") {
    onlineManager.setEventListener((setOnline) => {
        const subscription = Network.addNetworkStateListener((state) => {
            setOnline(state.isInternetReachable ?? state.isConnected ?? true);
        });
        return () => subscription.remove();
    });
}
