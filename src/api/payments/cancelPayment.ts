import api from "@/lib/api";
import type { components } from "@/types/api";

type CancelPaymentCommand = components["schemas"]["CancelPaymentCommand"];

export const cancelPayment = async (paymentId: string): Promise<void> => {
    await api.post(`/api/v1/payments/${paymentId}/cancel`, {
        paymentId,
    } satisfies CancelPaymentCommand);
};
