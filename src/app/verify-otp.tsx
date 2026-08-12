import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Pressable, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/components/ui/AppText";
import FormTextInput from "@/components/ui/FormTextInput";
import { otpSchema, type OtpFormValues } from "@/lib/validation/authSchemas";
import { useAuthStore } from "@/store/useAuthStore";

// Both entry points into this screen (register, and an unconfirmed login) already trigger a
// send before the user lands here, so start the "resend" button on cooldown rather than letting
// them immediately fire a resend that the backend's own cooldown would just reject anyway.
const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyOtpScreen() {
    const router = useRouter();
    const pendingVerification = useAuthStore((state) => state.pendingVerification);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const verifyEmailOtp = useAuthStore((state) => state.verifyEmailOtp);
    const resendConfirmationOtp = useAuthStore((state) => state.resendConfirmationOtp);
    const logout = useAuthStore((state) => state.logout);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resendMessage, setResendMessage] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

    const { control, handleSubmit } = useForm<OtpFormValues>({
        resolver: zodResolver(otpSchema),
        defaultValues: { code: "" },
    });

    // No verification in flight and not authenticated either - e.g. a direct deep link with no
    // context. Send back to login instead of showing a dead-end form.
    useEffect(() => {
        if (!pendingVerification && !isAuthenticated) {
            router.replace("/login");
        }
    }, [pendingVerification, isAuthenticated, router]);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => setCooldown((seconds) => Math.max(0, seconds - 1)), 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    if (!pendingVerification) {
        return null;
    }

    const onSubmit = async ({ code }: OtpFormValues) => {
        setError(null);
        setIsSubmitting(true);
        try {
            await verifyEmailOtp(code);
        } catch (err) {
            if (axios.isAxiosError(err) && !err.response) {
                setError("ขาดการเชื่อมต่อ กรุณาตรวจสอบอินเทอร์เน็ตของคุณ");
            } else {
                setError("รหัส OTP ไม่ถูกต้องหรือหมดอายุ กรุณาลองใหม่อีกครั้ง");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const onResend = async () => {
        setError(null);
        setResendMessage(null);
        setIsResending(true);
        try {
            await resendConfirmationOtp();
            setResendMessage("ส่งรหัสยืนยันใหม่แล้ว กรุณาตรวจสอบอีเมลของคุณ");
        } catch {
            setResendMessage("กรุณารอสักครู่ก่อนขอรหัสใหม่อีกครั้ง");
        } finally {
            setCooldown(RESEND_COOLDOWN_SECONDS);
            setIsResending(false);
        }
    };

    const onBackToLogin = async () => {
        await logout();
        router.replace("/login");
    };

    const resendDisabled = isResending || cooldown > 0;

    return (
        <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.form}
                keyboardShouldPersistTaps="handled"
                bottomOffset={62}
            >
                <AppText size="heading" style={styles.title}>
                    ยืนยันอีเมล
                </AppText>
                <AppText style={styles.subtitle}>
                    {pendingVerification.maskedEmail
                        ? `กรุณากรอกรหัส 6 หลักที่ส่งไปยัง ${pendingVerification.maskedEmail}`
                        : "กรุณากรอกรหัสยืนยัน 6 หลักที่ส่งไปยังอีเมลของคุณ"}
                </AppText>

                <FormTextInput
                    control={control}
                    name="code"
                    placeholder="รหัส 6 หลัก"
                    keyboardType="number-pad"
                    maxLength={6}
                    autoFocus
                />

                {error ? <AppText style={styles.error}>{error}</AppText> : null}
                {resendMessage ? <AppText style={styles.info}>{resendMessage}</AppText> : null}

                <Button
                    title={isSubmitting ? "กำลังยืนยัน..." : "ยืนยัน"}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                />

                <Pressable onPress={onResend} disabled={resendDisabled} style={styles.link}>
                    <AppText
                        size="medium"
                        style={[styles.linkText, resendDisabled && styles.linkTextDisabled]}
                    >
                        {cooldown > 0 ? `ส่งรหัสอีกครั้งใน ${cooldown} วินาที` : "ส่งรหัสอีกครั้ง"}
                    </AppText>
                </Pressable>

                <Pressable onPress={onBackToLogin} style={styles.link}>
                    <AppText size="medium" style={styles.linkText}>
                        ย้อนกลับไปเข้าสู่ระบบ
                    </AppText>
                </Pressable>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    form: {
        flexGrow: 1,
        backgroundColor: "white",
        gap: 12,
        paddingTop: 48,
        paddingHorizontal: 24,
    },
    title: { textAlign: "center", marginBottom: 4 },
    subtitle: { textAlign: "center", marginBottom: 12, color: "#555" },
    error: { color: "red" },
    info: { color: "#007aff" },
    link: { alignSelf: "center", marginTop: 8 },
    linkText: { color: "#007aff" },
    linkTextDisabled: { color: "#999" },
});
