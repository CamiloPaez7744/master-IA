import amqp from 'amqplib';

async function consumeEvent() {
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();

  const queue = 'order.created';
  await channel.assertQueue(queue, { durable: false });

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      const event = JSON.parse(msg.content.toString());
      console.log('Event received:', event);
      channel.ack(msg);
    }
  });
}

consumeEvent();
