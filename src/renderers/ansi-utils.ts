// ANSI utilities - color and formatting helpers

export class AnsiUtils {
  static bold(text: string): string {
    return `\x1b[1m${text}\x1b[0m`;
  }

  static color(text: string, colorCode: string): string {
    return `\x1b[${colorCode}m${text}\x1b[0m`;
  }

  static green(text: string): string {
    return this.color(text, '32');
  }

  static red(text: string): string {
    return this.color(text, '31');
  }

  static yellow(text: string): string {
    return this.color(text, '33');
  }

  static blue(text: string): string {
    return this.color(text, '34');
  }

  static clearScreen(): string {
    return '\x1b[2J\x1b[0f';
  }
}
