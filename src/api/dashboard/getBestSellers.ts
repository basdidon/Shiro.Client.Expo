import api from "@/lib/api";
import type { components } from "@/types/api";

type BestSellerDto = components["schemas"]["BestSellerDto"];

export const getBestSellers = async (
    limit: number,
    dateFrom?: string,
    dateTo?: string,
): Promise<BestSellerDto[]> => {
    const { data } = await api.get<BestSellerDto[]>("/api/v1/dashboard/best-sellers", {
        params: { limit, dateFrom, dateTo },
    });
    return data;
};
