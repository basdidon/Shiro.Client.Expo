import { createCheckout } from "@/api/checkouts/createCheckout";
import { useMutation } from "@tanstack/react-query";
import * as Crypto from "expo-crypto";

export const useCreateCheckout = () => {
    return useMutation({
        mutationFn: (command: Parameters<typeof createCheckout>[0]) => {
            // Not wrapped in retryOnNetworkError: the API doesn't dedupe by
            // Idempotency-Key yet, so a blind retry here could create a duplicate
            // checkout if the original request actually succeeded server-side.
            const idempotencyKey = Crypto.randomUUID();
            return createCheckout(command, idempotencyKey);
        },
    });
};
