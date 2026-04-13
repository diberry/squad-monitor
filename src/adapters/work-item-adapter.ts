// Work item adapter - wraps platform adapter (GitHub/ADO)

import { WorkItem, WorkItemStatus } from '../core/types';

export interface PlatformAdapter {
  fetchWorkItems(): Promise<Array<{
    id: string;
    title: string;
    assignee?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }>>;
  platform: 'github' | 'ado';
}

export class WorkItemAdapter {
  private platformAdapter: PlatformAdapter;

  constructor(platformAdapter: PlatformAdapter) {
    this.platformAdapter = platformAdapter;
  }

  async loadWorkItems(): Promise<WorkItem[]> {
    const rawItems = await this.platformAdapter.fetchWorkItems();
    return rawItems.map(item => ({
      id: item.id,
      title: item.title,
      assigneeAgent: item.assignee,
      status: this.mapStatus(item.status),
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
      platform: this.platformAdapter.platform,
    }));
  }

  private mapStatus(status: string): WorkItemStatus {
    const statusMap: Record<string, WorkItemStatus> = {
      'open': WorkItemStatus.OPEN,
      'in_progress': WorkItemStatus.IN_PROGRESS,
      'completed': WorkItemStatus.COMPLETED,
      'closed': WorkItemStatus.COMPLETED,
      'blocked': WorkItemStatus.BLOCKED,
    };
    return statusMap[status.toLowerCase()] ?? WorkItemStatus.OPEN;
  }
}
