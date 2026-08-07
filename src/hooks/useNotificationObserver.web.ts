// expo-notifications does not support web (Expo SDK 57 docs), so this is a
// no-op stand-in picked up by Metro's platform resolution instead of
// useNotificationObserver.native.ts.
export function useNotificationObserver() {}
