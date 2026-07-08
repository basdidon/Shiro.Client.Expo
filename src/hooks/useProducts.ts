import { getProducts } from "@/api/products/getProducts";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useProducts = (limit: number) => {
    return useInfiniteQuery({
        queryKey: ["products", { limit }],
        queryFn: ({ pageParam }) => getProducts(limit, pageParam),
        initialPageParam: "",
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        retry: false,
    });
};
