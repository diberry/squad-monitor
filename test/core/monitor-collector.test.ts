import { describe, it, expect } from 'vitest';
import { MonitorCollector } from '../../src/core/monitor-collector';

describe('MonitorCollector', () => {
  it('should initialize with empty agent statuses', () => {
    const collector = new MonitorCollector();
    expect(collector.getAgentStatuses()).toHaveLength(0);
  });

  it('should track agent idle → working → completed transition', () => {
    // Test state machine transitions
  });

  it('should expose current agent statuses', () => {
    // Test getAgentStatuses returns correct format
  });
});
