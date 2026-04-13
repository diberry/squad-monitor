// Stuck detector - identifies agents with no activity > N minutes

export class StuckDetector {
  private stuckThresholdMs = 5 * 60 * 1000; // 5 minutes

  checkStuckAgents(agentLastActivityTimes: Map<string, Date>): string[] {
    const now = Date.now();
    const stuck: string[] = [];
    for (const [agentId, lastActivity] of agentLastActivityTimes) {
      if (now - lastActivity.getTime() > this.stuckThresholdMs) {
        stuck.push(agentId);
      }
    }
    return stuck;
  }

  setStuckThreshold(ms: number): void {
    this.stuckThresholdMs = ms;
  }

  getStuckThreshold(): number {
    return this.stuckThresholdMs;
  }
}
