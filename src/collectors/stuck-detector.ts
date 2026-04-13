// Stuck detector - identifies agents with no activity > N minutes

export class StuckDetector {
  private stuckThresholdMs = 5 * 60 * 1000; // 5 minutes

  checkStuckAgents(agentLastActivityTimes: Map<string, Date>): string[] {
    // Return list of stuck agent IDs
    return [];
  }

  setStuckThreshold(ms: number): void {
    this.stuckThresholdMs = ms;
  }
}
