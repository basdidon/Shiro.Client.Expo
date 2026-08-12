import { assignRole } from "@/api/users/assignRole";
import { getAssignableRoles } from "@/api/users/getAssignableRoles";
import { getUserById } from "@/api/users/getUserById";
import { getUsers } from "@/api/users/getUsers";
import { removeRole } from "@/api/users/removeRole";
import { retryOnNetworkError } from "@/lib/retryOnNetworkError";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUsers = (limit: number) => {
    return useInfiniteQuery({
        queryKey: ["users", { limit }],
        queryFn: ({ pageParam }) => getUsers(limit, pageParam),
        initialPageParam: "",
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        retry: false,
    });
};

export const useUser = (userId?: string) => {
    return useQuery({
        queryKey: ["users", userId],
        queryFn: () => getUserById(userId!),
        enabled: !!userId,
    });
};

export const useAssignableRoles = () => {
    return useQuery({
        queryKey: ["users", "assignable-roles"],
        queryFn: getAssignableRoles,
    });
};

export const useAssignRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: Parameters<typeof assignRole>[0]) =>
            retryOnNetworkError(() => assignRole(params)),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["users", variables.userId] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
};

export const useRemoveRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: Parameters<typeof removeRole>[0]) =>
            retryOnNetworkError(() => removeRole(params)),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["users", variables.userId] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
};
