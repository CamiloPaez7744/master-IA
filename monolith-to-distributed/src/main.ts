import { createOrder } from './modules/orders/order.service';
import { publishOutboxEvents } from './outbox/outbox-publisher';

async function main() {
  const orderId = 'order-' + Math.floor(Math.random() * 1000);
  const userId = 'user-001';
  const total = 99.99;

  console.log('🛒 Creando orden...');
  await createOrder(orderId, userId, total);

  console.log('📤 Publicando eventos desde la outbox...');
  await publishOutboxEvents();
}

main().catch((err) => {
  console.error('❌ Error:', err);
});
