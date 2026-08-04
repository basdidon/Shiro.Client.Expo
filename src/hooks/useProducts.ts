import { createProduct } from "@/api/products/createProduct";
import { deleteProduct } from "@/api/products/deleteProduct";
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
import { retryOnNetworkError } from "@/lib/retryOnNetworkError";
import type { components } from "@/types/api";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Crypto from "expo-crypto";

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
        mutationFn: (command: Parameters<typeof createProduct>[0]) => {
            // Not wrapped in retryOnNetworkError: the API doesn't dedupe by
            // Idempotency-Key yet, so a blind retry here could create a duplicate
            // product if the original request actually succeeded server-side.
            const idempotencyKey = Crypto.randomUUID();
            return createProduct(command, idempotencyKey);
        },
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
        mutationFn: (command: Parameters<typeof updateProduct>[0]) =>
            retryOnNetworkError(() => updateProduct(command)),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["products", variables.productId] });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productId: string) => retryOnNetworkError(() => deleteProduct(productId)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
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
            await retryOnNetworkError(() => updateProductImageKey(productId, type, key));
            return key;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["products", variables.productId] });
        },
    });
};
