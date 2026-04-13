// File changes formatter - renders file modification summary

import { FileChangeSummary } from '../../core/types';
import { AnsiUtils } from '../ansi-utils';

export class FileChangesFormatter {
  format(fileChanges: FileChangeSummary[]): string {
    if (fileChanges.length === 0) {
      return AnsiUtils.bold('=== File Changes ===') + '\n  No file changes\n';
    }

    const header = AnsiUtils.bold('=== File Changes ===');
    const rows = fileChanges.map(fc => {
      return `  ${fc.filepath.padEnd(40)} ${String(fc.count).padEnd(6)} ${fc.lastAgent}`;
    });

    return [header, `  ${'File'.padEnd(40)} ${'Count'.padEnd(6)} Last Agent`, ...rows].join('\n') + '\n';
  }
}
