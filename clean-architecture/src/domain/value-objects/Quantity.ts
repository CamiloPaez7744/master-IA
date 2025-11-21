/**
 * Quantity Value Object
 * Representa una cantidad de productos
 * 
 * Invariantes:
 * - Debe ser un número entero positivo
 * - Debe ser mayor que cero
 * - No puede exceder el límite máximo por ítem
 */
export class Quantity {
  private static readonly MAX_QUANTITY_PER_ITEM = 10000;
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(value: number): Quantity {
    if (!Number.isInteger(value)) {
      throw new Error('Quantity must be an integer');
    }

    if (value <= 0) {
      throw new Error('Quantity must be greater than zero');
    }

    if (value > this.MAX_QUANTITY_PER_ITEM) {
      throw new Error(`Quantity cannot exceed ${this.MAX_QUANTITY_PER_ITEM} units per item`);
    }

    return new Quantity(value);
  }

  get value(): number {
    return this._value;
  }

  add(other: Quantity): Quantity {
    return Quantity.create(this._value + other._value);
  }

  equals(other: Quantity): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value.toString();
  }
}