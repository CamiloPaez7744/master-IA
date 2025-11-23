import { EventBus } from '@application/ports/EventBus';
import { DomainEvent } from '@domain/events/DomainEvent';

/**
 * NoopEventBus
 * Implementación que no hace nada del EventBus
 * Útil para testing y desarrollo local
 */
export class NoopEventBus implements EventBus {
  async publish(_events: readonly DomainEvent[]): Promise<void> {
    // No-op: no hace nada con los eventos
    return Promise.resolve();
  }

  async publishOne(_event: DomainEvent): Promise<void> {
    // No-op: no hace nada con el evento
    return Promise.resolve();
  }
}