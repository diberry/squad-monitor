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

  updateHealth(agentId: string, health: Partial<HealthStatus>): void {
    // Update agent health status
  }
}
