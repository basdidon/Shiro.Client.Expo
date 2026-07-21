import api from "@/lib/api";
import type { components } from "@/types/api";

type UpdateOrderLineCommand = components["schemas"]["UpdateOrderLineCommand"];

export const updateOrderLine = async (command: UpdateOrderLineCommand): Promise<void> => {
    await api.put(`/api/v1/orders/${command.orderId}/lines/${command.orderLineId}`, command);
};
