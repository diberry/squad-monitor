import { describe, it, expect } from 'vitest';
import { WorkTrackerFormatter } from '../../../src/renderers/formatters/work-tracker';
import { WorkItem, WorkItemStatus } from '../../../src/core/types';

describe('WorkTrackerFormatter', () => {
  const makeItem = (overrides: Partial<WorkItem> = {}): WorkItem => ({
    id: 'WI-1',
    title: 'Fix login page',
    assigneeAgent: 'agent-1',
    status: WorkItemStatus.OPEN,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
    platform: 'github',
    ...overrides,
  });

  it('should format work items for terminal display', () => {
    const formatter = new WorkTrackerFormatter();
    const output = formatter.format([makeItem()]);
    expect(output).toContain('Work Item Tracker');
    expect(output).toContain('WI-1');
  });

  it('should include work item ID, title, assignee, status, age', () => {
    const formatter = new WorkTrackerFormatter();
    const output = formatter.format([makeItem({ id: 'GH-42', title: 'Add auth module', assigneeAgent: 'coder' })]);
    expect(output).toContain('GH-42');
    expect(output).toContain('Add auth module');
    expect(output).toContain('coder');
  });

  it('should handle empty work items', () => {
    const formatter = new WorkTrackerFormatter();
    const output = formatter.format([]);
    expect(output).toContain('No work items');
  });
});
