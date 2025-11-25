import { prisma } from '../../db/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function createOrder(orderId: string, userId: string, total: number) {
  await prisma.$transaction(async (tx) => {
    // Guardar el pedido
    await tx.order.create({
      data: {
        id: orderId,
        userId,
        total
      }
    });

    // Guardar evento en tabla outbox
    await tx.outbox.create({
      data: {
        id: uuidv4(),
        event_type: 'order.created',
        payload: {
          orderId,
          userId,
          total,
          createdAt: new Date().toISOString()
        }
      }
    });

    console.log(`[Monolith] Pedido ${orderId} creado y evento en outbox.`);
  });
}