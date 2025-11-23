import { describe, it, expect, beforeEach } from 'vitest';
import { CreateOrderUseCase } from '@application/use-cases/CreateOrderUseCase';
import { InMemoryOrderRepository } from '@infrastructure/persistence/in-memory/InMemoryOrderRepository';
import { NoopEventBus } from '@infrastructure/messaging/NoopEventBus';
import { Clock } from '@application/ports/Clock';
import { isValidationError, isConflictError } from '@application/errors/AppError';

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;
  let repository: InMemoryOrderRepository;
  let eventBus: NoopEventBus;
  let clock: Clock;

  const TEST_ORDER_ID = '550e8400-e29b-41d4-a716-446655440000';
  const TEST_CUSTOMER_ID = '7c9e6679-7425-40de-944b-e07fc1f90ae7';

  beforeEach(() => {
    repository = new InMemoryOrderRepository();
    eventBus = new NoopEventBus();
    clock = {
      now: () => new Date('2024-01-15T10:00:00Z'),
      timestamp: () => new Date('2024-01-15T10:00:00Z').getTime()
    };
    useCase = new CreateOrderUseCase(repository, eventBus, clock);
  });

  describe('Successful order creation', () => {
    it('should create a new order with valid data', async () => {
      const result = await useCase.execute({
        orderId: TEST_ORDER_ID,
        customerId: TEST_CUSTOMER_ID,
        currency: 'USD'
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.orderId).toBe(TEST_ORDER_ID);
        expect(result.data.customerId).toBe(TEST_CUSTOMER_ID);
        expect(result.data.currency).toBe('USD');
        expect(result.data.createdAt).toBe('2024-01-15T10:00:00.000Z');
      }
    });

    it('should create orders with different currencies', async () => {
      const resultUSD = await useCase.execute({
        orderId: TEST_ORDER_ID,
        customerId: TEST_CUSTOMER_ID,
        currency: 'USD'
      });

      const resultEUR = await useCase.execute({
        orderId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        customerId: '8f14e45f-cea6-4b26-8d1d-9e3f59e4b3a2',
        currency: 'EUR'
      });

      expect(resultUSD.success).toBe(true);
      expect(resultEUR.success).toBe(true);
    });
  });

  describe('Validation errors', () => {
    it('should return ValidationError when orderId is empty', async () => {
      const result = await useCase.execute({
        orderId: '',
        customerId: TEST_CUSTOMER_ID,
        currency: 'USD'
      });

      expect(result.success).toBe(false);
      if (!result.success && isValidationError(result.error)) {
        expect(result.error.field).toBe('orderId');
      }
    });

    it('should return ValidationError when customerId is empty', async () => {
      const result = await useCase.execute({
        orderId: TEST_ORDER_ID,
        customerId: '',
        currency: 'USD'
      });

      expect(result.success).toBe(false);
      if (!result.success && isValidationError(result.error)) {
        expect(result.error.field).toBe('customerId');
      }
    });

    it('should return ValidationError for invalid currency', async () => {
      const result = await useCase.execute({
        orderId: TEST_ORDER_ID,
        customerId: TEST_CUSTOMER_ID,
        currency: 'XXX'
      });

      expect(result.success).toBe(false);
      if (!result.success && isValidationError(result.error)) {
        expect(result.error.field).toBe('currency');
      }
    });
  });

  describe('Conflict errors', () => {
    it('should return ConflictError when order already exists', async () => {
      // Create order first time
      await useCase.execute({
        orderId: TEST_ORDER_ID,
        customerId: TEST_CUSTOMER_ID,
        currency: 'USD'
      });

      // Try to create same order again
      const result = await useCase.execute({
        orderId: TEST_ORDER_ID,
        customerId: TEST_CUSTOMER_ID,
        currency: 'USD'
      });

      expect(result.success).toBe(false);
      if (!result.success && isConflictError(result.error)) {
        expect(result.error.code).toBe('DUPLICATE_ORDER');
      }
    });
  });
});
