export type AddItemToOrderInput = {
    orderId: string;
    sku: string;
    qty: number;
    currency: string;
};

export type AddItemToOrderOutput = {
    orderId: string;
    total: {
        amount: number;
        currency: string;
    };
};