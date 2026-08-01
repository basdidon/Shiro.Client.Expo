import api from "@/lib/api";
import type { components } from "@/types/api";

type DashboardSummary = components["schemas"]["DashboardSummary"];

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
    const { data } = await api.get<DashboardSummary>("/api/v1/dashboard/summary");
    return data;
};
