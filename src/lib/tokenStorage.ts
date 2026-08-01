import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
// Holds the opaque token from RegisterResponse/LoginResponse (VerificationTicket) while the
// user is mid email-confirmation, so it survives the register -> OTP screen navigation and app
// reloads without having to thread it through route params.
const VERIFICATION_TOKEN_KEY = "auth_verification_token";

export const tokenStorage = {
    getAccessToken: () => SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
    getRefreshToken: () => SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
    setAccessToken: (token: string) => SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token),
    setRefreshToken: (token: string) => SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token),
    clear: async () => {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    },

    getVerificationToken: () => SecureStore.getItemAsync(VERIFICATION_TOKEN_KEY),
    setVerificationToken: (token: string) => SecureStore.setItemAsync(VERIFICATION_TOKEN_KEY, token),
    clearVerificationToken: () => SecureStore.deleteItemAsync(VERIFICATION_TOKEN_KEY),
};
