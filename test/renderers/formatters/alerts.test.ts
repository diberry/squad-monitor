import { describe, it, expect } from 'vitest';
import { AlertsFormatter } from '../../../src/renderers/formatters/alerts';
import { StuckAlert } from '../../../src/core/types';

describe('AlertsFormatter', () => {
  it('should format alerts prominently', () => {
    const formatter = new AlertsFormatter();
    const alerts: StuckAlert[] = [
      { agentId: 'agent-1', duration: 10 * 60 * 1000, message: 'No activity for 10 minutes' },
    ];
    const output = formatter.format(alerts);
    expect(output).toContain('ALERTS');
    expect(output).toContain('agent-1');
    expect(output).toContain('STUCK');
  });

  it('should highlight stuck agent alerts', () => {
    const formatter = new AlertsFormatter();
    const alerts: StuckAlert[] = [
      { agentId: 'coder', duration: 15 * 60 * 1000, message: 'Stuck on task' },
    ];
    const output = formatter.format(alerts);
    expect(output).toContain('⚠️');
    expect(output).toContain('coder');
    expect(output).toContain('15m');
  });

  it('should return empty string for no alerts', () => {
    const formatter = new AlertsFormatter();
    const output = formatter.format([]);
    expect(output).toBe('');
  });
});
