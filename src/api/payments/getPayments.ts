import api from "@/lib/api";
import type { components } from "@/types/api";

type CursorResultOfPaymentDto = components["schemas"]["CursorResultOfPaymentDto"];

export const getPayments = async (params: {
    orderId?: string;
    userId?: string;
}): Promise<CursorResultOfPaymentDto> => {
    const { data } = await api.get<CursorResultOfPaymentDto>("/api/v1/payments", {
        params: { ...params, limit: 100 },
    });
    return data;
};
