/**
 * NotFoundError
 * Error que se lanza cuando un recurso no se encuentra en el sistema
 */
export class NotFoundError extends Error {
  readonly type = 'NotFoundError' as const;
  
  constructor(
    message: string,
    public readonly resourceType?: string,
    public readonly resourceId?: string
  ) {
    super(message);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
