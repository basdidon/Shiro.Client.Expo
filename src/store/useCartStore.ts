import { CartItem } from "@/types/CartItem";
import { create } from "zustand";

// Define the store state and actions
interface CartState {
    cart: CartItem[];
    setItemToCart: (item: CartItem) => void;
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
    cart: [],
    setItemToCart: (item) =>
        set((state) => {
            const existingItem = state.cart.find((i) => i.id === item.id);
            if (existingItem) {
                // If item exists, update quantity
                return {
                    cart: state.cart.map((i) =>
                        i.id === item.id ? { ...i, quantity: item.quantity } : i,
                    ),
                };
            }
            // Otherwise, add new item
            return { cart: [...state.cart, item] };
        }),
    addToCart: (item) =>
        set((state) => {
            const existingItem = state.cart.find((i) => i.id === item.id);
            if (existingItem) {
                // If item exists, increase quantity
                return {
                    cart: state.cart.map((i) =>
                        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
                    ),
                };
            }
            // Otherwise, add new item with quantity 1
            return { cart: [...state.cart, { ...item, quantity: 1 }] };
        }),
    removeFromCart: (id) =>
        set((state) => ({
            cart: state.cart.filter((i) => i.id !== id),
        })),
    clearCart: () => set({ cart: [] }),
}));
