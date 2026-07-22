import { getBestSellers } from "@/api/dashboard/getBestSellers";
import { useQuery } from "@tanstack/react-query";

export const useBestSellers = (limit: number, dateFrom?: string, dateTo?: string) => {
    return useQuery({
        queryKey: ["dashboard", "best-sellers", { limit, dateFrom, dateTo }],
        queryFn: () => getBestSellers(limit, dateFrom, dateTo),
    });
};
