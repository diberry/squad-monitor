// Cost collector - tracks token/cost consumption via SDK CostTracker

import { CostData } from '../core/types';

export class CostCollector {
  private costs: Map<string, CostData> = new Map();
  private sessionStartTime: Date;

  constructor() {
    this.sessionStartTime = new Date();
  }

  updateAgentCost(costData: CostData): void {
    this.costs.set(costData.agentId, costData);
  }

  getAgentCosts(agentId: string): CostData | undefined {
    return this.costs.get(agentId);
  }

  getTotalCost(): number {
    let total = 0;
    for (const cost of this.costs.values()) {
      total += cost.estimatedCost;
    }
    return total;
  }

  getTotalTokens(): number {
    let total = 0;
    for (const cost of this.costs.values()) {
      total += cost.tokens;
    }
    return total;
  }

  getCostRate(): { tokensPerMin: number; costPerMin: number } {
    const elapsedMs = Date.now() - this.sessionStartTime.getTime();
    const elapsedMin = elapsedMs / 60000;
    if (elapsedMin === 0) {
      return { tokensPerMin: 0, costPerMin: 0 };
    }
    return {
      tokensPerMin: this.getTotalTokens() / elapsedMin,
      costPerMin: this.getTotalCost() / elapsedMin,
    };
  }

  getAllCosts(): CostData[] {
    return Array.from(this.costs.values());
  }
}
