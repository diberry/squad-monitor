import { describe, it, expect } from 'vitest';
import { CostTickerFormatter } from '../../../src/renderers/formatters/cost-ticker';
import { CostData } from '../../../src/core/types';

describe('CostTickerFormatter', () => {
  it('should format cost ticker for display', () => {
    const formatter = new CostTickerFormatter();
    const costs: CostData[] = [
      { agentId: 'agent-1', tokens: 1500, estimatedCost: 0.015, startTime: new Date(), duration: 60000 },
    ];
    const output = formatter.format(costs);
    expect(output).toContain('Cost Ticker');
    expect(output).toContain('$');
    expect(output).toContain('tokens/min');
  });

  it('should show total cost, rate, budget remaining', () => {
    const formatter = new CostTickerFormatter();
    const costs: CostData[] = [
      { agentId: 'agent-1', tokens: 1000, estimatedCost: 0.01, startTime: new Date(), duration: 60000 },
      { agentId: 'agent-2', tokens: 2000, estimatedCost: 0.02, startTime: new Date(), duration: 60000 },
    ];
    const output = formatter.format(costs, 1.0);
    expect(output).toContain('Total');
    expect(output).toContain('Rate');
    expect(output).toContain('Budget remaining');
  });

  it('should handle empty costs', () => {
    const formatter = new CostTickerFormatter();
    const output = formatter.format([]);
    expect(output).toContain('No cost data');
  });
});
