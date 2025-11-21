import { DomainEvent } from './DomainEvent';
import { OrderId } from '../value-objects/OrderId';
import { Money } from '../value-objects/Money';

/**
 * OrderTotalCalculated Event
 * Se dispara cuando se calcula el total del pedido
 */
export class OrderTotalCalculated extends DomainEvent {
  constructor(
    readonly orderId: OrderId,
    readonly total: Money,
    readonly itemCount: number
  ) {
    super();
  }

  get eventName(): string {
    return 'OrderTotalCalculated';
  }
}
