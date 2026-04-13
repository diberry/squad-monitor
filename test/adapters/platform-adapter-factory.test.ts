import { describe, it, expect } from 'vitest';
import { PlatformAdapterFactory } from '../../src/adapters/platform-adapter-factory';

describe('PlatformAdapterFactory', () => {
  it('should create GitHub adapter', () => {
    const adapter = PlatformAdapterFactory.create('github');
    expect(adapter).toBeDefined();
    expect(adapter.platform).toBe('github');
    expect(typeof adapter.fetchWorkItems).toBe('function');
  });

  it('should create ADO adapter', () => {
    const adapter = PlatformAdapterFactory.create('ado');
    expect(adapter).toBeDefined();
    expect(adapter.platform).toBe('ado');
    expect(typeof adapter.fetchWorkItems).toBe('function');
  });

  it('should return empty work items from default adapters', async () => {
    const ghAdapter = PlatformAdapterFactory.create('github');
    const items = await ghAdapter.fetchWorkItems();
    expect(items).toEqual([]);
  });
});
