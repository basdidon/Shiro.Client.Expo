import api from "@/lib/api";
import type { components } from "@/types/api";

type CursorResultOfUserDto = components["schemas"]["CursorResultOfUserDto"];

export const getUsers = async (limit: number, cursor?: string): Promise<CursorResultOfUserDto> => {
    const { data } = await api.get<CursorResultOfUserDto>("/api/v1/users", {
        params: { limit, cursor },
    });
    return data;
};
