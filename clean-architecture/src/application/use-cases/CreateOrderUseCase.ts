import { Result, ok, fail } from '../../shared/Result';
import { CreateOrderInput, CreateOrderOutput } from '../dtos/CreateOrderDTO';
import { OrderRepository } from '../ports/OrderRepository';
import { EventBus } from '../ports/EventBus';
import { Clock } from '../ports/Clock';
import { AppError } from '../errors/AppError';
import { ValidationError } from '../errors/ValidationError';
import { ConflictError } from '../errors/ConflictError';
import { InfraError } from '../errors/InfraError';
import { Order } from '../../domain/entities/Order';
import { OrderId } from '../../domain/value-objects/OrderId';
import { CustomerId } from '../../domain/value-objects/CustomerId';
import { Currency } from '../../domain/value-objects/Currency';

/**
 * CreateOrderUseCase
 * Caso de uso para crear un nuevo pedido vacío
 * 
 * Flujo:
 * 1. Valida los datos de entrada
 * 2. Verifica que el pedido no exista
 * 3. Crea la entidad Order
 * 4. Persiste el pedido
 * 5. Publica los eventos de dominio
 */
export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly eventBus: EventBus,
    private readonly clock: Clock
  ) {}

  async execute(input: CreateOrderInput): Promise<Result<CreateOrderOutput, AppError>> {
    try {
      // 1. Validar y crear value objects
      const orderIdResult = this.createOrderId(input.orderId);
      if (!orderIdResult.success) {
        return orderIdResult;
      }

      const customerIdResult = this.createCustomerId(input.customerId);
      if (!customerIdResult.success) {
        return customerIdResult;
      }

      const currencyResult = this.createCurrency(input.currency);
      if (!currencyResult.success) {
        return currencyResult;
      }

      const orderId = orderIdResult.data;
      const customerId = customerIdResult.data;
      const currency = currencyResult.data;

      // 2. Verificar que el pedido no exista
      const exists = await this.orderRepository.exists(orderId);
      if (exists) {
        return fail(
          new ConflictError(
            `Order with ID '${input.orderId}' already exists`,
            'DUPLICATE_ORDER',
            { orderId: input.orderId }
          )
        );
      }

      // 3. Crear la entidad Order
      const order = Order.create(orderId, customerId, currency);

      // 4. Persistir el pedido
      await this.orderRepository.save(order);

      // 5. Publicar eventos de dominio
      const events = order.getDomainEvents();
      if (events.length > 0) {
        await this.eventBus.publish(events);
        order.clearDomainEvents();
      }

      // 6. Retornar resultado exitoso
      return ok({
        orderId: orderId.value,
        customerId: customerId.value,
        currency: currency.code,
        createdAt: this.clock.now().toISOString()
      });

    } catch (error) {
      // Mapear errores no controlados a InfraError
      return fail(
        new InfraError(
          'Failed to create order due to infrastructure error',
          'OrderRepository',
          error instanceof Error ? error : undefined
        )
      );
    }
  }

  private createOrderId(value: string): Result<OrderId, AppError> {
    try {
      return ok(OrderId.create(value));
    } catch (error) {
      return fail(
        new ValidationError(
          error instanceof Error ? error.message : 'Invalid order ID',
          'orderId'
        )
      );
    }
  }

  private createCustomerId(value: string): Result<CustomerId, AppError> {
    try {
      return ok(CustomerId.create(value));
    } catch (error) {
      return fail(
        new ValidationError(
          error instanceof Error ? error.message : 'Invalid customer ID',
          'customerId'
        )
      );
    }
  }

  private createCurrency(value: string): Result<Currency, AppError> {
    try {
      return ok(Currency.create(value));
    } catch (error) {
      return fail(
        new ValidationError(
          error instanceof Error ? error.message : 'Invalid currency',
          'currency'
        )
      );
    }
  }
}