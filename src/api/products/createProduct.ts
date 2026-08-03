import api from "@/lib/api";
import type { components } from "@/types/api";

type CreateProductCommand = components["schemas"]["CreateProductCommand"];
type ProductDto = components["schemas"]["ProductDto"];

export const createProduct = async (
    command: CreateProductCommand,
    idempotencyKey: string,
): Promise<ProductDto> => {
    const { data } = await api.post<ProductDto>("/api/v1/products", command, {
        headers: { "Idempotency-Key": idempotencyKey },
    });
    return data;
};
