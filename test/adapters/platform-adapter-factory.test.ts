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

  it('should return simulated work items from GitHub adapter', async () => {
    const ghAdapter = PlatformAdapterFactory.create('github');
    const items = await ghAdapter.fetchWorkItems();
    expect(items.length).toBeGreaterThan(0);
    expect(items[0].id).toMatch(/^GH-/);
    expect(items[0]).toHaveProperty('title');
    expect(items[0]).toHaveProperty('status');
  });

  it('should return simulated work items from ADO adapter', async () => {
    const adoAdapter = PlatformAdapterFactory.create('ado');
    const items = await adoAdapter.fetchWorkItems();
    expect(items.length).toBeGreaterThan(0);
    expect(items[0].id).toMatch(/^ADO-/);
  });
});
