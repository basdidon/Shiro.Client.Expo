import { components } from "@/types/api";

type OrderStatus = components["schemas"]["OrderStatus"];

export const getStatusIcon = (status?: OrderStatus) => {
    switch (status) {
        case "Created":
            return "clock-outline";
        case "Shipped":
            return "truck-fast-outline";
        case "Completed":
            return "check-circle-outline";
        case "Cancelled":
            return "cancel";
        default:
            return "help-circle-outline";
    }
};
