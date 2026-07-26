import api from "@/lib/api";
import type { components } from "@/types/api";

type UserAddressDto = components["schemas"]["UserAddressDto"];

export const getAddresses = async (): Promise<UserAddressDto[]> => {
    const { data } = await api.get<UserAddressDto[]>("/api/v1/users/me/addresses");
    return data;
};
