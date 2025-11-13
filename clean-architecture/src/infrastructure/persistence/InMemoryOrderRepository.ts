import { Order} from '@domain/entities/Order';
import { OrderRepository } from '@application/ports/OrderRepository';

export class InMemoryOrderRepository implements OrderRepository {
    private orders: Map<string, Order> = new Map();

    async save(order: Order): Promise<void> {
        this.orders.set(order.id, order);
    }
    async findById(id: string): Promise<Order | null> {
        return this.orders.get(id) || null;
    }
}