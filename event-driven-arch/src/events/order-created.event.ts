export interface OrderCreatedEvent {
  orderId: string;
  userId: string;
  total: number;
}
