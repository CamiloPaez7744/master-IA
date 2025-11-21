export type CreateOrderInput = {
  orderId: string;
  customerId: string;
  currency: string;
};

export type CreateOrderOutput = {
  orderId: string;
  customerId: string;
  currency: string;
  createdAt: string;
};
