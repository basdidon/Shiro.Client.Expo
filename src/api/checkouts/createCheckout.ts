import api from "@/lib/api";
import type { components } from "@/types/api";

type CreateCheckoutCommand = components["schemas"]["CreateCheckoutCommand"];
type CheckoutDto = components["schemas"]["CheckoutDto"];

export const createCheckout = async (command: CreateCheckoutCommand): Promise<CheckoutDto> => {
    const { data } = await api.post<CheckoutDto>("/api/v1/checkouts", command);
    return data;
};
