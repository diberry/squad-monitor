// Cost ticker formatter - renders cost display

import { CostData } from '../../core/types';
import { AnsiUtils } from '../ansi-utils';

export class CostTickerFormatter {
  format(costs: CostData[], budget?: number): string {
    if (costs.length === 0) {
      return AnsiUtils.bold('=== Cost Ticker ===') + '\n  No cost data\n';
    }

    const header = AnsiUtils.bold('=== Cost Ticker ===');
    const totalCost = costs.reduce((sum, c) => sum + c.estimatedCost, 0);
    const totalTokens = costs.reduce((sum, c) => sum + c.tokens, 0);
    const totalDuration = costs.reduce((sum, c) => sum + c.duration, 0);
    const tokensPerMin = totalDuration > 0 ? totalTokens / (totalDuration / 60000) : 0;
    const costPerMin = totalDuration > 0 ? totalCost / (totalDuration / 60000) : 0;

    let line = `  Total: ${AnsiUtils.green('$' + totalCost.toFixed(4))} | Rate: ${tokensPerMin.toFixed(0)} tokens/min ($${costPerMin.toFixed(4)}/min)`;
    if (budget !== undefined) {
      const remaining = budget - totalCost;
      const remainingStr = remaining > 0 ? AnsiUtils.green('$' + remaining.toFixed(4)) : AnsiUtils.red('$' + remaining.toFixed(4));
      line += ` | Budget remaining: ${remainingStr}`;
    }

    return [header, line].join('\n') + '\n';
  }
}
