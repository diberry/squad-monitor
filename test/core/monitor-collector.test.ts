import { describe, it, expect } from 'vitest';
import { MonitorCollector } from '../../src/core/monitor-collector';
import { EventBusCollector } from '../../src/core/eventbus-collector';
import { AgentState, EventType } from '../../src/core/types';

describe('MonitorCollector', () => {
  it('should initialize with empty agent statuses', () => {
    const collector = new MonitorCollector();
    expect(collector.getAgentStatuses()).toHaveLength(0);
  });

  it('should track agent idle → working → completed transition', () => {
    const collector = new MonitorCollector();
    collector.updateAgentState('agent-1', AgentState.IDLE);
    expect(collector.getAgentStatus('agent-1')?.state).toBe(AgentState.IDLE);

    collector.updateAgentState('agent-1', AgentState.WORKING, 'fixing bug #42');
    expect(collector.getAgentStatus('agent-1')?.state).toBe(AgentState.WORKING);
    expect(collector.getAgentStatus('agent-1')?.currentTask).toBe('fixing bug #42');

    collector.updateAgentState('agent-1', AgentState.COMPLETED);
    expect(collector.getAgentStatus('agent-1')?.state).toBe(AgentState.COMPLETED);

    const history = collector.getStateHistory('agent-1');
    expect(history).toHaveLength(3);
    expect(history[0].state).toBe(AgentState.IDLE);
    expect(history[1].state).toBe(AgentState.WORKING);
    expect(history[2].state).toBe(AgentState.COMPLETED);
  });

  it('should expose current agent statuses', () => {
    const collector = new MonitorCollector();
    collector.updateAgentState('agent-1', AgentState.WORKING, 'task A');
    collector.updateAgentState('agent-2', AgentState.IDLE);

    const statuses = collector.getAgentStatuses();
    expect(statuses).toHaveLength(2);
    expect(statuses.find(s => s.agentId === 'agent-1')?.state).toBe(AgentState.WORKING);
    expect(statuses.find(s => s.agentId === 'agent-2')?.state).toBe(AgentState.IDLE);
  });

  it('should subscribe to EventBus for agent events', () => {
    const eventBus = new EventBusCollector();
    eventBus.start();
    const collector = new MonitorCollector();
    collector.subscribeToEventBus(eventBus);

    eventBus.emit({ type: EventType.AGENT_WORKING, agentId: 'agent-1', data: { task: 'deploy' } });
    expect(collector.getAgentStatus('agent-1')?.state).toBe(AgentState.WORKING);
    expect(collector.getAgentStatus('agent-1')?.currentTask).toBe('deploy');

    collector.cleanup();
  });

  it('should track duration between state changes', () => {
    const collector = new MonitorCollector();
    collector.updateAgentState('agent-1', AgentState.IDLE);
    const status = collector.getAgentStatus('agent-1');
    expect(status?.duration).toBeDefined();
    expect(typeof status?.duration).toBe('number');
  });
});
