import { describe, it, expect } from 'vitest';
import { AgentState, WorkItemStatus } from '../../src/core/types';

describe('Types', () => {
  it('should define AgentState enum', () => {
    expect(AgentState.IDLE).toBeDefined();
    expect(AgentState.WORKING).toBeDefined();
  });

  it('should define WorkItemStatus enum', () => {
    expect(WorkItemStatus.OPEN).toBeDefined();
    expect(WorkItemStatus.IN_PROGRESS).toBeDefined();
  });
});
