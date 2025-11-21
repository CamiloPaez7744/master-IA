import { Order } from '../../../domain/entities/Order';
import { OrderId } from '../../../domain/value-objects/OrderId';
import { OrderRepository } from '../../../application/ports/OrderRepository';

/**
 * InMemoryOrderRepository
 * Implementación en memoria del OrderRepository
 * Útil para testing y desarrollo
 */
export class InMemoryOrderRepository implements OrderRepository {
  private orders: Map<string, Order> = new Map();

  async save(order: Order): Promise<void> {
    this.orders.set(order.id.value, order);
  }

  async findById(id: OrderId): Promise<Order | null> {
    return this.orders.get(id.value) || null;
  }

  async exists(id: OrderId): Promise<boolean> {
    return this.orders.has(id.value);
  }

  /**
   * Métodos adicionales útiles para testing
   */
  clear(): void {
    this.orders.clear();
  }

  count(): number {
    return this.orders.size;
  }

  getAll(): Order[] {
    return Array.from(this.orders.values());
  }
}