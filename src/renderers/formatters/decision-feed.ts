// Decision feed formatter - renders decision list

import { Decision } from '../../core/types';
import { AnsiUtils } from '../ansi-utils';

export class DecisionFeedFormatter {
  format(decisions: Decision[], limit: number = 10): string {
    if (decisions.length === 0) {
      return AnsiUtils.bold('=== Decision Feed ===') + '\n  No decisions\n';
    }

    const header = AnsiUtils.bold('=== Decision Feed ===');
    const displayed = decisions.slice(0, limit);

    const rows = displayed.map(d => {
      const time = this.formatTimestamp(d.timestamp);
      const status = this.colorStatus(d.status);
      return `  ${time} ${AnsiUtils.bold(d.title)} (${d.author}) [${status}]`;
    });

    return [header, ...rows].join('\n') + '\n';
  }

  private formatTimestamp(date: Date): string {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    return AnsiUtils.blue(`${h}:${m}:${s}`);
  }

  private colorStatus(status: string): string {
    switch (status.toLowerCase()) {
      case 'accepted': return AnsiUtils.green(status);
      case 'rejected': return AnsiUtils.red(status);
      case 'pending': return AnsiUtils.yellow(status);
      default: return status;
    }
  }
}
