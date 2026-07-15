import api from "@/lib/api";
import type { components } from "@/types/api";

type ProductDto = components["schemas"]["ProductDto"];

export const getProductById = async (productId: string): Promise<ProductDto> => {
    const { data } = await api.get<ProductDto>(`/api/v1/products/${productId}`);
    return data;
};
