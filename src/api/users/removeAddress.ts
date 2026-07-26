import api from "@/lib/api";

export const removeAddress = async (userAddressId: string): Promise<void> => {
    await api.delete(`/api/v1/users/me/addresses/${userAddressId}`);
};
