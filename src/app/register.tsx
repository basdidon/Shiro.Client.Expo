import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/components/ui/AppText";
import FormTextInput from "@/components/ui/FormTextInput";
import { registerSchema, type RegisterFormValues } from "@/lib/validation/authSchemas";
import { useAuthStore } from "@/store/useAuthStore";

export default function RegisterScreen() {
    const register = useAuthStore((state) => state.register);
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { control, handleSubmit, setFocus } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
            firstname: "",
            lastname: "",
            email: "",
            phoneNumber: "",
        },
    });

    const onSubmit = async ({
        username,
        password,
        firstname,
        lastname,
        email,
        phoneNumber,
    }: RegisterFormValues) => {
        setError(null);
        setIsSubmitting(true);
        try {
            await register({ username, password, firstname, lastname, email, phoneNumber });
            router.replace("/verify-otp");
        } catch {
            setError("สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
            <KeyboardAwareScrollView bottomOffset={62}>
                <View style={styles.form}>
                    <AppText size="heading" style={styles.title}>
                        สมัครสมาชิก
                    </AppText>

                    <FormTextInput
                        control={control}
                        name="firstname"
                        placeholder="ชื่อ"
                        autoCorrect={false}
                        autoFocus
                        returnKeyType="next"
                        submitBehavior="submit"
                        onSubmitEditing={() => setFocus("lastname")}
                    />
                    <FormTextInput
                        control={control}
                        name="lastname"
                        placeholder="นามสกุล"
                        autoCorrect={false}
                        returnKeyType="next"
                        submitBehavior="submit"
                        onSubmitEditing={() => setFocus("username")}
                    />
                    <FormTextInput
                        control={control}
                        name="username"
                        placeholder="ชื่อผู้ใช้"
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="next"
                        submitBehavior="submit"
                        onSubmitEditing={() => setFocus("email")}
                    />
                    <FormTextInput
                        control={control}
                        name="email"
                        placeholder="อีเมล"
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                        returnKeyType="next"
                        submitBehavior="submit"
                        onSubmitEditing={() => setFocus("phoneNumber")}
                    />
                    <FormTextInput
                        control={control}
                        name="phoneNumber"
                        placeholder="เบอร์โทรศัพท์"
                        keyboardType="phone-pad"
                        returnKeyType="next"
                        submitBehavior="submit"
                        onSubmitEditing={() => setFocus("password")}
                    />
                    <FormTextInput
                        control={control}
                        name="password"
                        placeholder="รหัสผ่าน"
                        autoCapitalize="none"
                        secureTextEntry
                        returnKeyType="next"
                        submitBehavior="submit"
                        onSubmitEditing={() => setFocus("confirmPassword")}
                    />
                    <FormTextInput
                        control={control}
                        name="confirmPassword"
                        placeholder="ยืนยันรหัสผ่าน"
                        autoCapitalize="none"
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
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "white" },
    form: { gap: 12, marginTop: 48, paddingHorizontal: 24 },
    title: { textAlign: "center", marginBottom: 12 },
    error: { color: "red" },
    link: { alignSelf: "center", marginTop: 8 },
    linkText: { color: "#007aff" },
});
