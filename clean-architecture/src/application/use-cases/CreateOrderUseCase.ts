import { Order } from "@domain/entities/Order";
import { OrderRepository } from "@application/ports/OrderRepository";

export type CreateOrderInput = { orderId: string, customerId: string };
export type CreateOrderOutput = { orderId: string };

export class CreateOrderUseCase {
    constructor(private orderRepository: OrderRepository) {}

    async execute({ orderId, customerId }: CreateOrderInput): Promise<CreateOrderOutput> {
        const existingOrder = await this.orderRepository.findById(orderId);
        if (existingOrder) {
            throw new Error('Order with this ID already exists');
        }
        const order = new Order(orderId, customerId);
        await this.orderRepository.save(order);
        return { orderId: order.id };
    }
}