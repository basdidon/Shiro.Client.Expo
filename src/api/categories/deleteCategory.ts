import api from "@/lib/api";

export const deleteCategory = async (categoryId: number | string): Promise<void> => {
    await api.delete(`/api/v1/categories/${categoryId}`);
};
