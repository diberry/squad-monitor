import { describe, it, expect } from 'vitest';
import { AnsiUtils } from '../../src/renderers/ansi-utils';

describe('AnsiUtils', () => {
  it('should apply bold formatting', () => {
    const result = AnsiUtils.bold('test');
    expect(result).toBe('\x1b[1mtest\x1b[0m');
  });

  it('should apply color codes', () => {
    expect(AnsiUtils.green('test')).toBe('\x1b[32mtest\x1b[0m');
    expect(AnsiUtils.red('test')).toBe('\x1b[31mtest\x1b[0m');
    expect(AnsiUtils.yellow('test')).toBe('\x1b[33mtest\x1b[0m');
    expect(AnsiUtils.blue('test')).toBe('\x1b[34mtest\x1b[0m');
  });

  it('should clear screen', () => {
    expect(AnsiUtils.clearScreen()).toBe('\x1b[2J\x1b[0f');
  });

  it('should apply custom color codes', () => {
    const result = AnsiUtils.color('hello', '36'); // cyan
    expect(result).toBe('\x1b[36mhello\x1b[0m');
  });
});
