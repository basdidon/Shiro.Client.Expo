import api from "@/lib/api";
import type { components } from "@/types/api";

type OrderDto = components["schemas"]["OrderDto"];

export const getOrderById = async (orderId: string): Promise<OrderDto> => {
    const { data } = await api.get<OrderDto>(`/api/v1/orders/${orderId}`);
    return data;
};
