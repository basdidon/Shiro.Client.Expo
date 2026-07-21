import { addOrderLine } from "@/api/orders/addOrderLine";
import { cancelOrder } from "@/api/orders/cancelOrder";
import { completeOrder } from "@/api/orders/completeOrder";
import { createOrder } from "@/api/orders/createOrder";
import { getOrderById } from "@/api/orders/getOrderById";
import { getOrders } from "@/api/orders/getOrders";
import { removeOrderLine } from "@/api/orders/removeOrderLine";
import { updateOrderLine } from "@/api/orders/updateOrderLine";
import type { components } from "@/types/api";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type OrderStatus = components["schemas"]["OrderStatus"];

export const useOrders = (limit: number, status?: OrderStatus) => {
    return useInfiniteQuery({
        queryKey: ["orders", { limit, status }],
        queryFn: ({ pageParam }) => getOrders(limit, pageParam, status),
        initialPageParam: "",
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        retry: false,
    });
};

export const useOrder = (orderId?: string) => {
    return useQuery({
        queryKey: ["orders", orderId],
        queryFn: () => getOrderById(orderId!),
        enabled: !!orderId,
    });
};

export const useCreateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createOrder,
        onSuccess: (order) => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.setQueryData(["orders", order.orderId], order);
        },
    });
};

export const useAddOrderLine = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addOrderLine,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["orders", variables.orderId] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });
};

export const useUpdateOrderLine = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateOrderLine,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["orders", variables.orderId] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });
};

export const useRemoveOrderLine = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeOrderLine,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["orders", variables.orderId] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });
};

export const useCompleteOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: completeOrder,
        onSuccess: (_, orderId) => {
            queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });
};

export const useCancelOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cancelOrder,
        onSuccess: (_, orderId) => {
            queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });
};
