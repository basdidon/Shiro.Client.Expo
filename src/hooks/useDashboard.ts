import { getBestSellers } from "@/api/dashboard/getBestSellers";
import { getDashboardSummary } from "@/api/dashboard/getDashboardSummary";
import { useQuery } from "@tanstack/react-query";

export const useBestSellers = (limit: number, dateFrom?: string, dateTo?: string) => {
    return useQuery({
        queryKey: ["dashboard", "best-sellers", { limit, dateFrom, dateTo }],
        queryFn: () => getBestSellers(limit, dateFrom, dateTo),
    });
};

export const useDashboardSummary = () => {
    return useQuery({
        queryKey: ["dashboard", "summary"],
        queryFn: getDashboardSummary,
    });
};
