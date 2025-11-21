import { OrderId } from '../value-objects/OrderId';
import { CustomerId } from '../value-objects/CustomerId';
import { OrderItem } from '../value-objects/OrderItem';
import { Money } from '../value-objects/Money';
import { Currency } from '../value-objects/Currency';
import { Sku } from '../value-objects/Sku';
import { Quantity } from '../value-objects/Quantity';
import { DomainEvent } from '../events/DomainEvent';
import { OrderCreated } from '../events/OrderCreated';
import { ItemAddedToOrder } from '../events/ItemAddedToOrder';
import { OrderTotalCalculated } from '../events/OrderTotalCalculated';

/**
 * Order Aggregate Root
 * Representa un pedido en el sistema
 * 
 * Invariantes:
 * - Un pedido debe tener un ID único
 * - Un pedido debe pertenecer a un cliente
 * - Todos los ítems deben tener la misma moneda
 * - Un pedido no puede tener más de 100 ítems
 * - No se pueden añadir ítems duplicados (mismo SKU)
 * - El total debe ser consistente con la suma de los ítems
 */
export class Order {
  private static readonly MAX_ITEMS = 100;

  private readonly _id: OrderId;
  private readonly _customerId: CustomerId;
  private readonly _items: OrderItem[] = [];
  private readonly _currency: Currency;
  private readonly _domainEvents: DomainEvent[] = [];

  private constructor(id: OrderId, customerId: CustomerId, currency: Currency) {
    this._id = id;
    this._customerId = customerId;
    this._currency = currency;
  }

  /**
   * Factory method para crear un nuevo pedido
   */
  static create(id: OrderId, customerId: CustomerId, currency: Currency): Order {
    const order = new Order(id, customerId, currency);
    order.addDomainEvent(new OrderCreated(id, customerId, currency));
    return order;
  }

  get id(): OrderId {
    return this._id;
  }

  get customerId(): CustomerId {
    return this._customerId;
  }

  get currency(): Currency {
    return this._currency;
  }

  get items(): readonly OrderItem[] {
    return Object.freeze([...this._items]);
  }

  get itemCount(): number {
    return this._items.length;
  }

  /**
   * Añade un ítem al pedido
   * 
   * Reglas de negocio:
   * - La moneda del ítem debe coincidir con la del pedido
   * - No se pueden añadir ítems duplicados (mismo SKU)
   * - No se puede exceder el máximo de ítems permitidos
   */
  addItem(sku: Sku, unitPrice: Money, quantity: Quantity): void {
    this.ensureCurrencyMatches(unitPrice);
    this.ensureItemLimitNotExceeded();
    this.ensureNoDuplicateSku(sku);

    const item = OrderItem.create(sku, unitPrice, quantity);
    this._items.push(item);

    this.addDomainEvent(
      new ItemAddedToOrder(
        this._id,
        sku,
        unitPrice,
        quantity,
        item.calculateTotal()
      )
    );
  }

  /**
   * Calcula el total del pedido
   * Suma todos los totales de los ítems
   */
  calculateTotal(): Money {
    if (this._items.length === 0) {
      return Money.zero(this._currency);
    }

    const total = this._items.reduce((acc, item) => {
      return acc.add(item.calculateTotal());
    }, Money.zero(this._currency));

    this.addDomainEvent(
      new OrderTotalCalculated(this._id, total, this._items.length)
    );

    return total;
  }

  /**
   * Obtiene el total por moneda (útil para reportes)
   */
  getTotalByCurrency(): { currency: string; amount: number } {
    const total = this.calculateTotal();
    return {
      currency: total.currency.code,
      amount: total.amount
    };
  }

  /**
   * Verifica si el pedido está vacío
   */
  isEmpty(): boolean {
    return this._items.length === 0;
  }

  /**
   * Obtiene los eventos de dominio pendientes
   */
  getDomainEvents(): readonly DomainEvent[] {
    return Object.freeze([...this._domainEvents]);
  }

  /**
   * Limpia los eventos de dominio después de ser procesados
   */
  clearDomainEvents(): void {
    this._domainEvents.length = 0;
  }

  private ensureCurrencyMatches(unitPrice: Money): void {
    if (!this._currency.equals(unitPrice.currency)) {
      throw new Error(
        `Item currency (${unitPrice.currency.code}) does not match order currency (${this._currency.code})`
      );
    }
  }

  private ensureItemLimitNotExceeded(): void {
    if (this._items.length >= Order.MAX_ITEMS) {
      throw new Error(`Order cannot have more than ${Order.MAX_ITEMS} items`);
    }
  }

  private ensureNoDuplicateSku(sku: Sku): void {
    const exists = this._items.some(item => item.sku.equals(sku));
    if (exists) {
      throw new Error(`Item with SKU '${sku.code}' already exists in the order`);
    }
  }

  private addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }
}
