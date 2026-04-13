// Monitor collector - tracks agent statuses and state transitions

import { AgentState, AgentStatus } from './types';

export class MonitorCollector {
  private agentStatuses: Map<string, AgentStatus> = new Map();

  getAgentStatuses(): AgentStatus[] {
    return Array.from(this.agentStatuses.values());
  }

  getAgentStatus(agentId: string): AgentStatus | undefined {
    return this.agentStatuses.get(agentId);
  }

  private updateAgentState(agentId: string, state: AgentState): void {
    // Update agent state and timestamp
  }
}
