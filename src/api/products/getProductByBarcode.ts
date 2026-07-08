import api from "@/api/_config";
import { Product } from "@/types/Product";

export const getProductByBarcode = async (barcode: string): Promise<Product> => {
    return await api.get(`/products/barcode/${barcode}`).then((response) => response.data);
};
