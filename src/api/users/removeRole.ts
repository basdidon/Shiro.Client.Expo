import api from "@/lib/api";

export const removeRole = async (params: { userId: string; role: string }): Promise<void> => {
    await api.delete(`/api/v1/users/${params.userId}/roles/${params.role}`);
};
