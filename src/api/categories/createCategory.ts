import api from "@/lib/api";
import type { components } from "@/types/api";

type CreateCategoryCommand = components["schemas"]["CreateCategoryCommand"];

export const createCategory = async (
    command: CreateCategoryCommand,
    idempotencyKey: string,
): Promise<void> => {
    await api.post("/api/v1/categories", command, {
        headers: { "Idempotency-Key": idempotencyKey },
    });
};
