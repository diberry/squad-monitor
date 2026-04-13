// Work item adapter - wraps platform adapter (GitHub/ADO)

import { WorkItem } from '../core/types';

export class WorkItemAdapter {
  constructor(private platformAdapter: any) {}

  async loadWorkItems(): Promise<WorkItem[]> {
    // Fetch work items from platform adapter
    return [];
  }
}
