#!/usr/bin/env node
// CLI entry point for squad-monitor

import { TeamActivityMonitor } from '../monitor.js';
import { EventType, WorkItemStatus } from '../core/types.js';

function loadSampleData(monitor: TeamActivityMonitor): void {
  const eventBus = monitor.getEventBusCollector();
  const workItems = monitor.getWorkItemCollector();
  const decisions = monitor.getDecisionCollector();

  // Seed work items
  const now = new Date();
  workItems.loadWorkItems([
    { id: '#42', title: 'Fix login validation', assigneeAgent: 'Agent-001', status: WorkItemStatus.IN_PROGRESS, createdAt: now, updatedAt: now, platform: 'github' },
    { id: '#41', title: 'Add auth tests', assigneeAgent: 'Agent-002', status: WorkItemStatus.OPEN, createdAt: now, updatedAt: now, platform: 'github' },
    { id: '#40', title: 'Refactor module A', assigneeAgent: 'Agent-003', status: WorkItemStatus.COMPLETED, createdAt: now, updatedAt: now, platform: 'github' },
  ]);

  // Seed decisions
  decisions.loadDecisions([
    { id: 'd1', title: 'Chose strategy: iterative_refine', timestamp: now, author: 'Agent-001', status: 'accepted' },
    { id: 'd2', title: 'Decision: refactor_module_A', timestamp: new Date(now.getTime() - 7000), author: 'Agent-003', status: 'accepted' },
  ]);

  // Emit agent events to populate the agent board and timeline
  eventBus.emit({ type: EventType.AGENT_WORKING, agentId: 'Agent-001', data: { task: 'Analyzing file' } });
  eventBus.emit({ type: EventType.AGENT_IDLE, agentId: 'Agent-002', data: { task: '' } });
  eventBus.emit({ type: EventType.AGENT_COMPLETED, agentId: 'Agent-003', data: { task: 'Done' } });
}

async function runStart(): Promise<void> {
  const monitor = new TeamActivityMonitor();
  await monitor.start();
  loadSampleData(monitor);

  // Print the dashboard to stdout on every render tick
  const interval = setInterval(() => {
    const output = monitor.render();
    console.log(output);
  }, 3000);

  // Also print once immediately
  console.log(monitor.render());

  const shutdown = (): void => {
    clearInterval(interval);
    monitor.stop();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

function runSnapshot(): void {
  const monitor = new TeamActivityMonitor();
  // Start the event bus so emits work, but skip the internal render loop
  monitor.getEventBusCollector().start();
  monitor.getMonitorCollector().subscribeToEventBus(monitor.getEventBusCollector());
  monitor.getTimelineCollector().subscribeToEventBus(monitor.getEventBusCollector());

  loadSampleData(monitor);
  console.log(monitor.render());

  monitor.stop();
}

const command = process.argv[2];

switch (command) {
  case 'start':
    runStart();
    break;
  case 'snapshot':
    runSnapshot();
    break;
  default:
    console.log('Usage: squad-monitor <command>');
    console.log('');
    console.log('Commands:');
    console.log('  start      Start the monitor with sample data (runs until Ctrl+C)');
    console.log('  snapshot   Render the dashboard once and exit');
    process.exit(command ? 1 : 0);
}
