import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/components/ui/AppText";
import FormTextInput from "@/components/ui/FormTextInput";
import { registerSchema, type RegisterFormValues } from "@/lib/validation/authSchemas";
import { useAuthStore } from "@/store/useAuthStore";

export default function RegisterScreen() {
    const register = useAuthStore((state) => state.register);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { control, handleSubmit } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { username: "", password: "", confirmPassword: "" },
    });

    const onSubmit = async ({ username, password }: RegisterFormValues) => {
        setError(null);
        setIsSubmitting(true);
        try {
            await register(username, password);
        } catch {
            setError("สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.form}>
                <AppText size="heading" style={styles.title}>
                    สมัครสมาชิก
                </AppText>

                <FormTextInput
                    control={control}
                    name="username"
                    placeholder="ชื่อผู้ใช้"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <FormTextInput
                    control={control}
                    name="password"
                    placeholder="รหัสผ่าน"
                    secureTextEntry
                />
                <FormTextInput
                    control={control}
                    name="confirmPassword"
                    placeholder="ยืนยันรหัสผ่าน"
                    secureTextEntry
                />

                {error ? <AppText style={styles.error}>{error}</AppText> : null}

                <Button
                    title={isSubmitting ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                />

                <Link href="/login" style={styles.link}>
                    <AppText size="medium" style={styles.linkText}>
                        มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
                    </AppText>
                </Link>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center" },
    form: { gap: 12, paddingHorizontal: 24 },
    title: { textAlign: "center", marginBottom: 12 },
    error: { color: "red" },
    link: { alignSelf: "center", marginTop: 8 },
    linkText: { color: "#007aff" },
});
