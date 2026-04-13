// Health collector - tracks agent health indicators from RalphMonitor

import { HealthStatus } from '../core/types';

export class HealthCollector {
  private health: Map<string, HealthStatus> = new Map();

  getAgentHealth(agentId: string): HealthStatus | undefined {
    return this.health.get(agentId);
  }

  getAllHealth(): HealthStatus[] {
    return Array.from(this.health.values());
  }

  updateHealth(agentId: string, update: Partial<HealthStatus>): void {
    const existing = this.health.get(agentId) ?? {
      agentId,
      circuitBreakerOpen: false,
      rateLimited: false,
      errorCount: 0,
    };
    this.health.set(agentId, { ...existing, ...update, agentId });
  }

  markRateLimited(agentId: string, limited: boolean = true): void {
    this.updateHealth(agentId, { rateLimited: limited });
  }

  markCircuitBreakerOpen(agentId: string, open: boolean = true): void {
    this.updateHealth(agentId, { circuitBreakerOpen: open });
  }

  incrementErrorCount(agentId: string): void {
    const existing = this.health.get(agentId);
    const errorCount = (existing?.errorCount ?? 0) + 1;
    this.updateHealth(agentId, { errorCount, lastError: new Date() });
  }
}
