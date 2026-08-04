import { cancelPayment } from "@/api/payments/cancelPayment";
import { createPayment } from "@/api/payments/createPayment";
import { getPayments } from "@/api/payments/getPayments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Crypto from "expo-crypto";

export const usePayments = (params: { orderId?: string; userId?: string }, enabled = true) => {
    return useQuery({
        queryKey: ["payments", params],
        queryFn: () => getPayments(params),
        enabled,
    });
};

export const useCreatePayment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (command: Parameters<typeof createPayment>[0]) => {
            // Not wrapped in retryOnNetworkError: the API doesn't dedupe by
            // Idempotency-Key yet, so a blind retry here could create a duplicate
            // payment if the original request actually succeeded server-side.
            const idempotencyKey = Crypto.randomUUID();
            return createPayment(command, idempotencyKey);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            queryClient.invalidateQueries({ queryKey: ["orders", variables.orderId] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });
};

export const useCancelPayment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cancelPayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });
};
