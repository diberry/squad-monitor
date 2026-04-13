import { describe, it, expect } from 'vitest';
import { AgentState, WorkItemStatus, EventType, AgentStatus, WorkItem, Decision, CostData, HealthStatus, FileChange } from '../../src/core/types';

describe('Types', () => {
  it('should define AgentState enum', () => {
    expect(AgentState.IDLE).toBe('idle');
    expect(AgentState.WORKING).toBe('working');
    expect(AgentState.COMPLETED).toBe('completed');
    expect(AgentState.FAILED).toBe('failed');
  });

  it('should define WorkItemStatus enum', () => {
    expect(WorkItemStatus.OPEN).toBe('open');
    expect(WorkItemStatus.IN_PROGRESS).toBe('in_progress');
    expect(WorkItemStatus.COMPLETED).toBe('completed');
    expect(WorkItemStatus.BLOCKED).toBe('blocked');
  });

  it('should define EventType enum', () => {
    expect(EventType.AGENT_IDLE).toBe('agent_idle');
    expect(EventType.AGENT_WORKING).toBe('agent_working');
    expect(EventType.AGENT_COMPLETED).toBe('agent_completed');
    expect(EventType.AGENT_FAILED).toBe('agent_failed');
    expect(EventType.DECISION_MADE).toBe('decision_made');
    expect(EventType.WORK_ITEM_UPDATED).toBe('work_item_updated');
    expect(EventType.ERROR).toBe('error');
    expect(EventType.AGENT_STUCK).toBe('agent_stuck');
  });

  it('should support AgentStatus interface', () => {
    const status: AgentStatus = {
      agentId: 'agent-1',
      state: AgentState.WORKING,
      duration: 5000,
      currentTask: 'fixing bug',
      lastActivityTime: new Date(),
    };
    expect(status.agentId).toBe('agent-1');
    expect(status.state).toBe(AgentState.WORKING);
  });

  it('should support WorkItem interface', () => {
    const item: WorkItem = {
      id: 'WI-1',
      title: 'Fix login',
      assigneeAgent: 'agent-1',
      status: WorkItemStatus.IN_PROGRESS,
      createdAt: new Date(),
      updatedAt: new Date(),
      platform: 'github',
    };
    expect(item.platform).toBe('github');
  });

  it('should support Decision interface', () => {
    const decision: Decision = {
      id: 'D-1',
      title: 'Use JWT auth',
      timestamp: new Date(),
      author: 'architect',
      status: 'accepted',
    };
    expect(decision.author).toBe('architect');
  });

  it('should support CostData interface', () => {
    const cost: CostData = {
      agentId: 'agent-1',
      tokens: 1500,
      estimatedCost: 0.015,
      startTime: new Date(),
      duration: 60000,
    };
    expect(cost.tokens).toBe(1500);
  });

  it('should support HealthStatus interface', () => {
    const health: HealthStatus = {
      agentId: 'agent-1',
      circuitBreakerOpen: false,
      rateLimited: true,
      errorCount: 3,
      lastError: new Date(),
    };
    expect(health.rateLimited).toBe(true);
  });

  it('should support FileChange interface', () => {
    const change: FileChange = {
      filepath: 'src/main.ts',
      agentId: 'agent-1',
      timestamp: new Date(),
      changeType: 'modify',
    };
    expect(change.changeType).toBe('modify');
  });
});
