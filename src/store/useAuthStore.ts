import { create } from "zustand";

import api from "@/lib/api";
import { getRolesFromToken, getUsernameFromToken, type Role } from "@/lib/jwt";
import { tokenStorage } from "@/lib/tokenStorage";
import type { components } from "@/types/api";

type LoginCommand = components["schemas"]["LoginCommand"];
type RegisterCommand = components["schemas"]["RegisterCommand"];
type TokenResponse = components["schemas"]["TokenResponse"];

type AuthState = {
    accessToken: string | null;
    isLoading: boolean; // true ระหว่างเช็ค token ตอนเปิดแอพ
    isAuthenticated: boolean;
    roles: Role[];
    username: string | null;

    // actions
    init: () => Promise<void>;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    setSession: (tokens: TokenResponse) => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    isLoading: true,
    isAuthenticated: false,
    roles: [],
    username: null,

    init: async () => {
        try {
            const accessToken = await tokenStorage.getAccessToken();
            set({
                accessToken,
                isAuthenticated: !!accessToken,
                roles: accessToken ? getRolesFromToken(accessToken) : [],
                username: accessToken ? getUsernameFromToken(accessToken) : null,
                isLoading: false,
            });
        } catch (err) {
            console.error("auth init error:", err);
            set({ isLoading: false });
        }
    },

    login: async (username: string, password: string) => {
        const { data } = await api.post<TokenResponse>("/login", {
            username,
            password,
        } satisfies LoginCommand);
        await get().setSession(data);
    },

    register: async (username: string, password: string) => {
        await api.post("/register", {
            username,
            password,
        } satisfies RegisterCommand);
        await get().login(username, password);
    },

    setSession: async ({ accessToken, refreshToken }: TokenResponse) => {
        if (accessToken) {
            await tokenStorage.setAccessToken(accessToken);
        }
        if (refreshToken?.token) {
            await tokenStorage.setRefreshToken(refreshToken.token);
        }
        set({
            accessToken: accessToken ?? null,
            isAuthenticated: true,
            roles: accessToken ? getRolesFromToken(accessToken) : [],
            username: accessToken ? getUsernameFromToken(accessToken) : null,
        });
    },

    logout: async () => {
        await tokenStorage.clear();
        set({ accessToken: null, isAuthenticated: false, roles: [], username: null });
    },
}));
