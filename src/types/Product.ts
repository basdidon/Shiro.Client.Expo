export interface Product {
    id: string;
    barcodes: string[];
    name: string;
    unitPrice: number;
}

export interface Order {
    id: string;
    orderNumber: number;
    itemsCount: number;
    orderBy: string;
}
