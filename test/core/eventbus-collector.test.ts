import { describe, it, expect } from 'vitest';
import { EventBusCollector } from '../../src/core/eventbus-collector';
import { EventType } from '../../src/core/types';

describe('EventBusCollector', () => {
  it('should initialize EventBus collector', () => {
    const collector = new EventBusCollector();
    expect(collector).toBeDefined();
    expect(collector.isRunning()).toBe(false);
  });

  it('should subscribe to agent lifecycle events', () => {
    const collector = new EventBusCollector();
    collector.start();
    const events: string[] = [];
    collector.subscribe(EventType.AGENT_WORKING, (event) => {
      events.push(event.type);
    });
    collector.emit({ type: EventType.AGENT_WORKING, agentId: 'agent-1' });
    expect(events).toEqual([EventType.AGENT_WORKING]);
  });

  it('should handle start and stop', () => {
    const collector = new EventBusCollector();
    expect(collector.isRunning()).toBe(false);
    collector.start();
    expect(collector.isRunning()).toBe(true);
    collector.stop();
    expect(collector.isRunning()).toBe(false);
  });

  it('should not emit events when stopped', () => {
    const collector = new EventBusCollector();
    const events: string[] = [];
    collector.subscribe(EventType.AGENT_IDLE, (event) => {
      events.push(event.type);
    });
    // Not started, so emit should not deliver
    collector.emit({ type: EventType.AGENT_IDLE, agentId: 'agent-1' });
    expect(events).toHaveLength(0);
  });

  it('should support wildcard subscriptions', () => {
    const collector = new EventBusCollector();
    collector.start();
    const events: string[] = [];
    collector.subscribe('*', (event) => {
      events.push(event.type);
    });
    collector.emit({ type: EventType.AGENT_IDLE, agentId: 'agent-1' });
    collector.emit({ type: EventType.AGENT_WORKING, agentId: 'agent-1' });
    expect(events).toHaveLength(2);
  });

  it('should return unsubscribe function', () => {
    const collector = new EventBusCollector();
    collector.start();
    const events: string[] = [];
    const unsub = collector.subscribe(EventType.ERROR, (event) => {
      events.push(event.type);
    });
    collector.emit({ type: EventType.ERROR, agentId: 'agent-1' });
    expect(events).toHaveLength(1);
    unsub();
    collector.emit({ type: EventType.ERROR, agentId: 'agent-1' });
    expect(events).toHaveLength(1); // Should not increase after unsub
  });

  it('should track subscription count', () => {
    const collector = new EventBusCollector();
    expect(collector.getSubscriptionCount()).toBe(0);
    collector.subscribe(EventType.AGENT_IDLE, () => {});
    collector.subscribe(EventType.AGENT_WORKING, () => {});
    expect(collector.getSubscriptionCount()).toBe(2);
    expect(collector.getSubscriptionCount(EventType.AGENT_IDLE)).toBe(1);
  });
});
