import { Sku } from './Sku';
import { Money } from './Money';
import { Quantity } from './Quantity';

/**
 * OrderItem Value Object
 * Representa un ítem dentro de un pedido
 * 
 * Invariantes:
 * - Debe tener un SKU válido
 * - Debe tener un precio unitario válido
 * - Debe tener una cantidad válida
 * - El total calculado debe ser consistente
 */
export class OrderItem {
  private readonly _sku: Sku;
  private readonly _unitPrice: Money;
  private readonly _quantity: Quantity;

  private constructor(sku: Sku, unitPrice: Money, quantity: Quantity) {
    this._sku = sku;
    this._unitPrice = unitPrice;
    this._quantity = quantity;
  }

  static create(sku: Sku, unitPrice: Money, quantity: Quantity): OrderItem {
    return new OrderItem(sku, unitPrice, quantity);
  }

  get sku(): Sku {
    return this._sku;
  }

  get unitPrice(): Money {
    return this._unitPrice;
  }

  get quantity(): Quantity {
    return this._quantity;
  }

  /**
   * Calcula el total del ítem (precio unitario * cantidad)
   */
  calculateTotal(): Money {
    return this._unitPrice.multiply(this._quantity.value);
  }

  /**
   * Verifica si el ítem tiene el mismo SKU
   */
  hasSameSku(other: OrderItem): boolean {
    return this._sku.equals(other._sku);
  }

  /**
   * Verifica si el ítem tiene la misma moneda
   */
  hasSameCurrency(other: OrderItem): boolean {
    return this._unitPrice.currency.equals(other._unitPrice.currency);
  }

  equals(other: OrderItem): boolean {
    return (
      this._sku.equals(other._sku) &&
      this._unitPrice.equals(other._unitPrice) &&
      this._quantity.equals(other._quantity)
    );
  }

  toString(): string {
    return `${this._sku.code} x ${this._quantity.value} @ ${this._unitPrice.toString()} = ${this.calculateTotal().toString()}`;
  }
}
