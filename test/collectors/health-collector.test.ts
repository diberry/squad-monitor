import { describe, it, expect } from 'vitest';
import { HealthCollector } from '../../src/collectors/health-collector';

describe('HealthCollector', () => {
  it('should read health from RalphMonitor', () => {
    const collector = new HealthCollector();
    collector.updateHealth('agent-1', { circuitBreakerOpen: false, rateLimited: false, errorCount: 0 });
    const health = collector.getAgentHealth('agent-1');
    expect(health).toBeDefined();
    expect(health!.circuitBreakerOpen).toBe(false);
    expect(health!.rateLimited).toBe(false);
  });

  it('should detect rate limit conditions', () => {
    const collector = new HealthCollector();
    collector.markRateLimited('agent-1', true);
    const health = collector.getAgentHealth('agent-1');
    expect(health!.rateLimited).toBe(true);

    collector.markRateLimited('agent-1', false);
    expect(collector.getAgentHealth('agent-1')!.rateLimited).toBe(false);
  });

  it('should track circuit breaker state', () => {
    const collector = new HealthCollector();
    collector.markCircuitBreakerOpen('agent-1', true);
    expect(collector.getAgentHealth('agent-1')!.circuitBreakerOpen).toBe(true);

    collector.markCircuitBreakerOpen('agent-1', false);
    expect(collector.getAgentHealth('agent-1')!.circuitBreakerOpen).toBe(false);
  });

  it('should get all health statuses', () => {
    const collector = new HealthCollector();
    collector.updateHealth('agent-1', { circuitBreakerOpen: false, rateLimited: false, errorCount: 0 });
    collector.updateHealth('agent-2', { circuitBreakerOpen: true, rateLimited: false, errorCount: 5 });
    const all = collector.getAllHealth();
    expect(all).toHaveLength(2);
  });

  it('should increment error count', () => {
    const collector = new HealthCollector();
    collector.incrementErrorCount('agent-1');
    collector.incrementErrorCount('agent-1');
    collector.incrementErrorCount('agent-1');
    expect(collector.getAgentHealth('agent-1')!.errorCount).toBe(3);
    expect(collector.getAgentHealth('agent-1')!.lastError).toBeDefined();
  });
});
