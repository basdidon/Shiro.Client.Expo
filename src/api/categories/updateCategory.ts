import api from "@/lib/api";
import type { components } from "@/types/api";

type UpdateCategoryCommand = components["schemas"]["UpdateCategoryCommand"];

export const updateCategory = async (command: UpdateCategoryCommand): Promise<void> => {
    await api.put(`/api/v1/categories/${command.categoryId}`, command);
};
