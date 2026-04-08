/** Invokes each wrapped writer in order. */
export class MultiWriter implements Writer {
  constructor(private readonly writers: Writer[]) {}

  write(path: string, content: string): void {
    for (const w of this.writers) {
      w.write(path, content);
    }
  }

  writeBinary(path: string, content: Buffer): void {
    for (const w of this.writers) {
      w.writeBinary(path, content);
    }
  }
}
