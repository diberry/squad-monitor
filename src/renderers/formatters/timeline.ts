// Timeline formatter - renders event timeline

import { TimelineEntry } from '../../core/types';
import { AnsiUtils } from '../ansi-utils';

export class TimelineFormatter {
  format(entries: TimelineEntry[], limit: number = 50): string {
    if (entries.length === 0) {
      return AnsiUtils.bold('=== Session Timeline ===') + '\n  No events\n';
    }

    const header = AnsiUtils.bold('=== Session Timeline ===');
    const displayed = entries.slice(-limit);

    const rows = displayed.map(entry => {
      const time = this.formatTime(entry.timestamp);
      const type = this.colorType(entry.type);
      const agent = entry.agentId ? ` [${entry.agentId}]` : '';
      return `  ${time} ${type}${agent} ${entry.message}`;
    });

    return [header, ...rows].join('\n') + '\n';
  }

  private formatTime(date: Date): string {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  private colorType(type: string): string {
    if (type.includes('failed') || type.includes('error') || type.includes('stuck')) {
      return AnsiUtils.red(type);
    }
    if (type.includes('completed')) {
      return AnsiUtils.green(type);
    }
    if (type.includes('working')) {
      return AnsiUtils.yellow(type);
    }
    return AnsiUtils.blue(type);
  }
}
