// Decision collector - tracks team decisions from SquadState

import { Decision } from '../core/types';

export class DecisionCollector {
  private decisions: Decision[] = [];

  loadDecisions(decisions: Decision[]): void {
    this.decisions = [...decisions];
  }

  getDecisionFeed(): Decision[] {
    return [...this.decisions].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  addDecision(decision: Decision): void {
    this.decisions.push(decision);
  }

  getDecisionCount(): number {
    return this.decisions.length;
  }

  getDecisionById(id: string): Decision | undefined {
    return this.decisions.find(d => d.id === id);
  }
}
