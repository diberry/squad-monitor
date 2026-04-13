// Monitor collector - tracks agent statuses and state transitions

import { AgentState, AgentStatus, EventType } from './types';
import { EventBusCollector } from './eventbus-collector';

export class MonitorCollector {
  private agentStatuses: Map<string, AgentStatus> = new Map();
  private stateHistory: Map<string, Array<{ state: AgentState; timestamp: Date }>> = new Map();
  private unsubscribers: Array<() => void> = [];

  subscribeToEventBus(eventBus: EventBusCollector): void {
    const agentEvents = [
      EventType.AGENT_IDLE,
      EventType.AGENT_WORKING,
      EventType.AGENT_COMPLETED,
      EventType.AGENT_FAILED,
    ];

    for (const eventType of agentEvents) {
      const unsub = eventBus.subscribe(eventType, (event) => {
        if (event.agentId) {
          const stateMap: Record<string, AgentState> = {
            [EventType.AGENT_IDLE]: AgentState.IDLE,
            [EventType.AGENT_WORKING]: AgentState.WORKING,
            [EventType.AGENT_COMPLETED]: AgentState.COMPLETED,
            [EventType.AGENT_FAILED]: AgentState.FAILED,
          };
          const task = (event.data?.task as string) ?? '';
          this.updateAgentState(event.agentId, stateMap[event.type], task);
        }
      });
      this.unsubscribers.push(unsub);
    }
  }

  cleanup(): void {
    for (const unsub of this.unsubscribers) {
      unsub();
    }
    this.unsubscribers = [];
  }

  getAgentStatuses(): AgentStatus[] {
    return Array.from(this.agentStatuses.values());
  }

  getAgentStatus(agentId: string): AgentStatus | undefined {
    return this.agentStatuses.get(agentId);
  }

  getStateHistory(agentId: string): Array<{ state: AgentState; timestamp: Date }> {
    return this.stateHistory.get(agentId) ?? [];
  }

  updateAgentState(agentId: string, state: AgentState, currentTask: string = ''): void {
    const now = new Date();
    const existing = this.agentStatuses.get(agentId);
    const duration = existing
      ? now.getTime() - existing.lastActivityTime.getTime()
      : 0;

    this.agentStatuses.set(agentId, {
      agentId,
      state,
      duration,
      currentTask,
      lastActivityTime: now,
    });

    // Track state history
    if (!this.stateHistory.has(agentId)) {
      this.stateHistory.set(agentId, []);
    }
    this.stateHistory.get(agentId)!.push({ state, timestamp: now });
  }
}
