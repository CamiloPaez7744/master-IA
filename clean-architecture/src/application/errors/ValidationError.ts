/**
 * ValidationError
 * Error que se lanza cuando los datos de entrada no cumplen con las reglas de validación
 */
export class ValidationError extends Error {
  readonly type = 'ValidationError' as const;
  
  constructor(
    message: string,
    public readonly field?: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
