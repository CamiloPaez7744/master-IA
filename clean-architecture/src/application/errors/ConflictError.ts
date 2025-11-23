/**
 * ConflictError
 * Error que se lanza cuando hay un conflicto con el estado actual del sistema
 * (ej: duplicados, violación de invariantes de negocio)
 */
export class ConflictError extends Error {
  readonly type = 'ConflictError' as const;
  
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ConflictError';
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
