import amqp from 'amqplib';
import { prisma } from '../db/prisma';

export async function publishOutboxEvents() {
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();

  const pending = await prisma.outbox.findMany({
    where: { processed: false }
  });

  for (const event of pending) {
    await channel.assertQueue(event.event_type);
    channel.sendToQueue(event.event_type, Buffer.from(JSON.stringify(event.payload)));

    await prisma.outbox.update({
      where: { id: event.id },
      data: { processed: true }
    });

    console.log(`Publicado evento: ${event.event_type}`);
  }

  await channel.close();
  await conn.close();
}
