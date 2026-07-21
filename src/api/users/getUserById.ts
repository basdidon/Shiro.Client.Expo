import api from "@/lib/api";
import type { components } from "@/types/api";

type UserDto = components["schemas"]["UserDto"];

export const getUserById = async (userId: string): Promise<UserDto> => {
    const { data } = await api.get<UserDto>(`/api/v1/users/${userId}`);
    return data;
};
