import { registerPushToken } from "@/api/notifications/registerPushToken";
import { retryOnNetworkError } from "@/lib/retryOnNetworkError";
import { useMutation } from "@tanstack/react-query";

// The endpoint upserts by token, so a dropped-connection retry is safe - it
// can't create a duplicate registration.
export const useRegisterPushToken = () => {
    return useMutation({
        mutationFn: (command: Parameters<typeof registerPushToken>[0]) =>
            retryOnNetworkError(() => registerPushToken(command)),
    });
};
