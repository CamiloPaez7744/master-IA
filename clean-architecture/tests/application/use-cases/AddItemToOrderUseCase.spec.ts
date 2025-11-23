import { describe, it, expect, beforeEach } from 'vitest';
import { AddItemToOrderUseCase } from '@application/use-cases/AddItemToOrderUseCase';
import { CreateOrderUseCase } from '@application/use-cases/CreateOrderUseCase';
import { InMemoryOrderRepository } from '@infrastructure/persistence/in-memory/InMemoryOrderRepository';
import { NoopEventBus } from '@infrastructure/messaging/NoopEventBus';
import { StaticPricingService } from '@infrastructure/http/StaticPricingService';
import { Clock } from '@application/ports/Clock';
import { isValidationError, isNotFoundError, isConflictError } from '@application/errors/AppError';

describe('AddItemToOrderUseCase', () => {
  let useCase: AddItemToOrderUseCase;
  let createOrderUseCase: CreateOrderUseCase;
  let repository: InMemoryOrderRepository;
  let eventBus: NoopEventBus;
  let pricingService: StaticPricingService;
  let clock: Clock;

  const TEST_ORDER_ID = '550e8400-e29b-41d4-a716-446655440000';
  const TEST_CUSTOMER_ID = '7c9e6679-7425-40de-944b-e07fc1f90ae7';

  beforeEach(() => {
    repository = new InMemoryOrderRepository();
    eventBus = new NoopEventBus();
    pricingService = new StaticPricingService([
      { sku: 'LAPTOP-001', currency: 'USD', price: 999.99 },
      { sku: 'LAPTOP-001', currency: 'EUR', price: 899.99 },
      { sku: 'MOUSE-001', currency: 'USD', price: 29.99 },
      { sku: 'KEYBOARD-001', currency: 'USD', price: 79.99 }
    ]);
    clock = {
      now: () => new Date('2024-01-15T10:00:00Z'),
      timestamp: () => new Date('2024-01-15T10:00:00Z').getTime()
    };

    useCase = new AddItemToOrderUseCase(repository, pricingService, eventBus);
    createOrderUseCase = new CreateOrderUseCase(repository, eventBus, clock);
  });

  describe('Successful item addition', () => {
    it('should add item to existing order', async () => {
      // Create order first
      await createOrderUseCase.execute({
        orderId: TEST_ORDER_ID,
        customerId: TEST_CUSTOMER_ID,
        currency: 'USD'
      });

      const result = await useCase.execute({
        orderId: TEST_ORDER_ID,
        sku: 'LAPTOP-001',
        qty: 2,
        currency: 'USD'
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.orderId).toBe(TEST_ORDER_ID);
        expect(result.data.total.amount).toBe(1999.98); // 999.99 * 2
        expect(result.data.total.currency).toBe('USD');
      }
    });

    it('should add multiple different items to same order', async () => {
      await createOrderUseCase.execute({
        orderId: TEST_ORDER_ID,
        customerId: TEST_CUSTOMER_ID,
        currency: 'USD'
      });

      await useCase.execute({
        orderId: TEST_ORDER_ID,
        sku: 'LAPTOP-001',
        qty: 1,
        currency: 'USD'
      });

      await useCase.execute({
        orderId: TEST_ORDER_ID,
        sku: 'MOUSE-001',
        qty: 2,
        currency: 'USD'
      });

      const result = await useCase.execute({
        orderId: TEST_ORDER_ID,
        sku: 'KEYBOARD-001',
        qty: 1,
        currency: 'USD'
      });

      expect(result.success).toBe(true);
      if (result.success) {
        // Total: 999.99 + (29.99 * 2) + 79.99 = 1139.96
        expect(result.data.total.amount).toBeCloseTo(1139.96, 2);
      }
    });

    it('should calculate total with EUR currency', async () => {
      await createOrderUseCase.execute({
        orderId: TEST_ORDER_ID,
        customerId: TEST_CUSTOMER_ID,
        currency: 'EUR'
      });

      const result = await useCase.execute({
        orderId: TEST_ORDER_ID,
        sku: 'LAPTOP-001',
        qty: 1,
        currency: 'EUR'
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.total.amount).toBe(899.99);
        expect(result.data.total.currency).toBe('EUR');
      }
    });
  });

  describe('Not found errors', () => {
    it('should return NotFoundError when order does not exist', async () => {
      const result = await useCase.execute({
        orderId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
        sku: 'LAPTOP-001',
        qty: 1,
        currency: 'USD'
      });

      expect(result.success).toBe(false);
      if (!result.success && isNotFoundError(result.error)) {
        expect(result.error.resourceType).toBe('Order');
      }
    });
  });

  describe('Validation errors', () => {
    it('should return ValidationError when orderId is empty', async () => {
      const result = await useCase.execute({
        orderId: '',
        sku: 'LAPTOP-001',
        qty: 1,
        currency: 'USD'
      });

      expect(result.success).toBe(false);
      if (!result.success && isValidationError(result.error)) {
        expect(result.error.field).toBe('orderId');
      }
    });

    it('should return ValidationError when sku is empty', async () => {
      await createOrderUseCase.execute({
        orderId: TEST_ORDER_ID,
        customerId: TEST_CUSTOMER_ID,
        currency: 'USD'
      });

      const result = await useCase.execute({
        orderId: TEST_ORDER_ID,
        sku: '',
        qty: 1,
        currency: 'USD'
      });

      expect(result.success).toBe(false);
      if (!result.success && isValidationError(result.error)) {
        expect(result.error.field).toBe('sku');
      }
    });

    it('should return ValidationError when quantity is zero', async () => {
      await createOrderUseCase.execute({
        orderId: TEST_ORDER_ID,
        customerId: TEST_CUSTOMER_ID,
        currency: 'USD'
      });

      const result = await useCase.execute({
        orderId: TEST_ORDER_ID,
        sku: 'LAPTOP-001',
        qty: 0,
        currency: 'USD'
      });

      expect(result.success).toBe(false);
      if (!result.success && isValidationError(result.error)) {
        expect(result.error.field).toBe('qty');
      }
    });

    it('should return ValidationError when quantity is negative', async () => {
      await createOrderUseCase.execute({
        orderId: TEST_ORDER_ID,
        customerId: TEST_CUSTOMER_ID,
        currency: 'USD'
      });

      const result = await useCase.execute({
        orderId: TEST_ORDER_ID,
        sku: 'LAPTOP-001',
        qty: -1,
        currency: 'USD'
      });

      expect(result.success).toBe(false);
      if (!result.success && isValidationError(result.error)) {
        expect(result.error.field).toBe('qty');
      }
    });
  });

  describe('Conflict errors', () => {
    it('should return ConflictError when currency does not match order currency', async () => {
      await createOrderUseCase.execute({
        orderId: TEST_ORDER_ID,
        customerId: TEST_CUSTOMER_ID,
        currency: 'USD'
      });

      const result = await useCase.execute({
        orderId: TEST_ORDER_ID,
        sku: 'LAPTOP-001',
        qty: 1,
        currency: 'EUR' // Different from order currency
      });

      expect(result.success).toBe(false);
      if (!result.success && isConflictError(result.error)) {
        expect(result.error.code).toBe('CURRENCY_MISMATCH');
      }
    });

    it('should return ConflictError when SKU already exists in order', async () => {
      await createOrderUseCase.execute({
        orderId: TEST_ORDER_ID,
        customerId: TEST_CUSTOMER_ID,
        currency: 'USD'
      });

      // Add item first time
      await useCase.execute({
        orderId: TEST_ORDER_ID,
        sku: 'LAPTOP-001',
        qty: 1,
        currency: 'USD'
      });

      // Try to add same SKU again
      const result = await useCase.execute({
        orderId: TEST_ORDER_ID,
        sku: 'LAPTOP-001',
        qty: 1,
        currency: 'USD'
      });

      expect(result.success).toBe(false);
      if (!result.success && isConflictError(result.error)) {
        expect(result.error.code).toBe('BUSINESS_RULE_VIOLATION');
        expect(result.error.message).toContain('already exists');
      }
    });

    it('should return ConflictError when adding more than 100 items', async () => {
      await createOrderUseCase.execute({
        orderId: TEST_ORDER_ID,
        customerId: TEST_CUSTOMER_ID,
        currency: 'USD'
      });

      // Add 100 items
      for (let i = 1; i <= 100; i++) {
        await useCase.execute({
          orderId: TEST_ORDER_ID,
          sku: `ITEM-${i.toString().padStart(3, '0')}`,
          qty: 1,
          currency: 'USD'
        });
      }

      // Try to add 101st item
      const result = await useCase.execute({
        orderId: TEST_ORDER_ID,
        sku: 'ITEM-101',
        qty: 1,
        currency: 'USD'
      });

      expect(result.success).toBe(false);
      if (!result.success && isConflictError(result.error)) {
        expect(result.error.code).toBe('MAX_ITEMS_EXCEEDED');
      }
    });
  });
});
