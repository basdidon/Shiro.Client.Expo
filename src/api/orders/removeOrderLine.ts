import api from "@/lib/api";

export const removeOrderLine = async (params: {
    orderId: string;
    orderLineId: string;
}): Promise<void> => {
    await api.delete(`/api/v1/orders/${params.orderId}/lines/${params.orderLineId}`);
};
