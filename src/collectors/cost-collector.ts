// Cost collector - tracks token/cost consumption via SDK CostTracker

import { CostData } from '../core/types';

export class CostCollector {
  private costs: Map<string, CostData> = new Map();

  getAgentCosts(agentId: string): CostData | undefined {
    return this.costs.get(agentId);
  }

  getTotalCost(): number {
    // Return sum of all agent costs
    return 0;
  }

  getCostRate(): { tokensPerMin: number; costPerMin: number } {
    // Calculate running cost rate
    return { tokensPerMin: 0, costPerMin: 0 };
  }
}
