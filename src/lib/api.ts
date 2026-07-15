import axios from "axios";
import Constants from "expo-constants";

import { tokenStorage } from "@/lib/tokenStorage";
import type { components } from "@/types/api";

type TokenResponse = components["schemas"]["TokenResponse"];

// In dev, the Metro/Expo dev client already knows the laptop's current LAN IP
// (that's how the phone reaches the bundler), so reuse it for the API host
// instead of the IP hardcoded in EXPO_PUBLIC_API_URL, which goes stale whenever
// the laptop reconnects to WiFi and gets a new address.
const getApiBaseUrl = (): string | undefined => {
    const devHost = __DEV__ ? Constants.expoConfig?.hostUri?.split(":")[0] : undefined;
    if (devHost) {
        return `http://${devHost}:${process.env.EXPO_PUBLIC_API_PORT ?? "5000"}`;
    }
    return process.env.EXPO_PUBLIC_API_URL;
};

const baseURL = getApiBaseUrl();

const api = axios.create({
    baseURL,
});

api.interceptors.request.use(async (config) => {
    const accessToken = await tokenStorage.getAccessToken();
    if (accessToken) {
        config.headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return config;
});

// dedupe concurrent 401s into a single /refresh call
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) return null;

    const { data } = await axios.post<TokenResponse>(`${baseURL}/refresh`, { refreshToken });

    if (!data.accessToken) return null;
    await tokenStorage.setAccessToken(data.accessToken);
    if (data.refreshToken?.token) {
        await tokenStorage.setRefreshToken(data.refreshToken.token);
    }
    return data.accessToken;
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const isAuthEndpoint =
            originalRequest?.url === "/login" || originalRequest?.url === "/refresh";

        if (error.response?.status !== 401 || isAuthEndpoint || originalRequest._retry) {
            return Promise.reject(error);
        }
        originalRequest._retry = true;

        try {
            refreshPromise ??= refreshAccessToken().finally(() => {
                refreshPromise = null;
            });
            const accessToken = await refreshPromise;
            if (!accessToken) throw error;

            originalRequest.headers.set("Authorization", `Bearer ${accessToken}`);
            return api(originalRequest);
        } catch {
            await tokenStorage.clear();
            // lazy require: useAuthStore imports this file, so a static import would be circular
            const { useAuthStore } = require("@/store/useAuthStore") as typeof import("@/store/useAuthStore");
            useAuthStore.setState({ accessToken: null, isAuthenticated: false });
            return Promise.reject(error);
        }
    },
);

export default api;
