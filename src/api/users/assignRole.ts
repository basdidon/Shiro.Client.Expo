import api from "@/lib/api";

export const assignRole = async (params: { userId: string; role: string }): Promise<void> => {
    await api.put(`/api/v1/users/${params.userId}/roles/${params.role}`);
};
