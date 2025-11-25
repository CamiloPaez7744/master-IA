import amqp from 'amqplib';

async function publishEvent() {
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();

  const queue = 'order.created';
  const event = {
    orderId: 'abc123',
    userId: 'user42',
    total: 100
  };

  await channel.assertQueue(queue, { durable: false });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(event)));

  console.log('Event published:', event);
  await channel.close();
  await conn.close();
}

publishEvent();
