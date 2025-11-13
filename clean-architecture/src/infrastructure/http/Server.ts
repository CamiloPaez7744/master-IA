import Fastify from 'fastify';
import { OrderController } from './OrderController';

export async function buildServer(orderController: OrderController) {
    const app = Fastify({
        logger: true
    });

    app.get('/health', async (request, reply) => {
        return { status: 'ok' };
    });

    app.post('/orders', async (request, reply) => {
        return orderController.createOrder(request, reply);
    });

    return app;
}