import { File } from "expo-file-system";

import api from "@/lib/api";
import type { components } from "@/types/api";

type ProductImageType = components["schemas"]["ProductImageType"];
type ProductImageUploadUrlResponse = components["schemas"]["ProductImageUploadUrlResponse"];
type ProductImageDownloadUrlResponse = components["schemas"]["ProductImageDownloadUrlResponse"];

export const getProductImageUploadUrl = async (
    productId: string,
    type: ProductImageType,
    filename: string,
): Promise<ProductImageUploadUrlResponse> => {
    const { data } = await api.post<ProductImageUploadUrlResponse>(
        "/api/v1/products/upload-url",
        null,
        { params: { productId, type, filename } },
    );
    return data;
};

export const updateProductImageKey = async (
    productId: string,
    type: ProductImageType,
    imageKey: string,
): Promise<void> => {
    await api.put(`/api/v1/products/${productId}/images`, { type, imageKey });
};

export const getProductImageDownloadUrl = async (
    productId: string,
    type: ProductImageType,
): Promise<ProductImageDownloadUrlResponse> => {
    const { data } = await api.get<ProductImageDownloadUrlResponse>(
        `/api/v1/products/${productId}/images/${type}`,
    );
    return data;
};

// Presigned URLs point at storage (e.g. S3), not our API host, so this must
// bypass the `api` instance's baseURL and auth header.
// Uses expo-file-system's native upload (raw binary body) instead of
// fetch(fileUri).blob(), which is unreliable for local file:// URIs in RN.
export const uploadImageToPresignedUrl = async (
    uploadUrl: string,
    fileUri: string,
    contentType: string,
): Promise<void> => {
    const result = await new File(fileUri).upload(uploadUrl, {
        httpMethod: "PUT",
        headers: { "Content-Type": contentType },
    });
    if (result.status < 200 || result.status >= 300) {
        throw new Error(`Image upload failed with status ${result.status}`);
    }
};
