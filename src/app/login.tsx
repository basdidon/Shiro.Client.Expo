import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Link } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/components/ui/AppText";
import FormTextInput from "@/components/ui/FormTextInput";
import { loginSchema, type LoginFormValues } from "@/lib/validation/authSchemas";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginScreen() {
    const login = useAuthStore((state) => state.login);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { control, handleSubmit, setFocus } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { username: "", password: "" },
    });

    const onSubmit = async ({ username, password }: LoginFormValues) => {
        setError(null);
        setIsSubmitting(true);
        try {
            await login(username, password);
        } catch (err) {
            if (axios.isAxiosError(err) && !err.response) {
                setError("ขาดการเชื่อมต่อ กรุณาตรวจสอบอินเทอร์เน็ตของคุณ");
            } else {
                setError("เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบชื่อผู้ใช้และรหัสผ่าน");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.form}>
                <AppText size="heading" style={styles.title}>
                    เข้าสู่ระบบ
                </AppText>

                <FormTextInput
                    control={control}
                    name="username"
                    placeholder="ชื่อผู้ใช้"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    onSubmitEditing={() => setFocus("password")}
                />
                <FormTextInput
                    control={control}
                    name="password"
                    placeholder="รหัสผ่าน"
                    secureTextEntry
                    autoCapitalize="none"
                />

                {error ? <AppText style={styles.error}>{error}</AppText> : null}

                <Button
                    title={isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                />

                <Link href="/register" style={styles.link}>
                    <AppText size="medium" style={styles.linkText}>
                        ยังไม่มีบัญชี? สมัครสมาชิก
                    </AppText>
                </Link>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    form: { gap: 12, paddingHorizontal: 24 },
    title: { textAlign: "center", marginBottom: 12 },
    error: { color: "red" },
    link: { alignSelf: "center", marginTop: 8 },
    linkText: { color: "#007aff" },
});
