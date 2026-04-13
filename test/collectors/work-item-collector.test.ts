import { describe, it, expect } from 'vitest';
import { WorkItemCollector } from '../../src/collectors/work-item-collector';
import { WorkItemStatus, WorkItem } from '../../src/core/types';

describe('WorkItemCollector', () => {
  const makeWorkItem = (overrides: Partial<WorkItem> = {}): WorkItem => ({
    id: 'WI-1',
    title: 'Fix login',
    assigneeAgent: 'agent-1',
    status: WorkItemStatus.OPEN,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    platform: 'github',
    ...overrides,
  });

  it('should read work items from platform adapter', () => {
    const collector = new WorkItemCollector();
    const items = [makeWorkItem({ id: 'WI-1' }), makeWorkItem({ id: 'WI-2', title: 'Add tests' })];
    collector.loadWorkItems(items);
    expect(collector.getWorkItems()).toHaveLength(2);
  });

  it('should track work item state changes', () => {
    const collector = new WorkItemCollector();
    collector.loadWorkItems([makeWorkItem({ id: 'WI-1', status: WorkItemStatus.OPEN })]);
    expect(collector.getWorkItem('WI-1')?.status).toBe(WorkItemStatus.OPEN);

    collector.updateWorkItemStatus('WI-1', WorkItemStatus.IN_PROGRESS);
    expect(collector.getWorkItem('WI-1')?.status).toBe(WorkItemStatus.IN_PROGRESS);

    collector.updateWorkItemStatus('WI-1', WorkItemStatus.COMPLETED);
    expect(collector.getWorkItem('WI-1')?.status).toBe(WorkItemStatus.COMPLETED);
  });

  it('should map work items to agents', () => {
    const collector = new WorkItemCollector();
    collector.loadWorkItems([
      makeWorkItem({ id: 'WI-1', assigneeAgent: 'agent-1' }),
      makeWorkItem({ id: 'WI-2', assigneeAgent: 'agent-1' }),
      makeWorkItem({ id: 'WI-3', assigneeAgent: 'agent-2' }),
    ]);
    const correlation = collector.correlateWorkItems();
    expect(correlation.get('agent-1')).toEqual(['WI-1', 'WI-2']);
    expect(correlation.get('agent-2')).toEqual(['WI-3']);
  });

  it('should get work items by agent', () => {
    const collector = new WorkItemCollector();
    collector.loadWorkItems([
      makeWorkItem({ id: 'WI-1', assigneeAgent: 'agent-1' }),
      makeWorkItem({ id: 'WI-2', assigneeAgent: 'agent-2' }),
      makeWorkItem({ id: 'WI-3', assigneeAgent: 'agent-1' }),
    ]);
    const items = collector.getWorkItemsByAgent('agent-1');
    expect(items).toHaveLength(2);
    expect(items.every(i => i.assigneeAgent === 'agent-1')).toBe(true);
  });
});
