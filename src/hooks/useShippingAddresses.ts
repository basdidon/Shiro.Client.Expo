import { addShippingAddress } from "@/api/users/addShippingAddress";
import { getShippingAddresses } from "@/api/users/getShippingAddresses";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useShippingAddresses = () => {
    return useQuery({
        queryKey: ["shipping-addresses"],
        queryFn: getShippingAddresses,
    });
};

export const useAddShippingAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addShippingAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shipping-addresses"] });
        },
    });
};
