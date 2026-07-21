import api from "@/lib/api";

export const completeOrder = async (orderId: string): Promise<void> => {
    await api.post(`/api/v1/orders/${orderId}/complete`);
};
