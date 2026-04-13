// Health indicator formatter - renders health status indicators

import { HealthStatus } from '../../core/types';
import { AnsiUtils } from '../ansi-utils';

export class HealthIndicatorFormatter {
  format(health: HealthStatus[]): string {
    if (health.length === 0) {
      return AnsiUtils.bold('=== Health Indicators ===') + '\n  No health data\n';
    }

    const header = AnsiUtils.bold('=== Health Indicators ===');
    const rows = health.map(h => {
      const indicator = this.getIndicator(h);
      const details: string[] = [];
      if (h.circuitBreakerOpen) details.push(AnsiUtils.red('circuit-open'));
      if (h.rateLimited) details.push(AnsiUtils.yellow('rate-limited'));
      if (h.errorCount > 0) details.push(`errors: ${h.errorCount}`);
      const detailStr = details.length > 0 ? ` (${details.join(', ')})` : '';
      return `  ${indicator} ${h.agentId}${detailStr}`;
    });

    return [header, ...rows].join('\n') + '\n';
  }

  private getIndicator(health: HealthStatus): string {
    if (health.circuitBreakerOpen) return '🔴';
    if (health.rateLimited) return '🟡';
    return '🟢';
  }
}
