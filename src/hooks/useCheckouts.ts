import { createCheckout } from "@/api/checkouts/createCheckout";
import { useMutation } from "@tanstack/react-query";

export const useCreateCheckout = () => {
    return useMutation({
        mutationFn: createCheckout,
    });
};
