import api from "@/lib/api";
import type { components } from "@/types/api";

type RegisterNotificationTokenCommand = components["schemas"]["RegisterNotificationTokenCommand"];

export const registerPushToken = async (command: RegisterNotificationTokenCommand): Promise<void> => {
    await api.post("/api/v1/users/me/push-tokens", command);
};
