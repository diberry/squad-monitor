// Work item collector - tracks work items and correlates with agents

import { WorkItem, WorkItemStatus } from '../core/types';

export class WorkItemCollector {
  private workItems: Map<string, WorkItem> = new Map();

  loadWorkItems(items: WorkItem[]): void {
    for (const item of items) {
      this.workItems.set(item.id, { ...item });
    }
  }

  getWorkItems(): WorkItem[] {
    return Array.from(this.workItems.values());
  }

  getWorkItem(id: string): WorkItem | undefined {
    return this.workItems.get(id);
  }

  updateWorkItemStatus(workItemId: string, status: WorkItemStatus): void {
    const item = this.workItems.get(workItemId);
    if (item) {
      item.status = status;
      item.updatedAt = new Date();
    }
  }

  getWorkItemsByAgent(agentId: string): WorkItem[] {
    return this.getWorkItems().filter(item => item.assigneeAgent === agentId);
  }

  correlateWorkItems(): Map<string, string[]> {
    const agentToItems = new Map<string, string[]>();
    for (const item of this.workItems.values()) {
      if (item.assigneeAgent) {
        if (!agentToItems.has(item.assigneeAgent)) {
          agentToItems.set(item.assigneeAgent, []);
        }
        agentToItems.get(item.assigneeAgent)!.push(item.id);
      }
    }
    return agentToItems;
  }
}
