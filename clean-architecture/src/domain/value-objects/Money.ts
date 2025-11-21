import { Currency } from './Currency';

/**
 * Money Value Object
 * Representa una cantidad monetaria con su moneda
 * 
 * Invariantes:
 * - El monto debe ser finito y no negativo
 * - Debe tener una moneda válida
 * - Precisión de 2 decimales
 * - Operaciones solo entre misma moneda
 */
export class Money {
  private readonly _amount: number;
  private readonly _currency: Currency;

  private constructor(amount: number, currency: Currency) {
    this._amount = amount;
    this._currency = currency;
  }

  static create(amount: number, currency: Currency): Money {
    if (!Number.isFinite(amount)) {
      throw new Error('Money amount must be a finite number');
    }

    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }

    // Redondear a 2 decimales para evitar problemas de precisión
    const rounded = Math.round(amount * 100) / 100;

    return new Money(rounded, currency);
  }

  static zero(currency: Currency): Money {
    return new Money(0, currency);
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): Currency {
    return this._currency;
  }

  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return Money.create(this._amount + other._amount, this._currency);
  }

  subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    const result = this._amount - other._amount;
    
    if (result < 0) {
      throw new Error('Subtraction would result in negative amount');
    }

    return Money.create(result, this._currency);
  }

  multiply(factor: number): Money {
    if (!Number.isFinite(factor) || factor < 0) {
      throw new Error('Multiplication factor must be a positive finite number');
    }

    return Money.create(this._amount * factor, this._currency);
  }

  equals(other: Money): boolean {
    return this._amount === other._amount && this._currency.equals(other._currency);
  }

  isGreaterThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this._amount > other._amount;
  }

  isLessThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this._amount < other._amount;
  }

  isZero(): boolean {
    return this._amount === 0;
  }

  private ensureSameCurrency(other: Money): void {
    if (!this._currency.equals(other._currency)) {
      throw new Error(
        `Cannot perform operation between different currencies: ${this._currency.code} and ${other._currency.code}`
      );
    }
  }

  toString(): string {
    return `${this._amount.toFixed(2)} ${this._currency.code}`;
  }
}
