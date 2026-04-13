import { describe, it, expect } from 'vitest';
import { AgentBoardFormatter } from '../../../src/renderers/formatters/agent-board';
import { AgentState, AgentStatus } from '../../../src/core/types';

describe('AgentBoardFormatter', () => {
  const makeAgent = (overrides: Partial<AgentStatus> = {}): AgentStatus => ({
    agentId: 'agent-1',
    state: AgentState.WORKING,
    duration: 5000,
    currentTask: 'fixing bug #42',
    lastActivityTime: new Date(),
    ...overrides,
  });

  it('should format agents for terminal display', () => {
    const formatter = new AgentBoardFormatter();
    const output = formatter.format([makeAgent()]);
    expect(output).toContain('Agent Status Board');
    expect(output).toContain('agent-1');
  });

  it('should include agent ID, state, duration, task', () => {
    const formatter = new AgentBoardFormatter();
    const output = formatter.format([
      makeAgent({ agentId: 'coder', state: AgentState.WORKING, duration: 65000, currentTask: 'deploy service' }),
    ]);
    expect(output).toContain('coder');
    expect(output).toContain('working');
    expect(output).toContain('deploy service');
    expect(output).toContain('1m');
  });

  it('should handle empty agents list', () => {
    const formatter = new AgentBoardFormatter();
    const output = formatter.format([]);
    expect(output).toContain('No agents tracked');
  });

  it('should apply ANSI formatting', () => {
    const formatter = new AgentBoardFormatter();
    const output = formatter.format([makeAgent({ state: AgentState.FAILED })]);
    expect(output).toContain('\x1b['); // ANSI escape codes present
  });
});
