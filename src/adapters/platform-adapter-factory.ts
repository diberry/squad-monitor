// Platform adapter factory - creates GitHub or ADO adapter
// SIMULATED: Both adapters return hard-coded sample data.
// Replace with real GitHub/ADO API calls when integrating with live platforms.

import { PlatformAdapter } from './work-item-adapter';

export interface PlatformAdapterOptions {
  token?: string;
  org?: string;
  repo?: string;
  project?: string;
}

export class PlatformAdapterFactory {
  static create(type: 'github' | 'ado', _options?: PlatformAdapterOptions): PlatformAdapter {
    if (type === 'github') {
      return {
        platform: 'github',
        async fetchWorkItems() {
          // SIMULATED: Returns sample GitHub issues for demo/testing purposes
          return [
            { id: 'GH-101', title: 'Fix authentication flow', assignee: 'agent-alpha', status: 'open', createdAt: '2024-06-01T10:00:00Z', updatedAt: '2024-06-02T14:30:00Z' },
            { id: 'GH-102', title: 'Add rate limiting middleware', assignee: 'agent-beta', status: 'in_progress', createdAt: '2024-06-01T11:00:00Z', updatedAt: '2024-06-03T09:15:00Z' },
            { id: 'GH-103', title: 'Update README with examples', status: 'closed', createdAt: '2024-06-01T12:00:00Z', updatedAt: '2024-06-02T16:00:00Z' },
          ];
        },
      };
    } else {
      return {
        platform: 'ado',
        async fetchWorkItems() {
          // SIMULATED: Returns sample ADO work items for demo/testing purposes
          return [
            { id: 'ADO-201', title: 'Implement retry logic', assignee: 'agent-gamma', status: 'open', createdAt: '2024-06-01T08:00:00Z', updatedAt: '2024-06-02T10:00:00Z' },
            { id: 'ADO-202', title: 'Database migration script', assignee: 'agent-alpha', status: 'in_progress', createdAt: '2024-06-01T09:00:00Z', updatedAt: '2024-06-03T11:45:00Z' },
          ];
        },
      };
    }
  }
}
