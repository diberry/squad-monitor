import { describe, it, expect } from 'vitest';
import { WorkItemAdapter, PlatformAdapter } from '../../src/adapters/work-item-adapter';
import { WorkItemStatus } from '../../src/core/types';

describe('WorkItemAdapter', () => {
  it('should initialize with platform adapter', () => {
    const mockAdapter: PlatformAdapter = {
      platform: 'github',
      async fetchWorkItems() { return []; },
    };
    const adapter = new WorkItemAdapter(mockAdapter);
    expect(adapter).toBeDefined();
  });

  it('should load work items from platform', async () => {
    const mockAdapter: PlatformAdapter = {
      platform: 'github',
      async fetchWorkItems() {
        return [
          { id: 'GH-1', title: 'Fix bug', assignee: 'agent-1', status: 'open', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-02T00:00:00Z' },
          { id: 'GH-2', title: 'Add feature', assignee: 'agent-2', status: 'in_progress', createdAt: '2024-01-03T00:00:00Z', updatedAt: '2024-01-04T00:00:00Z' },
        ];
      },
    };
    const adapter = new WorkItemAdapter(mockAdapter);
    const items = await adapter.loadWorkItems();
    expect(items).toHaveLength(2);
    expect(items[0].id).toBe('GH-1');
    expect(items[0].status).toBe(WorkItemStatus.OPEN);
    expect(items[0].platform).toBe('github');
    expect(items[1].status).toBe(WorkItemStatus.IN_PROGRESS);
    expect(items[0].assigneeAgent).toBe('agent-1');
  });

  it('should map closed status to completed', async () => {
    const mockAdapter: PlatformAdapter = {
      platform: 'ado',
      async fetchWorkItems() {
        return [{ id: 'ADO-1', title: 'Done task', status: 'closed', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }];
      },
    };
    const adapter = new WorkItemAdapter(mockAdapter);
    const items = await adapter.loadWorkItems();
    expect(items[0].status).toBe(WorkItemStatus.COMPLETED);
    expect(items[0].platform).toBe('ado');
  });
});
