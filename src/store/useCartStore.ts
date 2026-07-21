import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CartItem {
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    setItem: (item: CartItem) => void;
    removeItem: (productId: string) => void;
    clear: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            setItem: (item) =>
                set((state) => {
                    const existing = state.items.find((i) => i.productId === item.productId);
                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i.productId === item.productId ? { ...i, ...item } : i,
                            ),
                        };
                    }
                    return { items: [...state.items, item] };
                }),
            removeItem: (productId) =>
                set((state) => ({
                    items: state.items.filter((i) => i.productId !== productId),
                })),
            clear: () => set({ items: [] }),
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
