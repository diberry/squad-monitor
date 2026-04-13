import { describe, it, expect } from 'vitest';
import { CostCollector } from '../../src/collectors/cost-collector';
import { CostData } from '../../src/core/types';

describe('CostCollector', () => {
  it('should track cost per agent', () => {
    const collector = new CostCollector();
    const costData: CostData = {
      agentId: 'agent-1',
      tokens: 1500,
      estimatedCost: 0.015,
      startTime: new Date(),
      duration: 60000,
    };
    collector.updateAgentCost(costData);
    const result = collector.getAgentCosts('agent-1');
    expect(result).toBeDefined();
    expect(result!.tokens).toBe(1500);
    expect(result!.estimatedCost).toBe(0.015);
  });

  it('should aggregate total session cost', () => {
    const collector = new CostCollector();
    collector.updateAgentCost({ agentId: 'agent-1', tokens: 1000, estimatedCost: 0.01, startTime: new Date(), duration: 30000 });
    collector.updateAgentCost({ agentId: 'agent-2', tokens: 2000, estimatedCost: 0.02, startTime: new Date(), duration: 45000 });
    expect(collector.getTotalCost()).toBeCloseTo(0.03);
    expect(collector.getTotalTokens()).toBe(3000);
  });

  it('should calculate cost per minute', () => {
    const collector = new CostCollector();
    collector.updateAgentCost({ agentId: 'agent-1', tokens: 600, estimatedCost: 0.006, startTime: new Date(), duration: 60000 });
    const rate = collector.getCostRate();
    expect(rate.tokensPerMin).toBeGreaterThanOrEqual(0);
    expect(rate.costPerMin).toBeGreaterThanOrEqual(0);
  });

  it('should return all costs', () => {
    const collector = new CostCollector();
    collector.updateAgentCost({ agentId: 'agent-1', tokens: 100, estimatedCost: 0.001, startTime: new Date(), duration: 1000 });
    collector.updateAgentCost({ agentId: 'agent-2', tokens: 200, estimatedCost: 0.002, startTime: new Date(), duration: 2000 });
    expect(collector.getAllCosts()).toHaveLength(2);
  });
});
