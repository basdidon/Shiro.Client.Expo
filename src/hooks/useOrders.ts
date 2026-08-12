import { addOrderLine } from "@/api/orders/addOrderLine";
import { cancelOrder } from "@/api/orders/cancelOrder";
import { completeOrder } from "@/api/orders/completeOrder";
import { createOrder } from "@/api/orders/createOrder";
import { getOrderById } from "@/api/orders/getOrderById";
import { getOrders } from "@/api/orders/getOrders";
import { removeOrderLine } from "@/api/orders/removeOrderLine";
import { shipOrder } from "@/api/orders/shipOrder";
import { updateOrderLine } from "@/api/orders/updateOrderLine";
import { retryOnNetworkError } from "@/lib/retryOnNetworkError";
import type { components } from "@/types/api";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Crypto from "expo-crypto";

type OrderStatus = components["schemas"]["OrderStatus"];

export const useOrders = (limit: number, orderById?: string, status?: OrderStatus) => {
    return useInfiniteQuery({
        queryKey: ["orders", { limit, status }],
        queryFn: ({ pageParam }) => getOrders(limit, pageParam, orderById, status),
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
        mutationFn: (command: Parameters<typeof createOrder>[0]) => {
            // Not wrapped in retryOnNetworkError: the API doesn't dedupe by
            // Idempotency-Key yet, so a blind retry here could create a duplicate
            // order if the original request actually succeeded server-side.
            const idempotencyKey = Crypto.randomUUID();
            return createOrder(command, idempotencyKey);
        },
        onSuccess: (order) => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.setQueryData(["orders", order.orderId], order);
        },
    });
};

export const useAddOrderLine = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (command: Parameters<typeof addOrderLine>[0]) => {
            // Not wrapped in retryOnNetworkError: the API doesn't dedupe by
            // Idempotency-Key yet, so a blind retry here could add a duplicate
            // order line if the original request actually succeeded server-side.
            const idempotencyKey = Crypto.randomUUID();
            return addOrderLine(command, idempotencyKey);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["orders", variables.orderId] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });
};

export const useUpdateOrderLine = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (command: Parameters<typeof updateOrderLine>[0]) =>
            retryOnNetworkError(() => updateOrderLine(command)),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["orders", variables.orderId] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });
};

export const useRemoveOrderLine = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: Parameters<typeof removeOrderLine>[0]) =>
            retryOnNetworkError(() => removeOrderLine(params)),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["orders", variables.orderId] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });
};

export const useShipOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: shipOrder,
        onSuccess: (_, orderId) => {
            queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
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
            queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
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
