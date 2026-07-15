import api from "@/lib/api";
import type { components } from "@/types/api";

type CreateCategoryCommand = components["schemas"]["CreateCategoryCommand"];

export const createCategory = async (command: CreateCategoryCommand): Promise<void> => {
    await api.post("/categories", command);
};
