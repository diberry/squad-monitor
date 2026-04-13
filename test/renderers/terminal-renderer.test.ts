import { describe, it, expect } from 'vitest';
import { TerminalRenderer } from '../../src/renderers/terminal-renderer';
import { MonitorCollector } from '../../src/core/monitor-collector';
import { WorkItemCollector } from '../../src/collectors/work-item-collector';
import { DecisionCollector } from '../../src/collectors/decision-collector';
import { TimelineCollector } from '../../src/core/timeline-collector';
import { AgentState, WorkItemStatus, EventType } from '../../src/core/types';

describe('TerminalRenderer', () => {
  function createRenderer() {
    const monitorCollector = new MonitorCollector();
    const workItemCollector = new WorkItemCollector();
    const decisionCollector = new DecisionCollector();
    const timelineCollector = new TimelineCollector();
    return { renderer: new TerminalRenderer(monitorCollector, workItemCollector, decisionCollector, timelineCollector), monitorCollector, workItemCollector, decisionCollector, timelineCollector };
  }

  it('should initialize with all collectors', () => {
    const { renderer } = createRenderer();
    expect(renderer).toBeDefined();
  });

  it('should render complete dashboard', () => {
    const { renderer, monitorCollector, workItemCollector, decisionCollector, timelineCollector } = createRenderer();
    monitorCollector.updateAgentState('agent-1', AgentState.WORKING, 'coding');
    workItemCollector.loadWorkItems([{
      id: 'WI-1', title: 'Fix bug', assigneeAgent: 'agent-1', status: WorkItemStatus.OPEN,
      createdAt: new Date(), updatedAt: new Date(), platform: 'github',
    }]);
    decisionCollector.addDecision({ id: 'D-1', title: 'Use REST', timestamp: new Date(), author: 'lead', status: 'accepted' });
    timelineCollector.addEntry({ timestamp: new Date(), type: EventType.AGENT_WORKING, agentId: 'agent-1', message: 'Started' });

    const output = renderer.render();
    expect(output).toContain('Team Activity Monitor Dashboard');
    expect(output).toContain('Agent Status Board');
    expect(output).toContain('Work Item Tracker');
    expect(output).toContain('Decision Feed');
    expect(output).toContain('Session Timeline');
  });

  it('should render agent board section', () => {
    const { renderer, monitorCollector } = createRenderer();
    monitorCollector.updateAgentState('agent-1', AgentState.IDLE);
    const output = renderer.renderAgentBoard();
    expect(output).toContain('agent-1');
    expect(output).toContain('idle');
  });

  it('should render work tracker section', () => {
    const { renderer, workItemCollector } = createRenderer();
    workItemCollector.loadWorkItems([{
      id: 'GH-1', title: 'Test item', assigneeAgent: 'agent-1', status: WorkItemStatus.IN_PROGRESS,
      createdAt: new Date(), updatedAt: new Date(), platform: 'github',
    }]);
    const output = renderer.renderWorkTracker();
    expect(output).toContain('GH-1');
    expect(output).toContain('Test item');
  });

  it('should render decision feed section', () => {
    const { renderer, decisionCollector } = createRenderer();
    decisionCollector.addDecision({ id: 'D-1', title: 'Architecture call', timestamp: new Date(), author: 'team', status: 'pending' });
    const output = renderer.renderDecisionFeed();
    expect(output).toContain('Architecture call');
  });

  it('should render timeline section', () => {
    const { renderer, timelineCollector } = createRenderer();
    timelineCollector.addEntry({ timestamp: new Date(), type: EventType.DECISION_MADE, message: 'Decision logged' });
    const output = renderer.renderTimeline();
    expect(output).toContain('Decision logged');
  });
});
