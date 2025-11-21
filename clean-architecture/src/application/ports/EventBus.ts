import { DomainEvent } from '../../domain/events/DomainEvent';

/**
 * EventBus Port
 * Define el contrato para publicar eventos de dominio
 * La infraestructura debe implementar esta interfaz
 */
export interface EventBus {
  /**
   * Publica uno o más eventos de dominio
   * @throws InfraError si hay un problema publicando los eventos
   */
  publish(events: readonly DomainEvent[]): Promise<void>;

  /**
   * Publica un único evento de dominio
   * @throws InfraError si hay un problema publicando el evento
   */
  publishOne(event: DomainEvent): Promise<void>;
}
