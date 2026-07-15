import api from "@/lib/api";
import type { components } from "@/types/api";

type UpdateProductCommand = components["schemas"]["UpdateProductCommand"];

export const updateProduct = async (command: UpdateProductCommand): Promise<void> => {
    await api.put(`/api/v1/products/${command.productId}`, command);
};
