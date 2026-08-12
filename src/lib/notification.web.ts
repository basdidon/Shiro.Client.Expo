// expo-notifications does not support web (Expo SDK 57 docs), so this is a
// no-op stand-in picked up by Metro's platform resolution instead of
// notification.native.ts. Callers already handle an undefined token.
export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
    return undefined;
}
