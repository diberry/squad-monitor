import { describe, it, expect } from 'vitest';
import { DecisionCollector } from '../../src/collectors/decision-collector';
import { Decision } from '../../src/core/types';

describe('DecisionCollector', () => {
  const makeDecision = (overrides: Partial<Decision> = {}): Decision => ({
    id: 'D-1',
    title: 'Use JWT auth',
    timestamp: new Date('2024-01-15T10:00:00Z'),
    author: 'architect',
    status: 'accepted',
    ...overrides,
  });

  it('should collect decisions from SquadState', () => {
    const collector = new DecisionCollector();
    const decisions = [makeDecision({ id: 'D-1' }), makeDecision({ id: 'D-2', title: 'Use PostgreSQL' })];
    collector.loadDecisions(decisions);
    expect(collector.getDecisionCount()).toBe(2);
  });

  it('should subscribe to decision change events', () => {
    const collector = new DecisionCollector();
    collector.addDecision(makeDecision({ id: 'D-1' }));
    expect(collector.getDecisionCount()).toBe(1);
    expect(collector.getDecisionById('D-1')?.title).toBe('Use JWT auth');
  });

  it('should maintain ordered decision feed', () => {
    const collector = new DecisionCollector();
    collector.loadDecisions([
      makeDecision({ id: 'D-1', timestamp: new Date('2024-01-01T10:00:00Z') }),
      makeDecision({ id: 'D-3', timestamp: new Date('2024-01-03T10:00:00Z') }),
      makeDecision({ id: 'D-2', timestamp: new Date('2024-01-02T10:00:00Z') }),
    ]);
    const feed = collector.getDecisionFeed();
    expect(feed[0].id).toBe('D-3'); // newest first
    expect(feed[1].id).toBe('D-2');
    expect(feed[2].id).toBe('D-1');
  });

  it('should add new decisions', () => {
    const collector = new DecisionCollector();
    collector.addDecision(makeDecision({ id: 'D-1' }));
    collector.addDecision(makeDecision({ id: 'D-2', title: 'Use REST' }));
    expect(collector.getDecisionCount()).toBe(2);
  });
});
