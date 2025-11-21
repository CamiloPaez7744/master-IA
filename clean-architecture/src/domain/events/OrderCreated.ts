import { DomainEvent } from './DomainEvent';
import { OrderId } from '../value-objects/OrderId';
import { CustomerId } from '../value-objects/CustomerId';
import { Currency } from '../value-objects/Currency';

/**
 * OrderCreated Event
 * Se dispara cuando se crea un nuevo pedido
 */
export class OrderCreated extends DomainEvent {
  constructor(
    readonly orderId: OrderId,
    readonly customerId: CustomerId,
    readonly currency: Currency
  ) {
    super();
  }

  get eventName(): string {
    return 'OrderCreated';
  }
}
