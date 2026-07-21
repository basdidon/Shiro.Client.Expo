import api from "@/lib/api";
import type { components } from "@/types/api";

type CursorResultOfOrderDto = components["schemas"]["CursorResultOfOrderDto"];
type OrderStatus = components["schemas"]["OrderStatus"];

export const getOrders = async (
    limit: number,
    cursor?: string,
    status?: OrderStatus,
): Promise<CursorResultOfOrderDto> => {
    const { data } = await api.get<CursorResultOfOrderDto>("/api/v1/orders", {
        params: { limit, cursor, status },
    });
    return data;
};
