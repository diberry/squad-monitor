import { describe, it, expect } from 'vitest';
import { TimelineCollector } from '../../src/core/timeline-collector';
import { EventType } from '../../src/core/types';

describe('TimelineCollector', () => {
  it('should create timeline entry for each significant event', () => {
    const collector = new TimelineCollector();
    collector.addEntry({
      timestamp: new Date(),
      type: EventType.AGENT_WORKING,
      agentId: 'agent-1',
      message: 'Agent started working',
    });
    const timeline = collector.getTimeline();
    expect(timeline).toHaveLength(1);
    expect(timeline[0].type).toBe(EventType.AGENT_WORKING);
    expect(timeline[0].agentId).toBe('agent-1');
  });

  it('should filter events by type', () => {
    const collector = new TimelineCollector();
    collector.addEntry({ timestamp: new Date(), type: EventType.AGENT_IDLE, agentId: 'a1', message: 'idle' });
    collector.addEntry({ timestamp: new Date(), type: EventType.AGENT_WORKING, agentId: 'a1', message: 'working' });
    collector.addEntry({ timestamp: new Date(), type: EventType.AGENT_IDLE, agentId: 'a2', message: 'idle' });

    const filtered = collector.getTimeline({ type: EventType.AGENT_IDLE });
    expect(filtered).toHaveLength(2);
    filtered.forEach(e => expect(e.type).toBe(EventType.AGENT_IDLE));
  });

  it('should maintain scrollable history with limit', () => {
    const collector = new TimelineCollector(100);
    for (let i = 0; i < 200; i++) {
      collector.addEntry({
        timestamp: new Date(),
        type: EventType.AGENT_WORKING,
        message: `event-${i}`,
      });
    }
    // Circular buffer should cap at maxSize
    expect(collector.getEntryCount()).toBe(100);
    // Last entries should be the most recent
    const timeline = collector.getTimeline({ limit: 5 });
    expect(timeline).toHaveLength(5);
    expect(timeline[4].message).toContain('event-199');
  });

  it('should support limit parameter', () => {
    const collector = new TimelineCollector();
    for (let i = 0; i < 100; i++) {
      collector.addEntry({ timestamp: new Date(), type: EventType.AGENT_IDLE, message: `event ${i}` });
    }
    const limited = collector.getTimeline({ limit: 10 });
    expect(limited).toHaveLength(10);
  });

  it('should clear timeline', () => {
    const collector = new TimelineCollector();
    collector.addEntry({ timestamp: new Date(), type: EventType.ERROR, message: 'error' });
    expect(collector.getTimeline()).toHaveLength(1);
    collector.clear();
    expect(collector.getTimeline()).toHaveLength(0);
  });
});
