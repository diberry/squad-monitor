import { describe, it, expect, afterEach } from 'vitest';
import { TeamActivityMonitor } from '../src/monitor';

describe('TeamActivityMonitor', () => {
  let monitor: TeamActivityMonitor;

  afterEach(() => {
    if (monitor) {
      monitor.stop();
    }
  });

  it('should initialize with all collectors', () => {
    monitor = new TeamActivityMonitor();
    expect(monitor).toBeDefined();
    expect(monitor.getMonitorCollector()).toBeDefined();
    expect(monitor.getWorkItemCollector()).toBeDefined();
    expect(monitor.getDecisionCollector()).toBeDefined();
    expect(monitor.getTimelineCollector()).toBeDefined();
    expect(monitor.getEventBusCollector()).toBeDefined();
    expect(monitor.getTerminalRenderer()).toBeDefined();
  });

  it('should start monitor with all collectors', async () => {
    monitor = new TeamActivityMonitor();
    await monitor.start();
    expect(monitor.isRunning()).toBe(true);
    expect(monitor.getEventBusCollector().isRunning()).toBe(true);
  });

  it('should stop monitor and clean up subscriptions', async () => {
    monitor = new TeamActivityMonitor();
    await monitor.start();
    expect(monitor.isRunning()).toBe(true);
    monitor.stop();
    expect(monitor.isRunning()).toBe(false);
    expect(monitor.getEventBusCollector().isRunning()).toBe(false);
  });

  it('should handle graceful shutdown on signal', async () => {
    monitor = new TeamActivityMonitor();
    await monitor.start();
    expect(monitor.isRunning()).toBe(true);
    // Simulate stop (which is what signal handler calls)
    monitor.stop();
    expect(monitor.isRunning()).toBe(false);
  });

  it('should render dashboard on demand', async () => {
    monitor = new TeamActivityMonitor();
    await monitor.start();
    const output = monitor.render();
    expect(output).toContain('Team Activity Monitor Dashboard');
    expect(output).toContain('Agent Status Board');
  });
});
