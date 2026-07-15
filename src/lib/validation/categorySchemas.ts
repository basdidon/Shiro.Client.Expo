import { z } from "zod";

import { CATEGORY_ICON_NAMES } from "@/lib/categoryIcons";

// create and update use the same fields (categoryId for update is passed
// separately at submit time, like productId is for products)
export const categoryFormSchema = z.object({
    name: z.string().min(1, "กรุณากรอกชื่อหมวดหมู่"),
    iconName: z.enum(CATEGORY_ICON_NAMES, { message: "กรุณาเลือกไอคอน" }),
    parentCategoryId: z
        .string()
        .optional()
        .refine((value) => !value || !Number.isNaN(Number(value)), "รหัสหมวดหมู่หลักไม่ถูกต้อง")
        .transform((value) => (value ? Number(value) : null)),
});

// parentCategoryId is typed as text while the user edits it, then coerced to a
// number (or null) on submit, so the form needs the pre-transform (input) and
// post-transform (output) shapes separately.
export type CategoryFormInput = z.input<typeof categoryFormSchema>;
export type CategoryFormOutput = z.output<typeof categoryFormSchema>;
