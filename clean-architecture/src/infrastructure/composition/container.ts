import { InMemoryOrderRepository } from '@infrastructure/persistence/in-memory/InMemoryOrderRepository';
import { NoopEventBus } from '@infrastructure/messaging/NoopEventBus';
import { StaticPricingService } from '@infrastructure/http/StaticPricingService';
import { CreateOrderUseCase } from '@application/use-cases/CreateOrderUseCase';
import { AddItemToOrderUseCase } from '@application/use-cases/AddItemToOrderUseCase';
import { Clock } from '@application/ports/Clock';

/**
 * Dependency Injection Container
 * Aquí se configuran todas las dependencias del sistema
 */

// Repositories
const orderRepository = new InMemoryOrderRepository();

// Infrastructure Services
const eventBus = new NoopEventBus();

const clock: Clock = {
  now: (): Date => new Date(),
  timestamp: (): number => Date.now()
};

// Configurar precios iniciales para el pricing service
const pricingService = new StaticPricingService([
  { sku: 'LAPTOP-001', currency: 'USD', price: 999.99 },
  { sku: 'LAPTOP-001', currency: 'EUR', price: 899.99 },
  { sku: 'LAPTOP-001', currency: 'COP', price: 3999999 },
  { sku: 'MOUSE-001', currency: 'USD', price: 29.99 },
  { sku: 'MOUSE-001', currency: 'EUR', price: 24.99 },
  { sku: 'MOUSE-001', currency: 'COP', price: 119999 },
  { sku: 'KEYBOARD-001', currency: 'USD', price: 79.99 },
  { sku: 'KEYBOARD-001', currency: 'EUR', price: 69.99 },
  { sku: 'KEYBOARD-001', currency: 'COP', price: 319999 },
]);

// Use Cases
export const createOrderUseCase = new CreateOrderUseCase(
  orderRepository,
  eventBus,
  clock
);

export const addItemToOrderUseCase = new AddItemToOrderUseCase(
  orderRepository,
  pricingService,
  eventBus
);