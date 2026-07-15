import api from "@/lib/api";
import type { components } from "@/types/api";

type CreateProductCommand = components["schemas"]["CreateProductCommand"];

export const createProduct = async (command: CreateProductCommand): Promise<void> => {
    await api.post("/api/v1/products", command);
};
