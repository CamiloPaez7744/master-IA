import { eventBus } from './event-bus';

eventBus.on('order.created', (event) => {
  console.log(`Processing payment for order ${event.orderId}...`);
});
