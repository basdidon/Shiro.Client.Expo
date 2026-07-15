import api from "@/lib/api";
import type { components } from "@/types/api";

type UpdateCategoryCommand = components["schemas"]["UpdateCategoryCommand"];

export const updateCategory = async (command: UpdateCategoryCommand): Promise<void> => {
    await api.put(`/categories/categories/${command.categoryId}`, command);
};
