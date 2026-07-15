import { CartItem } from "@/types/CartItem";

export interface Order {
    id: string;
    orderNumber: number;
    items: CartItem[];
    totalPrice: number;
    createdAt: string;
}
