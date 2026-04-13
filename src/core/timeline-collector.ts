// Timeline collector - tracks all significant events chronologically

import { TimelineEntry, EventType } from './types';
import { EventBusCollector } from './eventbus-collector';

export class TimelineCollector {
  private entries: TimelineEntry[] = [];
  private maxSize: number;
  private unsubscribe?: () => void;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }

  subscribeToEventBus(eventBus: EventBusCollector): void {
    this.unsubscribe = eventBus.subscribe('*', (event) => {
      this.addEntry({
        timestamp: new Date(),
        type: event.type,
        agentId: event.agentId,
        message: this.formatMessage(event.type, event.agentId, event.data),
        metadata: event.data,
      });
    });
  }

  cleanup(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  addEntry(entry: TimelineEntry): void {
    this.entries.push(entry);
    // Maintain circular buffer - drop oldest when exceeding maxSize
    if (this.entries.length > this.maxSize) {
      this.entries = this.entries.slice(this.entries.length - this.maxSize);
    }
  }

  getTimeline(options?: { type?: EventType; limit?: number }): TimelineEntry[] {
    let result = [...this.entries];

    if (options?.type) {
      result = result.filter(e => e.type === options.type);
    }

    if (options?.limit) {
      result = result.slice(-options.limit);
    }

    return result;
  }

  getEntryCount(): number {
    return this.entries.length;
  }

  clear(): void {
    this.entries = [];
  }

  private formatMessage(type: EventType, agentId?: string, data?: Record<string, unknown>): string {
    const agent = agentId ? ` [${agentId}]` : '';
    const detail = data?.message ? `: ${data.message}` : '';
    return `${type}${agent}${detail}`;
  }
}
