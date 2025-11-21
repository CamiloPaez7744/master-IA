import { DomainEvent } from './DomainEvent';
import { OrderId } from '../value-objects/OrderId';
import { Sku } from '../value-objects/Sku';
import { Money } from '../value-objects/Money';
import { Quantity } from '../value-objects/Quantity';

/**
 * ItemAddedToOrder Event
 * Se dispara cuando se añade un ítem a un pedido existente
 */
export class ItemAddedToOrder extends DomainEvent {
  constructor(
    readonly orderId: OrderId,
    readonly sku: Sku,
    readonly unitPrice: Money,
    readonly quantity: Quantity,
    readonly itemTotal: Money
  ) {
    super();
  }

  get eventName(): string {
    return 'ItemAddedToOrder';
  }
}
