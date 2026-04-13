import { describe, it, expect } from 'vitest';
import { StuckDetector } from '../../src/collectors/stuck-detector';

describe('StuckDetector', () => {
  it('should detect agent inactivity > N minutes', () => {
    const detector = new StuckDetector();
    detector.setStuckThreshold(5 * 60 * 1000); // 5 minutes
    const activityTimes = new Map<string, Date>();
    activityTimes.set('agent-1', new Date(Date.now() - 10 * 60 * 1000)); // 10 min ago
    activityTimes.set('agent-2', new Date(Date.now() - 1 * 60 * 1000)); // 1 min ago

    const stuck = detector.checkStuckAgents(activityTimes);
    expect(stuck).toContain('agent-1');
    expect(stuck).not.toContain('agent-2');
  });

  it('should distinguish stuck from slow', () => {
    const detector = new StuckDetector();
    detector.setStuckThreshold(5 * 60 * 1000);
    const activityTimes = new Map<string, Date>();
    // Agent with recent activity (slow but not stuck)
    activityTimes.set('agent-1', new Date(Date.now() - 2 * 60 * 1000)); // 2 min ago
    // Agent with no recent activity (stuck)
    activityTimes.set('agent-2', new Date(Date.now() - 8 * 60 * 1000)); // 8 min ago

    const stuck = detector.checkStuckAgents(activityTimes);
    expect(stuck).not.toContain('agent-1');
    expect(stuck).toContain('agent-2');
  });

  it('should set custom stuck threshold', () => {
    const detector = new StuckDetector();
    detector.setStuckThreshold(1000); // 1 second
    expect(detector.getStuckThreshold()).toBe(1000);

    const activityTimes = new Map<string, Date>();
    activityTimes.set('agent-1', new Date(Date.now() - 2000)); // 2 seconds ago

    const stuck = detector.checkStuckAgents(activityTimes);
    expect(stuck).toContain('agent-1');
  });

  it('should return empty array when no agents are stuck', () => {
    const detector = new StuckDetector();
    const activityTimes = new Map<string, Date>();
    activityTimes.set('agent-1', new Date()); // just now

    const stuck = detector.checkStuckAgents(activityTimes);
    expect(stuck).toHaveLength(0);
  });
});
