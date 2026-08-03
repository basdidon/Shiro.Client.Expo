import { createCategory } from "@/api/categories/createCategory";
import { deleteCategory } from "@/api/categories/deleteCategory";
import { getCategories } from "@/api/categories/getCategories";
import { updateCategory } from "@/api/categories/updateCategory";
import { retryOnNetworkError } from "@/lib/retryOnNetworkError";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Crypto from "expo-crypto";

export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (command: Parameters<typeof createCategory>[0]) => {
            const idempotencyKey = Crypto.randomUUID();
            return retryOnNetworkError(() => createCategory(command, idempotencyKey));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (command: Parameters<typeof updateCategory>[0]) =>
            retryOnNetworkError(() => updateCategory(command)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (categoryId: Parameters<typeof deleteCategory>[0]) =>
            retryOnNetworkError(() => deleteCategory(categoryId)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
};
