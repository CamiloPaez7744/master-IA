import amqp from 'amqplib';

async function consume() {
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();

  const queue = 'order.created';
  await channel.assertQueue(queue);

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      const event = JSON.parse(msg.content.toString());
      console.log(`[Microservice] Procesando pago para el pedido ${event.orderId}`);
      channel.ack(msg);
    }
  });
}


consume();
