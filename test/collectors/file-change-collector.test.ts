import { describe, it, expect } from 'vitest';
import { FileChangeCollector } from '../../src/collectors/file-change-collector';
import { FileChange } from '../../src/core/types';

describe('FileChangeCollector', () => {
  it('should collect file modifications from EventBus', () => {
    const collector = new FileChangeCollector();
    const change: FileChange = {
      filepath: 'src/main.ts',
      agentId: 'agent-1',
      timestamp: new Date(),
      changeType: 'modify',
    };
    collector.addChange(change);
    expect(collector.getChanges()).toHaveLength(1);
    expect(collector.getChanges()[0].filepath).toBe('src/main.ts');
  });

  it('should group changes by file', () => {
    const collector = new FileChangeCollector();
    collector.addChange({ filepath: 'src/a.ts', agentId: 'agent-1', timestamp: new Date(), changeType: 'modify' });
    collector.addChange({ filepath: 'src/b.ts', agentId: 'agent-2', timestamp: new Date(), changeType: 'create' });
    collector.addChange({ filepath: 'src/a.ts', agentId: 'agent-2', timestamp: new Date(), changeType: 'modify' });

    const grouped = collector.getChangesByFile();
    expect(grouped.get('src/a.ts')).toHaveLength(2);
    expect(grouped.get('src/b.ts')).toHaveLength(1);
  });

  it('should identify frequently modified files', () => {
    const collector = new FileChangeCollector();
    // File A modified 3 times
    collector.addChange({ filepath: 'src/a.ts', agentId: 'agent-1', timestamp: new Date('2024-01-01'), changeType: 'modify' });
    collector.addChange({ filepath: 'src/a.ts', agentId: 'agent-2', timestamp: new Date('2024-01-02'), changeType: 'modify' });
    collector.addChange({ filepath: 'src/a.ts', agentId: 'agent-1', timestamp: new Date('2024-01-03'), changeType: 'modify' });
    // File B modified 1 time
    collector.addChange({ filepath: 'src/b.ts', agentId: 'agent-1', timestamp: new Date('2024-01-01'), changeType: 'create' });
    // File C modified 2 times
    collector.addChange({ filepath: 'src/c.ts', agentId: 'agent-2', timestamp: new Date('2024-01-01'), changeType: 'modify' });
    collector.addChange({ filepath: 'src/c.ts', agentId: 'agent-2', timestamp: new Date('2024-01-02'), changeType: 'modify' });

    const hot = collector.getHotFiles(2);
    expect(hot).toHaveLength(2);
    expect(hot[0].filepath).toBe('src/a.ts');
    expect(hot[0].count).toBe(3);
    expect(hot[1].filepath).toBe('src/c.ts');
    expect(hot[1].count).toBe(2);
  });
});
