import api from "@/lib/api";
import type { components } from "@/types/api";

type UpdateAddressToUserCommand = components["schemas"]["UpdateAddressToUserCommand"];

export const updateAddress = async (command: UpdateAddressToUserCommand): Promise<void> => {
    await api.put(`/api/v1/users/me/addresses/${command.userAddressId}`, command);
};
