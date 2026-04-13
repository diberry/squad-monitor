// Alerts formatter - renders alert notifications

import { StuckAlert } from '../../core/types';
import { AnsiUtils } from '../ansi-utils';

export class AlertsFormatter {
  format(alerts: StuckAlert[]): string {
    if (alerts.length === 0) {
      return '';
    }

    const header = AnsiUtils.bold(AnsiUtils.red('=== ⚠️  ALERTS ==='));
    const rows = alerts.map(alert => {
      const duration = this.formatDuration(alert.duration);
      return `  ${AnsiUtils.red('⚠️  STUCK')} ${AnsiUtils.bold(alert.agentId)} - ${duration} - ${alert.message}`;
    });

    return [header, ...rows].join('\n') + '\n';
  }

  private formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    if (minutes > 60) {
      const hours = Math.floor(minutes / 60);
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  }
}
