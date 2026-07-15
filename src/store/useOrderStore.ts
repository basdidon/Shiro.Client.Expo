import { CartItem } from "@/types/CartItem";
import { Order } from "@/types/Order";
import { create } from "zustand";

interface OrderState {
    orders: Order[];
    placeOrder: (items: CartItem[]) => Order;
}

export const useOrderStore = create<OrderState>((set, get) => ({
    orders: [],
    placeOrder: (items) => {
        const totalPrice = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
        const order: Order = {
            id: String(Date.now()),
            orderNumber: get().orders.length + 1,
            items,
            totalPrice,
            createdAt: new Date().toISOString(),
        };
        set((state) => ({ orders: [order, ...state.orders] }));
        return order;
    },
}));
