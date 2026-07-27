import { createProduct } from "@/api/products/createProduct";
import { getProductByBarcode } from "@/api/products/getProductByBarcode";
import { getProductById } from "@/api/products/getProductById";
import {
    getProductImageDownloadUrl,
    getProductImageUploadUrl,
    updateProductImageKey,
    uploadImageToPresignedUrl,
} from "@/api/products/productImages";
import { updateProduct } from "@/api/products/updateProduct";
import api from "@/lib/api";
import type { components } from "@/types/api";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type CursorResultOfProductDto = components["schemas"]["CursorResultOfProductDto"];
type ProductImageType = components["schemas"]["ProductImageType"];

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

export const useProductImageDownloadUrl = (
    productId: string,
    type: ProductImageType,
    enabled: boolean,
) => {
    return useQuery({
        queryKey: ["products", productId, "images", type],
        queryFn: () => getProductImageDownloadUrl(productId, type),
        enabled,
        select: (data) => data.downloadUrl,
    });
};

export const useUploadProductImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            productId,
            type,
            fileUri,
            filename,
        }: {
            productId: string;
            type: ProductImageType;
            fileUri: string;
            filename: string;
        }): Promise<string> => {
            const { uploadUrl, key, contentType } = await getProductImageUploadUrl(
                productId,
                type,
                filename,
            );
            if (!uploadUrl || !key || !contentType) {
                throw new Error("upload-url response missing uploadUrl, key, or contentType");
            }
            await uploadImageToPresignedUrl(uploadUrl, fileUri, contentType);
            await updateProductImageKey(productId, type, key);
            return key;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["products", variables.productId] });
        },
    });
};
