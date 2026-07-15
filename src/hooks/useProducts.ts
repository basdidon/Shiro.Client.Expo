import { createProduct } from "@/api/products/createProduct";
import { getProductByBarcode } from "@/api/products/getProductByBarcode";
import { getProductById } from "@/api/products/getProductById";
import { updateProduct } from "@/api/products/updateProduct";
import api from "@/lib/api";
import type { components } from "@/types/api";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type CursorResultOfProductDto = components["schemas"]["CursorResultOfProductDto"];

export const getProducts = async (
    limit: number,
    cursor?: string,
    categoryId?: number,
): Promise<CursorResultOfProductDto> => {
    return await api
        .get("/api/v1/products", { params: { limit, cursor, categoryId } })
        .then((response) => response.data);
};

export const useProducts = (limit: number, categoryId?: number) => {
    return useInfiniteQuery({
        queryKey: ["products", { limit, categoryId }],
        queryFn: ({ pageParam }) => getProducts(limit, pageParam, categoryId),
        initialPageParam: "",
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        retry: false,
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
};

export const useProductByBarcode = () => {
    return useMutation({
        mutationFn: getProductByBarcode,
    });
};

export const useProduct = (productId: string) => {
    return useQuery({
        queryKey: ["products", productId],
        queryFn: () => getProductById(productId),
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProduct,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["products", variables.productId] });
        },
    });
};
