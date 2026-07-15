import { z } from "zod";

const unitPriceField = z
    .string()
    .min(1, "กรุณากรอกราคา")
    .refine((value) => !Number.isNaN(Number(value)), "กรุณากรอกราคาให้ถูกต้อง")
    .refine((value) => Number(value) >= 0, "ราคาต้องไม่ติดลบ")
    .transform((value) => Number(value));

export const createProductSchema = z.object({
    name: z.string().min(1, "กรุณากรอกชื่อสินค้า"),
    unitPrice: unitPriceField,
    barcode: z.string().optional(),
    categoryId: z.number().nullable(),
});

// unitPrice is typed as text while the user edits it, then coerced to a number
// on submit, so the form needs the pre-transform (input) and post-transform
// (output) shapes separately.
export type CreateProductFormInput = z.input<typeof createProductSchema>;
export type CreateProductFormOutput = z.output<typeof createProductSchema>;

export const updateProductSchema = z.object({
    name: z.string().min(1, "กรุณากรอกชื่อสินค้า"),
    unitPrice: unitPriceField,
    categoryId: z.number().nullable(),
});

export type UpdateProductFormInput = z.input<typeof updateProductSchema>;
export type UpdateProductFormOutput = z.output<typeof updateProductSchema>;
