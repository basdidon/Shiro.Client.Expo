import api from "@/lib/api";
import type { components } from "@/types/api";

type CreateProductCommand = components["schemas"]["CreateProductCommand"];
type ProductDto = components["schemas"]["ProductDto"];

export const createProduct = async (command: CreateProductCommand): Promise<ProductDto> => {
    const { data } = await api.post<ProductDto>("/api/v1/products", command);
    return data;
};
