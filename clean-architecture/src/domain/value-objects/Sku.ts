/**
 * Sku (Stock Keeping Unit) Value Object
 * Representa un código único de producto
 * 
 * Invariantes:
 * - No puede ser vacío
 * - Debe tener entre 3 y 50 caracteres
 * - Solo permite caracteres alfanuméricos y guiones
 */
export class Sku {
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 50;
  private static readonly VALID_PATTERN = /^[A-Z0-9\-]+$/;
  
  private readonly _code: string;

  private constructor(code: string) {
    this._code = code;
  }

  static create(code: string): Sku {
    if (!code || code.trim().length === 0) {
      throw new Error('SKU code cannot be empty');
    }

    const normalized = code.trim().toUpperCase();

    if (normalized.length < this.MIN_LENGTH) {
      throw new Error(`SKU code must be at least ${this.MIN_LENGTH} characters long`);
    }

    if (normalized.length > this.MAX_LENGTH) {
      throw new Error(`SKU code cannot exceed ${this.MAX_LENGTH} characters`);
    }

    if (!this.VALID_PATTERN.test(normalized)) {
      throw new Error('SKU code can only contain alphanumeric characters and hyphens');
    }

    return new Sku(normalized);
  }

  get code(): string {
    return this._code;
  }

  equals(other: Sku): boolean {
    return this._code === other._code;
  }

  toString(): string {
    return this._code;
  }
}