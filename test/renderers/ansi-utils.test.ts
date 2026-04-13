import { describe, it, expect } from 'vitest';
import { AnsiUtils } from '../../src/renderers/ansi-utils';

describe('AnsiUtils', () => {
  it('should apply bold formatting', () => {
    const result = AnsiUtils.bold('test');
    expect(result).toContain('\x1b[1m');
  });

  it('should apply color codes', () => {
    expect(AnsiUtils.green('test')).toContain('\x1b[32m');
    expect(AnsiUtils.red('test')).toContain('\x1b[31m');
    expect(AnsiUtils.yellow('test')).toContain('\x1b[33m');
    expect(AnsiUtils.blue('test')).toContain('\x1b[34m');
  });

  it('should clear screen', () => {
    expect(AnsiUtils.clearScreen()).toBe('\x1b[2J\x1b[0f');
  });
});
