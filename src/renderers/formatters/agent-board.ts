// Agent board formatter - renders agent status table

import { AgentStatus, AgentState } from '../../core/types';
import { AnsiUtils } from '../ansi-utils';

export class AgentBoardFormatter {
  format(agents: AgentStatus[]): string {
    if (agents.length === 0) {
      return AnsiUtils.bold('=== Agent Status Board ===') + '\n  No agents tracked\n';
    }

    const header = AnsiUtils.bold('=== Agent Status Board ===');
    const columns = `  ${'Agent ID'.padEnd(20)} ${'State'.padEnd(12)} ${'Duration'.padEnd(12)} Task`;
    const separator = '  ' + '-'.repeat(70);

    const rows = agents.map(agent => {
      const stateStr = this.colorState(agent.state);
      const durationStr = this.formatDuration(agent.duration);
      return `  ${agent.agentId.padEnd(20)} ${stateStr.padEnd(12 + this.ansiLength(stateStr) - agent.state.length)} ${durationStr.padEnd(12)} ${agent.currentTask}`;
    });

    return [header, columns, separator, ...rows].join('\n') + '\n';
  }

  private colorState(state: AgentState): string {
    switch (state) {
      case AgentState.IDLE: return AnsiUtils.blue(state);
      case AgentState.WORKING: return AnsiUtils.green(state);
      case AgentState.COMPLETED: return AnsiUtils.green(state);
      case AgentState.FAILED: return AnsiUtils.red(state);
      default: return state;
    }
  }

  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  private ansiLength(str: string): number {
    return str.replace(/\x1b\[[0-9;]*m/g, '').length;
  }
}
