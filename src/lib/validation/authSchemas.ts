import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().min(1, "กรุณากรอกชื่อผู้ใช้"),
    password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
    .object({
        username: z.string().min(1, "กรุณากรอกชื่อผู้ใช้"),
        password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
        confirmPassword: z.string().min(1, "กรุณายืนยันรหัสผ่าน"),
        firstname: z.string().min(1, "กรุณากรอกชื่อ"),
        lastname: z.string().min(1, "กรุณากรอกนามสกุล"),
        email: z.email("กรุณากรอกอีเมลให้ถูกต้อง"),
        phoneNumber: z.string().min(1, "กรุณากรอกเบอร์โทรศัพท์"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "รหัสผ่านไม่ตรงกัน",
        path: ["confirmPassword"],
    });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const otpSchema = z.object({
    code: z
        .string()
        .length(6, "กรุณากรอกรหัส 6 หลัก")
        .regex(/^\d+$/, "กรุณากรอกตัวเลขเท่านั้น"),
});

export type OtpFormValues = z.infer<typeof otpSchema>;
