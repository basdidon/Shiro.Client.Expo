import api from "@/lib/api";

export const deleteProduct = async (productId: string): Promise<void> => {
    await api.delete(`/api/v1/products/${productId}`);
};
