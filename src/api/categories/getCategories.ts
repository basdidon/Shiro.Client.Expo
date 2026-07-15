import api from "@/lib/api";
import type { components } from "@/types/api";

type CategoryDto = components["schemas"]["CategoryDto"];

export const getCategories = async (): Promise<CategoryDto[]> => {
    const { data } = await api.get<CategoryDto[]>("/categories");
    return data;
};
