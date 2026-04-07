import type { Reporter } from "./reporters/reporter.js";
import { CommandLineReporter } from "./reporters/commandLineReporter.js";

export type Scrubber = (input: string) => string;

export interface Options {
  /** File extension for approved/received files (no dot). */
  extension: string;
  /** Transforms applied to received content before comparison. */
  scrubber: Scrubber;
  /** Reporter invoked on mismatch. */
  reporter: Reporter;
}

export const identityScrubber: Scrubber = (s) => s;

export function defaultOptions(): Options {
  return {
    extension: "txt",
    scrubber: identityScrubber,
    reporter: new CommandLineReporter(),
  };
}

export function withOptions(partial: Partial<Options> = {}): Options {
  return { ...defaultOptions(), ...partial };
}
