import api from "@/lib/api";

export const cancelOrder = async (orderId: string): Promise<void> => {
    await api.post(`/api/v1/orders/${orderId}/cancel`);
};
