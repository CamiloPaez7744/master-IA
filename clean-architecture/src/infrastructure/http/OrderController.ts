import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateOrderUseCase } from '@application/use-cases/CreateOrderUseCase';

export class OrderController {
  constructor(private createOrderUseCase: CreateOrderUseCase) {}

  async createOrder(request: FastifyRequest, reply: FastifyReply) {
    const { orderId, customerId } = request.body as { orderId: string; customerId: string };
    const out = await this.createOrderUseCase.execute({ orderId, customerId });
    return reply.status(201).send(out);
  }
}