import api from "@/lib/api";
import type { components } from "@/types/api";

type CreateOrderCommand = components["schemas"]["CreateOrderCommand"];
type OrderDto = components["schemas"]["OrderDto"];

export const createOrder = async (command: CreateOrderCommand): Promise<OrderDto> => {
    const { data } = await api.post<OrderDto>("/api/v1/orders", command);
    return data;
};
