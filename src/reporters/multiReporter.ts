import type { Reporter } from "./reporter";

/** Invokes each wrapped reporter in order. Errors propagate from the first failure. */
export class MultiReporter implements Reporter {
  constructor(private readonly reporters: Reporter[]) {}

  async report(receivedPath: string, approvedPath: string): Promise<void> {
    for (const r of this.reporters) {
      await r.report(receivedPath, approvedPath);
    }
  }
}
