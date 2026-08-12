import api from "@/lib/api";
import type { components } from "@/types/api";

type CreatePaymentCommand = components["schemas"]["CreatePaymentCommand"];

export const createPayment = async (
    command: CreatePaymentCommand,
    idempotencyKey: string,
): Promise<void> => {
    await api.post("/api/v1/payments", command, {
        headers: { "Idempotency-Key": idempotencyKey },
    });
};
