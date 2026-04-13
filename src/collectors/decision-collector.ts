// Decision collector - tracks team decisions from SquadState

import { Decision } from '../core/types';

export class DecisionCollector {
  private decisions: Decision[] = [];

  loadDecisions(decisions: Decision[]): void {
    // Load decisions from SquadState
  }

  getDecisionFeed(): Decision[] {
    // Return decisions ordered by timestamp (newest first)
    return [];
  }

  addDecision(decision: Decision): void {
    // Add new decision
  }
}
