import { Result, ok, fail } from '@shared/Result';
import { AddItemToOrderInput, AddItemToOrderOutput } from '../dtos/AddItemToOrderDTO';
import { OrderRepository } from '../ports/OrderRepository';
import { PricingService } from '../ports/PricingService';
import { EventBus } from '../ports/EventBus';
import { AppError } from '../errors/AppError';
import { ValidationError } from '../errors/ValidationError';
import { NotFoundError } from '../errors/NotFoundError';
import { ConflictError } from '../errors/ConflictError';
import { InfraError } from '../errors/InfraError';
import { OrderId } from '@domain/value-objects/OrderId';
import { Sku } from '@domain/value-objects/Sku';
import { Quantity } from '@domain/value-objects/Quantity';
import { Currency } from '@domain/value-objects/Currency';

/**
 * AddItemToOrderUseCase
 * Caso de uso para añadir un ítem a un pedido existente
 * 
 * Flujo:
 * 1. Valida los datos de entrada
 * 2. Busca el pedido existente
 * 3. Obtiene el precio del producto
 * 4. Añade el ítem al pedido
 * 5. Persiste el pedido actualizado
 * 6. Publica los eventos de dominio
 */
export class AddItemToOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly pricingService: PricingService,
    private readonly eventBus: EventBus
  ) {}

  async execute(input: AddItemToOrderInput): Promise<Result<AddItemToOrderOutput, AppError>> {
    try {
      // 1. Validar y crear value objects
      const orderIdResult = this.createOrderId(input.orderId);
      if (!orderIdResult.success) {
        return orderIdResult;
      }

      const skuResult = this.createSku(input.sku);
      if (!skuResult.success) {
        return skuResult;
      }

      const quantityResult = this.createQuantity(input.qty);
      if (!quantityResult.success) {
        return quantityResult;
      }

      const currencyResult = this.createCurrency(input.currency);
      if (!currencyResult.success) {
        return currencyResult;
      }

      const orderId = orderIdResult.data;
      const sku = skuResult.data;
      const quantity = quantityResult.data;
      const currency = currencyResult.data;

      // 2. Buscar el pedido existente
      const order = await this.orderRepository.findById(orderId);
      if (!order) {
        return fail(
          new NotFoundError(
            `Order with ID '${input.orderId}' not found`,
            'Order',
            input.orderId
          )
        );
      }

      // 3. Verificar que la moneda coincida con la del pedido
      if (!order.currency.equals(currency)) {
        return fail(
          new ValidationError(
            `Currency mismatch: order is in ${order.currency.code}, but item is in ${currency.code}`,
            'currency',
            { orderCurrency: order.currency.code, itemCurrency: currency.code }
          )
        );
      }

      // 4. Obtener el precio del producto
      const priceResult = await this.getProductPrice(sku, currency);
      if (!priceResult.success) {
        return priceResult;
      }
      const unitPrice = priceResult.data;

      // 5. Añadir el ítem al pedido (validación de negocio en la entidad)
      try {
        order.addItem(sku, unitPrice, quantity);
      } catch (error) {
        return fail(
          new ConflictError(
            error instanceof Error ? error.message : 'Cannot add item to order',
            'BUSINESS_RULE_VIOLATION',
            { sku: input.sku, orderId: input.orderId }
          )
        );
      }

      // 6. Persistir el pedido actualizado
      await this.orderRepository.save(order);

      // 7. Publicar eventos de dominio
      const events = order.getDomainEvents();
      if (events.length > 0) {
        await this.eventBus.publish(events);
        order.clearDomainEvents();
      }

      // 8. Calcular y retornar el total actualizado
      const total = order.calculateTotal();

      return ok({
        orderId: orderId.value,
        total: {
          amount: total.amount,
          currency: total.currency.code
        }
      });

    } catch (error) {
      // Mapear errores no controlados a InfraError
      return fail(
        new InfraError(
          'Failed to add item to order due to infrastructure error',
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

  private createSku(value: string): Result<Sku, AppError> {
    try {
      return ok(Sku.create(value));
    } catch (error) {
      return fail(
        new ValidationError(
          error instanceof Error ? error.message : 'Invalid SKU',
          'sku'
        )
      );
    }
  }

  private createQuantity(value: number): Result<Quantity, AppError> {
    try {
      return ok(Quantity.create(value));
    } catch (error) {
      return fail(
        new ValidationError(
          error instanceof Error ? error.message : 'Invalid quantity',
          'qty'
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

  private async getProductPrice(sku: Sku, currency: Currency): Promise<Result<any, AppError>> {
    try {
      const price = await this.pricingService.getPrice(sku, currency);
      return ok(price);
    } catch (error) {
      // Si el servicio de pricing lanza NotFoundError, lo propagamos
      if (error instanceof NotFoundError) {
        return fail(error);
      }
      
      // Cualquier otro error es un problema de infraestructura
      return fail(
        new InfraError(
          `Failed to get price for SKU '${sku.code}'`,
          'PricingService',
          error instanceof Error ? error : undefined
        )
      );
    }
  }
}