import { Product } from "@/types/Product";
import api from "../_config";

export const getProductById = async (productId: string): Promise<Product> => {
    return await api.get(`/products/${productId}`).then((response) => response.data);
};
