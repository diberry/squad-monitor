import { describe, it, expect } from 'vitest';
import { TimelineFormatter } from '../../../src/renderers/formatters/timeline';
import { TimelineEntry, EventType } from '../../../src/core/types';

describe('TimelineFormatter', () => {
  const makeEntry = (overrides: Partial<TimelineEntry> = {}): TimelineEntry => ({
    timestamp: new Date('2024-01-15T10:30:00Z'),
    type: EventType.AGENT_WORKING,
    agentId: 'agent-1',
    message: 'Agent started working',
    ...overrides,
  });

  it('should format timeline entries for terminal display', () => {
    const formatter = new TimelineFormatter();
    const output = formatter.format([makeEntry()]);
    expect(output).toContain('Session Timeline');
    expect(output).toContain('Agent started working');
  });

  it('should include timestamp, event type, agent, message', () => {
    const formatter = new TimelineFormatter();
    const output = formatter.format([makeEntry({
      type: EventType.AGENT_COMPLETED,
      agentId: 'coder',
      message: 'Task finished',
    })]);
    expect(output).toContain('agent_completed');
    expect(output).toContain('coder');
    expect(output).toContain('Task finished');
  });

  it('should limit output to specified number of entries', () => {
    const formatter = new TimelineFormatter();
    const entries = Array.from({ length: 100 }, (_, i) =>
      makeEntry({ message: `event-${i}` })
    );
    const output = formatter.format(entries, 5);
    // Should only show last 5 entries
    expect(output).toContain('event-99');
    expect(output).toContain('event-95');
    expect(output).not.toContain('event-0');
  });

  it('should handle empty entries', () => {
    const formatter = new TimelineFormatter();
    const output = formatter.format([]);
    expect(output).toContain('No events');
  });
});
