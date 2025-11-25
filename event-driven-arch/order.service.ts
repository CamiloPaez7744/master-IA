import { eventBus } from './event-bus';
import { OrderCreatedEvent } from './events/order-created.event';

export function createOrder(orderId: string, userId: string, total: number) {
  const event: OrderCreatedEvent = { orderId, userId, total };
  console.log(`Order ${orderId} created.`);
  eventBus.emit('order.created', event);
}
