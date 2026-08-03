import api from "@/lib/api";
import type { components } from "@/types/api";

type AddLineToOrderCommand = components["schemas"]["AddLineToOrderCommand"];
type OrderLineDto = components["schemas"]["OrderLineDto"];

export const addOrderLine = async (
    command: AddLineToOrderCommand,
    idempotencyKey: string,
): Promise<OrderLineDto> => {
    const { data } = await api.post<OrderLineDto>(
        `/api/v1/orders/${command.orderId}/lines`,
        command,
        { headers: { "Idempotency-Key": idempotencyKey } },
    );
    return data;
};
