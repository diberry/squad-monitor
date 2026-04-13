import { describe, it, expect } from 'vitest';
import { StuckDetector } from '../../src/collectors/stuck-detector';

describe('StuckDetector', () => {
  it('should detect agent inactivity > N minutes', () => {
    // Test checkStuckAgents
  });

  it('should distinguish stuck from slow', () => {
    // Test activity with output vs no activity
  });

  it('should set custom stuck threshold', () => {
    // Test setStuckThreshold
  });
});
