export interface Event {
  id: string;
  type: string;
  payload: any;
  timestamp: Date;
}

export class EventBus {
  private subscribers: Map<string, Array<(event: Event) => void>> = new Map();

  publish(event: Event): void {
    const handlers = this.subscribers.get(event.type) || [];
    handlers.forEach(handler => handler(event));
  }

  subscribe(eventType: string, handler: (event: Event) => void): void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType)?.push(handler);
  }
}

export const eventBus = new EventBus();