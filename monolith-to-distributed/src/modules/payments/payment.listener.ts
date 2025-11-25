import { eventBus } from '../../event-bus';

eventBus.on('order.created', async (event) => {
  console.log(`[Monolith] Procesando pago para el pedido ${event.orderId}...`);
});
