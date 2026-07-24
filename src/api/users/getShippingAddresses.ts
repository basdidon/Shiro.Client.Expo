import api from "@/lib/api";
import type { components } from "@/types/api";

type UserShippingAddressDto = components["schemas"]["UserShippingAddressDto"];

export const getShippingAddresses = async (): Promise<UserShippingAddressDto[]> => {
    const { data } = await api.get<UserShippingAddressDto[]>(
        "/api/v1/users/me/shipping-addresses",
    );
    return data;
};
