import { describe, it, expect } from 'vitest';
import { HealthIndicatorFormatter } from '../../../src/renderers/formatters/health-indicator';
import { HealthStatus } from '../../../src/core/types';

describe('HealthIndicatorFormatter', () => {
  it('should format health indicators for display', () => {
    const formatter = new HealthIndicatorFormatter();
    const health: HealthStatus[] = [
      { agentId: 'agent-1', circuitBreakerOpen: false, rateLimited: false, errorCount: 0 },
    ];
    const output = formatter.format(health);
    expect(output).toContain('Health Indicators');
    expect(output).toContain('agent-1');
    expect(output).toContain('🟢');
  });

  it('should show circuit breaker and rate limit status', () => {
    const formatter = new HealthIndicatorFormatter();
    const health: HealthStatus[] = [
      { agentId: 'agent-1', circuitBreakerOpen: true, rateLimited: false, errorCount: 5, lastError: new Date() },
      { agentId: 'agent-2', circuitBreakerOpen: false, rateLimited: true, errorCount: 2 },
      { agentId: 'agent-3', circuitBreakerOpen: false, rateLimited: false, errorCount: 0 },
    ];
    const output = formatter.format(health);
    expect(output).toContain('🔴'); // circuit-open
    expect(output).toContain('🟡'); // rate-limited
    expect(output).toContain('🟢'); // healthy
    expect(output).toContain('circuit-open');
    expect(output).toContain('rate-limited');
  });

  it('should handle empty health data', () => {
    const formatter = new HealthIndicatorFormatter();
    const output = formatter.format([]);
    expect(output).toContain('No health data');
  });
});
