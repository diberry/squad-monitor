import { describe, it, expect } from 'vitest';
import { FileChangesFormatter } from '../../../src/renderers/formatters/file-changes';
import { FileChangeSummary } from '../../../src/core/types';

describe('FileChangesFormatter', () => {
  it('should format file changes for display', () => {
    const formatter = new FileChangesFormatter();
    const changes: FileChangeSummary[] = [
      { filepath: 'src/main.ts', count: 5, lastAgent: 'agent-1', lastTimestamp: new Date() },
    ];
    const output = formatter.format(changes);
    expect(output).toContain('File Changes');
    expect(output).toContain('src/main.ts');
  });

  it('should show filepath, count, recent agent', () => {
    const formatter = new FileChangesFormatter();
    const changes: FileChangeSummary[] = [
      { filepath: 'src/auth.ts', count: 3, lastAgent: 'coder', lastTimestamp: new Date() },
      { filepath: 'src/api.ts', count: 7, lastAgent: 'builder', lastTimestamp: new Date() },
    ];
    const output = formatter.format(changes);
    expect(output).toContain('src/auth.ts');
    expect(output).toContain('3');
    expect(output).toContain('coder');
    expect(output).toContain('src/api.ts');
    expect(output).toContain('7');
    expect(output).toContain('builder');
  });

  it('should handle empty changes', () => {
    const formatter = new FileChangesFormatter();
    const output = formatter.format([]);
    expect(output).toContain('No file changes');
  });
});
