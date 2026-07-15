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
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "รหัสผ่านไม่ตรงกัน",
        path: ["confirmPassword"],
    });

export type RegisterFormValues = z.infer<typeof registerSchema>;
