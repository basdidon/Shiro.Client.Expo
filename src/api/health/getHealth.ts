import api from "@/lib/api";

export const getHealth = async (): Promise<string> => {
    const { data } = await api.get<string>("/health");
    return data;
};
