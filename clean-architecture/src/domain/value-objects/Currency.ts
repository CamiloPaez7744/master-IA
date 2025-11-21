/**
 * Currency Value Object
 * Representa una moneda en formato ISO 4217
 * 
 * Invariantes:
 * - Debe ser un código ISO 4217 válido de 3 letras
 * - Solo soporta monedas definidas
 */
export class Currency {
  private static readonly SUPPORTED_CURRENCIES = ['USD', 'EUR', 'COP', 'GBP', 'JPY'] as const;
  private readonly _code: string;

  private constructor(code: string) {
    this._code = code;
  }

  static create(code: string): Currency {
    if (!code || code.trim().length === 0) {
      throw new Error('Currency code cannot be empty');
    }

    const upperCode = code.trim().toUpperCase();

    if (upperCode.length !== 3) {
      throw new Error('Currency code must be 3 characters (ISO 4217)');
    }

    if (!this.SUPPORTED_CURRENCIES.includes(upperCode as any)) {
      throw new Error(
        `Currency '${upperCode}' is not supported. Supported currencies: ${this.SUPPORTED_CURRENCIES.join(', ')}`
      );
    }

    return new Currency(upperCode);
  }

  get code(): string {
    return this._code;
  }

  equals(other: Currency): boolean {
    return this._code === other._code;
  }

  toString(): string {
    return this._code;
  }
}
