// File change collector - tracks file modifications from EventBus

import { FileChange } from '../core/types';

export class FileChangeCollector {
  private changes: FileChange[] = [];

  addChange(change: FileChange): void {
    this.changes.push(change);
  }

  getChanges(): FileChange[] {
    return [...this.changes];
  }

  getChangesByFile(): Map<string, FileChange[]> {
    const grouped = new Map<string, FileChange[]>();
    for (const change of this.changes) {
      if (!grouped.has(change.filepath)) {
        grouped.set(change.filepath, []);
      }
      grouped.get(change.filepath)!.push(change);
    }
    return grouped;
  }

  getHotFiles(limit: number = 10): Array<{ filepath: string; count: number; lastAgent: string }> {
    const grouped = this.getChangesByFile();
    const hotFiles: Array<{ filepath: string; count: number; lastAgent: string }> = [];

    for (const [filepath, changes] of grouped) {
      const sorted = [...changes].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      hotFiles.push({
        filepath,
        count: changes.length,
        lastAgent: sorted[0].agentId,
      });
    }

    return hotFiles
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
}
