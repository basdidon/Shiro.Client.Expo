import { Product } from "@/types/Product";

export const getProductById = (id: string): Product | undefined => {
    return products.find((x) => x.id == id);
};

export const getProducts = () => {
    return products;
};

const products: Product[] = [
    {
        id: "001",
        barcode: "x-001",
        name: "Awesome product",
        unitPrice: 20,
    },
    {
        id: "002",
        barcode: "x-002",
        name: "Drinking water",
        unitPrice: 7,
    },
    {
        id: "003",
        barcode: "x-003",
        name: "Apple",
        unitPrice: 9,
    },
    {
        id: "004",
        barcode: "x-004",
        name: "Labtop",
        unitPrice: 12500,
    },
];
