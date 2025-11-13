import { InMemoryOrderRepository } from '@infrastructure/persistence/InMemoryOrderRepository';
import { CreateOrderUseCase } from '@application/use-cases/CreateOrderUseCase';

const orderRepository = new InMemoryOrderRepository();
export const createOrderUseCase = new CreateOrderUseCase(orderRepository);