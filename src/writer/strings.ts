/**
 * Base interface for writing content to disk. Implementations can be injected
 * for custom file paths, formats, or destinations.
 */
export interface Writer {
  /** Write string content to the specified path. */
  write(path: string, content: string): void;
  /** Write binary content to the specified path. */
  writeBinary(path: string, content: Buffer): void;
}

/**
 * StringWriter writes text content using standard UTF-8 encoding.
 */
export class StringWriter implements Writer {
  write(path: string, content: string): void {
    writeReceived(path, content);
  }

  writeBinary(_path: string, _content: Buffer): void {
    throw new Error(
      "StringWriter does not support binary content. Use BinaryWriter instead.",
    );
  }
}

/** BinaryWriter writes raw buffer content without modification. */
export class BinaryWriter implements Writer {
  write(_path: string, _content: string): void {
    throw new Error(
      "BinaryWriter does not support string content. Use StringWriter or a shared Writer instead.",
    );
  }

  writeBinary(path: string, content: Buffer): void {
    writeReceivedBinary(path, content);
  }
}

/**
 * A Writer that delegates to StringWriter for text and BinaryWriter for binary.
 * Use when both text and binary may appear in the same test pipeline.
 */
export class UniversalWriter implements Writer {
  private textWriter: StringWriter;
  private binaryWriter: BinaryWriter;

  constructor() {
    this.textWriter = new StringWriter();
    this.binaryWriter = new BinaryWriter();
  }

  write(path: string, content: string): void {
    this.textWriter.write(path, content);
  }

  writeBinary(path: string, content: Buffer): void {
    this.binaryWriter.writeBinary(path, content);
  }
}
