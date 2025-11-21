/**
 * CustomerId Value Object
 * Representa un identificador único de cliente
 * 
 * Invariantes:
 * - No puede ser vacío
 * - Debe tener un formato válido (UUID v4)
 */
export class CustomerId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): CustomerId {
    if (!value || value.trim().length === 0) {
      throw new Error('CustomerId cannot be empty');
    }

    // Validar formato UUID v4
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value.trim())) {
      throw new Error('CustomerId must be a valid UUID v4 format');
    }

    return new CustomerId(value.trim());
  }

  get value(): string {
    return this._value;
  }

  equals(other: CustomerId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
