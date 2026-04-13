// Main orchestrator - TeamActivityMonitor coordinates all components

import { MonitorCollector } from './core/monitor-collector';
import { WorkItemCollector } from './collectors/work-item-collector';
import { DecisionCollector } from './collectors/decision-collector';
import { TimelineCollector } from './core/timeline-collector';
import { EventBusCollector } from './core/eventbus-collector';
import { TerminalRenderer } from './renderers/terminal-renderer';

export class TeamActivityMonitor {
  private monitorCollector: MonitorCollector;
  private workItemCollector: WorkItemCollector;
  private decisionCollector: DecisionCollector;
  private timelineCollector: TimelineCollector;
  private eventBusCollector: EventBusCollector;
  private terminalRenderer: TerminalRenderer;
  private renderInterval?: ReturnType<typeof setInterval>;
  private running = false;
  private signalHandlers: Array<{ signal: string; handler: () => void }> = [];

  constructor() {
    this.monitorCollector = new MonitorCollector();
    this.workItemCollector = new WorkItemCollector();
    this.decisionCollector = new DecisionCollector();
    this.timelineCollector = new TimelineCollector();
    this.eventBusCollector = new EventBusCollector();
    this.terminalRenderer = new TerminalRenderer(
      this.monitorCollector,
      this.workItemCollector,
      this.decisionCollector,
      this.timelineCollector,
    );
  }

  getMonitorCollector(): MonitorCollector { return this.monitorCollector; }
  getWorkItemCollector(): WorkItemCollector { return this.workItemCollector; }
  getDecisionCollector(): DecisionCollector { return this.decisionCollector; }
  getTimelineCollector(): TimelineCollector { return this.timelineCollector; }
  getEventBusCollector(): EventBusCollector { return this.eventBusCollector; }
  getTerminalRenderer(): TerminalRenderer { return this.terminalRenderer; }
  isRunning(): boolean { return this.running; }

  async start(): Promise<void> {
    this.eventBusCollector.start();
    this.monitorCollector.subscribeToEventBus(this.eventBusCollector);
    this.timelineCollector.subscribeToEventBus(this.eventBusCollector);
    this.setupSignalHandlers();
    this.running = true;

    // Start render loop at 1s interval
    this.renderInterval = setInterval(() => {
      this.render();
    }, 1000);
  }

  stop(): void {
    this.running = false;
    if (this.renderInterval) {
      clearInterval(this.renderInterval);
      this.renderInterval = undefined;
    }
    this.eventBusCollector.stop();
    this.monitorCollector.cleanup();
    this.timelineCollector.cleanup();
    this.removeSignalHandlers();
  }

  private setupSignalHandlers(): void {
    const handler = () => { this.stop(); };
    this.signalHandlers.push({ signal: 'SIGINT', handler });
    process.on('SIGINT', handler);
  }

  private removeSignalHandlers(): void {
    for (const { signal, handler } of this.signalHandlers) {
      process.removeListener(signal, handler);
    }
    this.signalHandlers = [];
  }

  render(): string {
    const output = this.terminalRenderer.render();
    console.log(output);
    return output;
  }
}
