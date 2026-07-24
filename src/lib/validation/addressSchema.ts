import { z } from "zod";

export const manualAddressSchema = z.object({
    addressLine1: z.string().min(1, "กรุณากรอกที่อยู่"),
    addressLine2: z.string().optional(),
    province: z.string().min(1, "กรุณาเลือกจังหวัด"),
    district: z.string().min(1, "กรุณาเลือกอำเภอ/เขต"),
    subDistrict: z.string().min(1, "กรุณาเลือกตำบล/แขวง"),
    zipCode: z.string().min(1, "กรุณากรอกรหัสไปรษณีย์"),
});

export type ManualAddressFormValues = z.infer<typeof manualAddressSchema>;

export const addShippingAddressSchema = manualAddressSchema.extend({
    googleMapUrl: z
        .string()
        .min(1, "กรุณาวางลิงก์ Google Maps")
        .url("ลิงก์ Google Maps ไม่ถูกต้อง"),
});

export type AddShippingAddressFormValues = z.infer<typeof addShippingAddressSchema>;
