import api from "@/lib/api";
import type { components } from "@/types/api";

type AddAddressToUserCommand = components["schemas"]["AddAddressToUserCommand"];

export const addAddress = async (
    command: AddAddressToUserCommand,
    idempotencyKey: string,
): Promise<void> => {
    await api.post("/api/v1/users/me/addresses", command, {
        headers: { "Idempotency-Key": idempotencyKey },
    });
};
