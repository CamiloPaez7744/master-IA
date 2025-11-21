/**
 * InfraError
 * Error que se lanza cuando hay un problema con la infraestructura
 * (ej: base de datos no disponible, servicio externo caído)
 */
export class InfraError extends Error {
  readonly type = 'InfraError' as const;
  
  constructor(
    message: string,
    public readonly serviceName?: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'InfraError';
    Object.setPrototypeOf(this, InfraError.prototype);
  }
}
