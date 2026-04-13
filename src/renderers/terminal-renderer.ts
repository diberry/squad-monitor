// Terminal renderer - orchestrates all formatters into unified dashboard

import { MonitorCollector } from '../core/monitor-collector';
import { WorkItemCollector } from '../collectors/work-item-collector';
import { DecisionCollector } from '../collectors/decision-collector';
import { TimelineCollector } from '../core/timeline-collector';
import { AgentBoardFormatter } from './formatters/agent-board';
import { WorkTrackerFormatter } from './formatters/work-tracker';
import { DecisionFeedFormatter } from './formatters/decision-feed';
import { TimelineFormatter } from './formatters/timeline';
import { AnsiUtils } from './ansi-utils';

export class TerminalRenderer {
  private agentBoardFormatter: AgentBoardFormatter;
  private workTrackerFormatter: WorkTrackerFormatter;
  private decisionFeedFormatter: DecisionFeedFormatter;
  private timelineFormatter: TimelineFormatter;

  constructor(
    private monitorCollector: MonitorCollector,
    private workItemCollector: WorkItemCollector,
    private decisionCollector: DecisionCollector,
    private timelineCollector: TimelineCollector,
  ) {
    this.agentBoardFormatter = new AgentBoardFormatter();
    this.workTrackerFormatter = new WorkTrackerFormatter();
    this.decisionFeedFormatter = new DecisionFeedFormatter();
    this.timelineFormatter = new TimelineFormatter();
  }

  render(): string {
    const sections = [
      AnsiUtils.clearScreen(),
      AnsiUtils.bold('╔══════════════════════════════════════════╗'),
      AnsiUtils.bold('║     Team Activity Monitor Dashboard      ║'),
      AnsiUtils.bold('╚══════════════════════════════════════════╝'),
      '',
      this.renderAgentBoard(),
      this.renderWorkTracker(),
      this.renderDecisionFeed(),
      this.renderTimeline(),
    ];
    return sections.join('\n');
  }

  renderAgentBoard(): string {
    const agents = this.monitorCollector.getAgentStatuses();
    return this.agentBoardFormatter.format(agents);
  }

  renderWorkTracker(): string {
    const items = this.workItemCollector.getWorkItems();
    return this.workTrackerFormatter.format(items);
  }

  renderDecisionFeed(): string {
    const decisions = this.decisionCollector.getDecisionFeed();
    return this.decisionFeedFormatter.format(decisions);
  }

  renderTimeline(): string {
    const entries = this.timelineCollector.getTimeline({ limit: 50 });
    return this.timelineFormatter.format(entries);
  }
}
