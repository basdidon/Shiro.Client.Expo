import { addAddress } from "@/api/users/addAddress";
import { getAddresses } from "@/api/users/getAddresses";
import { removeAddress } from "@/api/users/removeAddress";
import { updateAddress } from "@/api/users/updateAddress";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAddresses = () => {
    return useQuery({
        queryKey: ["addresses"],
        queryFn: getAddresses,
    });
};

export const useAddAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
        },
    });
};

export const useUpdateAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
        },
    });
};

export const useRemoveAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
        },
    });
};
