import { create } from "zustand";

import api from "@/lib/api";
import { getRolesFromToken, getUserIdFromToken, getUsernameFromToken, type Role } from "@/lib/jwt";
import { tokenStorage } from "@/lib/tokenStorage";
import type { components } from "@/types/api";

type LoginCommand = components["schemas"]["LoginCommand"];
type LoginResponse = components["schemas"]["LoginResponse"];
type RegisterCommand = components["schemas"]["RegisterCommand"];
type RegisterResponse = components["schemas"]["RegisterResponse"];
type VerifyEmailOtpCommand = components["schemas"]["VerifyEmailOtpCommand"];
type ResendEmailConfirmationOtpCommand = components["schemas"]["ResendEmailConfirmationOtpCommand"];
type TokenResponse = components["schemas"]["TokenResponse"];

export type LoginResult = "authenticated" | "verification-required";

type PendingVerification = {
    verificationToken: string;
    maskedEmail: string | null;
};

type AuthState = {
    accessToken: string | null;
    isLoading: boolean; // true ระหว่างเช็ค token ตอนเปิดแอพ
    isAuthenticated: boolean;
    roles: Role[];
    username: string | null;
    userId: string | null;
    // set after register, or after a login attempt whose email isn't confirmed yet - the OTP
    // screen reads this instead of the caller passing the verification token around by hand
    pendingVerification: PendingVerification | null;

    // actions
    init: () => Promise<void>;
    login: (username: string, password: string) => Promise<LoginResult>;
    register: (values: RegisterCommand) => Promise<void>;
    verifyEmailOtp: (code: string) => Promise<void>;
    resendConfirmationOtp: () => Promise<void>;
    logout: () => Promise<void>;
    setSession: (tokens: TokenResponse) => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    isLoading: true,
    isAuthenticated: false,
    roles: [],
    username: null,
    userId: null,
    pendingVerification: null,

    init: async () => {
        try {
            // Sequential, not Promise.all: expo-secure-store's Android Keystore-backed reads
            // aren't guaranteed safe to run concurrently, and this only runs once at boot.
            const accessToken = await tokenStorage.getAccessToken();
            const verificationToken = await tokenStorage.getVerificationToken();
            set({
                accessToken,
                isAuthenticated: !!accessToken,
                roles: accessToken ? getRolesFromToken(accessToken) : [],
                username: accessToken ? getUsernameFromToken(accessToken) : null,
                userId: accessToken ? getUserIdFromToken(accessToken) : null,
                // rehydrates a register/login flow that was left mid-OTP when the app closed
                pendingVerification: verificationToken
                    ? { verificationToken, maskedEmail: null }
                    : null,
                isLoading: false,
            });
        } catch (err) {
            console.error("auth init error:", err);
            set({ isLoading: false });
        }
    },

    login: async (username: string, password: string) => {
        const { data } = await api.post<LoginResponse>("/api/auth/login", {
            username,
            password,
        } satisfies LoginCommand);

        if (data.status === "Authenticated") {
            await get().setSession({
                accessToken: data.accessToken ?? undefined,
                refreshToken: data.refreshToken ?? undefined,
            });
            return "authenticated";
        }

        // email not confirmed - stash the fresh verification ticket the login response carries,
        // then get a code sent (or rely on one already sent) before handing off to the OTP screen
        if (!data.verificationTicket) {
            throw new Error("Login requires verification but no verification ticket was returned");
        }

        await tokenStorage.setVerificationToken(data.verificationTicket);
        set({
            pendingVerification: {
                verificationToken: data.verificationTicket,
                maskedEmail: data.maskedEmail ?? null,
            },
        });

        try {
            await get().resendConfirmationOtp();
        } catch {
            // most likely the 60s resend cooldown because a code was already sent moments ago
            // (e.g. right after registering) - that code is still valid, so proceed anyway
        }

        return "verification-required";
    },

    register: async (values: RegisterCommand) => {
        const { data } = await api.post<RegisterResponse>("/api/auth/register", values);

        await tokenStorage.setVerificationToken(data.verificationToken);
        set({
            pendingVerification: {
                verificationToken: data.verificationToken,
                maskedEmail: data.maskedEmail,
            },
        });
    },

    verifyEmailOtp: async (code: string) => {
        const verificationToken = get().pendingVerification?.verificationToken;
        if (!verificationToken) {
            throw new Error("No pending email verification");
        }

        const { data } = await api.post<TokenResponse>("/api/auth/confirm-email", {
            verificationToken,
            code,
        } satisfies VerifyEmailOtpCommand);

        await get().setSession(data);
        await tokenStorage.clearVerificationToken();
        set({ pendingVerification: null });
    },

    resendConfirmationOtp: async () => {
        const verificationToken = get().pendingVerification?.verificationToken;
        if (!verificationToken) {
            throw new Error("No pending email verification");
        }

        await api.post("/api/auth/resend-confirmation-email", {
            verificationToken,
        } satisfies ResendEmailConfirmationOtpCommand);
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
            userId: accessToken ? getUserIdFromToken(accessToken) : null,
        });
    },

    logout: async () => {
        await tokenStorage.clear();
        await tokenStorage.clearVerificationToken();
        set({
            accessToken: null,
            isAuthenticated: false,
            roles: [],
            username: null,
            userId: null,
            pendingVerification: null,
        });
    },
}));
