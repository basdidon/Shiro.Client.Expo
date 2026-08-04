import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
// Holds the opaque token from RegisterResponse/LoginResponse (VerificationTicket) while the
// user is mid email-confirmation, so it survives the register -> OTP screen navigation and app
// reloads without having to thread it through route params.
const VERIFICATION_TOKEN_KEY = "auth_verification_token";

// expo-secure-store is not supported on web (Android/iOS/tvOS only), so we fall back to
// AsyncStorage there. Note this means tokens are unencrypted on web, same as localStorage.
const storage = {
    getItem: (key: string) => (Platform.OS === "web" ? AsyncStorage.getItem(key) : SecureStore.getItemAsync(key)),
    setItem: (key: string, value: string) =>
        Platform.OS === "web" ? AsyncStorage.setItem(key, value) : SecureStore.setItemAsync(key, value),
    removeItem: (key: string) => (Platform.OS === "web" ? AsyncStorage.removeItem(key) : SecureStore.deleteItemAsync(key)),
};

export const tokenStorage = {
    getAccessToken: () => storage.getItem(ACCESS_TOKEN_KEY),
    getRefreshToken: () => storage.getItem(REFRESH_TOKEN_KEY),
    setAccessToken: (token: string) => storage.setItem(ACCESS_TOKEN_KEY, token),
    setRefreshToken: (token: string) => storage.setItem(REFRESH_TOKEN_KEY, token),
    clear: async () => {    
        await storage.removeItem(ACCESS_TOKEN_KEY);
        await storage.removeItem(REFRESH_TOKEN_KEY);
    },

    getVerificationToken: () => storage.getItem(VERIFICATION_TOKEN_KEY),
    setVerificationToken: (token: string) => storage.setItem(VERIFICATION_TOKEN_KEY, token),
    clearVerificationToken: () => storage.removeItem(VERIFICATION_TOKEN_KEY),
};
