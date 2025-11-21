/**
 * DomainEvent - Clase base abstracta para todos los eventos de dominio
 * 
 * Los eventos de dominio son hechos que ya ocurrieron en el pasado
 * y son importantes para el negocio.
 */
export abstract class DomainEvent {
  readonly occurredOn: Date;
  readonly eventId: string;

  protected constructor() {
    this.occurredOn = new Date();
    this.eventId = this.generateEventId();
  }

  abstract get eventName(): string;

  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
}
