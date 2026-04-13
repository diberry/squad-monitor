import { describe, it, expect } from 'vitest';
import { DecisionFeedFormatter } from '../../../src/renderers/formatters/decision-feed';
import { Decision } from '../../../src/core/types';

describe('DecisionFeedFormatter', () => {
  const makeDecision = (overrides: Partial<Decision> = {}): Decision => ({
    id: 'D-1',
    title: 'Use JWT auth',
    timestamp: new Date('2024-01-15T10:30:00Z'),
    author: 'architect',
    status: 'accepted',
    ...overrides,
  });

  it('should format decisions for terminal display', () => {
    const formatter = new DecisionFeedFormatter();
    const output = formatter.format([makeDecision()]);
    expect(output).toContain('Decision Feed');
    expect(output).toContain('Use JWT auth');
  });

  it('should include timestamp, title, author, status', () => {
    const formatter = new DecisionFeedFormatter();
    const output = formatter.format([makeDecision({ title: 'Use PostgreSQL', author: 'dba', status: 'pending' })]);
    expect(output).toContain('Use PostgreSQL');
    expect(output).toContain('dba');
    expect(output).toContain('pending');
  });

  it('should handle empty decisions', () => {
    const formatter = new DecisionFeedFormatter();
    const output = formatter.format([]);
    expect(output).toContain('No decisions');
  });
});
