import api from "@/lib/api";
import type { components } from "@/types/api";

type CreatePaymentCommand = components["schemas"]["CreatePaymentCommand"];

export const createPayment = async (command: CreatePaymentCommand): Promise<void> => {
    await api.post("/api/v1/payments", command);
};
