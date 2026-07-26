import api from "@/lib/api";
import type { components } from "@/types/api";

type AddAddressToUserCommand = components["schemas"]["AddAddressToUserCommand"];

export const addAddress = async (command: AddAddressToUserCommand): Promise<void> => {
    await api.post("/api/v1/users/me/addresses", command);
};
