import { createCheckout } from "@/api/checkouts/createCheckout";
import { retryOnNetworkError } from "@/lib/retryOnNetworkError";
import { useMutation } from "@tanstack/react-query";
import * as Crypto from "expo-crypto";

export const useCreateCheckout = () => {
    return useMutation({
        mutationFn: (command: Parameters<typeof createCheckout>[0]) => {
            const idempotencyKey = Crypto.randomUUID();
            return retryOnNetworkError(() => createCheckout(command, idempotencyKey));
        },
    });
};
