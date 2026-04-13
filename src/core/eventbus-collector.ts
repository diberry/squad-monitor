// EventBus collector - subscribes to SDK EventBus and maintains state

import { EventType } from './types';

export type EventHandler = (event: { type: EventType; agentId?: string; data?: Record<string, unknown> }) => void;

export interface EventBusEvent {
  type: EventType;
  agentId?: string;
  data?: Record<string, unknown>;
}

export class EventBusCollector {
  private handlers: Map<string, Set<EventHandler>> = new Map();
  private running = false;

  constructor() {
    // Initialize handler registry
  }

  start(): void {
    this.running = true;
  }

  stop(): void {
    this.running = false;
    this.handlers.clear();
  }

  isRunning(): boolean {
    return this.running;
  }

  subscribe(eventType: EventType | '*', handler: EventHandler): () => void {
    const key = eventType;
    if (!this.handlers.has(key)) {
      this.handlers.set(key, new Set());
    }
    this.handlers.get(key)!.add(handler);

    // Return unsubscribe function
    return () => {
      const set = this.handlers.get(key);
      if (set) {
        set.delete(handler);
      }
    };
  }

  emit(event: EventBusEvent): void {
    if (!this.running) return;

    // Notify specific type handlers
    const typeHandlers = this.handlers.get(event.type);
    if (typeHandlers) {
      for (const handler of typeHandlers) {
        handler(event);
      }
    }

    // Notify wildcard handlers
    const wildcardHandlers = this.handlers.get('*');
    if (wildcardHandlers) {
      for (const handler of wildcardHandlers) {
        handler(event);
      }
    }
  }

  getSubscriptionCount(eventType?: EventType | '*'): number {
    if (eventType) {
      return this.handlers.get(eventType)?.size ?? 0;
    }
    let total = 0;
    for (const set of this.handlers.values()) {
      total += set.size;
    }
    return total;
  }
}
