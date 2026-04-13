// Platform adapter factory - creates GitHub or ADO adapter

import { PlatformAdapter } from './work-item-adapter';

export interface PlatformAdapterOptions {
  token?: string;
  org?: string;
  repo?: string;
  project?: string;
}

export class PlatformAdapterFactory {
  static create(type: 'github' | 'ado', options?: PlatformAdapterOptions): PlatformAdapter {
    if (type === 'github') {
      return {
        platform: 'github',
        async fetchWorkItems() {
          // In real impl, this would use GitHub API
          return [];
        },
      };
    } else {
      return {
        platform: 'ado',
        async fetchWorkItems() {
          // In real impl, this would use ADO API
          return [];
        },
      };
    }
  }
}
