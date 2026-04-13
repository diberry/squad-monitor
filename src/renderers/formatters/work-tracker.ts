// Work tracker formatter - renders work item status table

import { WorkItem, WorkItemStatus } from '../../core/types';
import { AnsiUtils } from '../ansi-utils';

export class WorkTrackerFormatter {
  format(workItems: WorkItem[]): string {
    if (workItems.length === 0) {
      return AnsiUtils.bold('=== Work Item Tracker ===') + '\n  No work items\n';
    }

    const header = AnsiUtils.bold('=== Work Item Tracker ===');
    const columns = `  ${'ID'.padEnd(12)} ${'Title'.padEnd(30)} ${'Assignee'.padEnd(15)} ${'Status'.padEnd(14)} Age`;
    const separator = '  ' + '-'.repeat(80);

    const rows = workItems.map(item => {
      const statusStr = this.colorStatus(item.status);
      const age = this.formatAge(item.createdAt);
      const title = item.title.length > 28 ? item.title.substring(0, 28) + '..' : item.title;
      const assignee = item.assigneeAgent ?? 'unassigned';
      return `  ${item.id.padEnd(12)} ${title.padEnd(30)} ${assignee.padEnd(15)} ${statusStr.padEnd(14 + this.ansiOverhead(statusStr, item.status))} ${age}`;
    });

    return [header, columns, separator, ...rows].join('\n') + '\n';
  }

  private colorStatus(status: WorkItemStatus): string {
    switch (status) {
      case WorkItemStatus.OPEN: return AnsiUtils.blue(status);
      case WorkItemStatus.IN_PROGRESS: return AnsiUtils.yellow(status);
      case WorkItemStatus.COMPLETED: return AnsiUtils.green(status);
      case WorkItemStatus.BLOCKED: return AnsiUtils.red(status);
      default: return status;
    }
  }

  private formatAge(createdAt: Date): string {
    const ms = Date.now() - createdAt.getTime();
    const hours = Math.floor(ms / 3600000);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d`;
    return `${hours}h`;
  }

  private ansiOverhead(ansiStr: string, rawStr: string): number {
    return ansiStr.length - rawStr.length;
  }
}
