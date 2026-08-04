import { addAddress } from "@/api/users/addAddress";
import { getAddresses } from "@/api/users/getAddresses";
import { removeAddress } from "@/api/users/removeAddress";
import { updateAddress } from "@/api/users/updateAddress";
import { retryOnNetworkError } from "@/lib/retryOnNetworkError";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Crypto from "expo-crypto";

export const useAddresses = () => {
    return useQuery({
        queryKey: ["addresses"],
        queryFn: getAddresses,
    });
};

export const useAddAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (command: Parameters<typeof addAddress>[0]) => {
            // Not wrapped in retryOnNetworkError: the API doesn't dedupe by
            // Idempotency-Key yet, so a blind retry here could create a duplicate
            // address if the original request actually succeeded server-side.
            const idempotencyKey = Crypto.randomUUID();
            return addAddress(command, idempotencyKey);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
        },
    });
};

export const useUpdateAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (command: Parameters<typeof updateAddress>[0]) =>
            retryOnNetworkError(() => updateAddress(command)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
        },
    });
};

export const useRemoveAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userAddressId: Parameters<typeof removeAddress>[0]) =>
            retryOnNetworkError(() => removeAddress(userAddressId)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
        },
    });
};
