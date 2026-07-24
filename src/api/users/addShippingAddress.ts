import api from "@/lib/api";
import type { components } from "@/types/api";

type AddShippingAddressToUserCommand = components["schemas"]["AddShippingAddressToUserCommand"];

export const addShippingAddress = async (
    command: AddShippingAddressToUserCommand,
): Promise<void> => {
    await api.post("/api/v1/users/me/shipping-addresses", command);
};
