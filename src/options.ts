import { DefaultReporterFactory } from "./reporters/defaultReporterFactory.js";
import type { ReporterOptions } from "./reporters/reporterOptions.js";
import { MultiReporter } from "./reporters/multiReporter.js";
import type { Writer } from "./writer/strings.js";
import { vitestNamer } from "./namer/vitestNamer.js";
import { type Comparator, stringComparator } from "./comparator.js";
import { combine } from "./scrubbers/regex.js";
import { StringWriter } from "./writer/strings.js";
import { MultiWriter } from "./writer/multiWriter.js";

export type Scrubber = (input: string) => string;

export interface Options {
  /** File extension for approved/received files (no dot). */
  extension: string;
  /** Transform applied to received content before comparison. */
  scrubber: Scrubber;
  /** Reporter invoked on mismatch. */
  reporter: Reporter;
  /** Names approved/received files. Defaults to Vitest test state. */
  namer: Namer;
  /** Compares received and approved strings. Defaults to exact equality. */
  comparator: Comparator;
  /** Writer for saving received files. Defaults to StringWriter. */
  writer: Writer;
}

/**
 * Partial options accepted by `verify*` functions. Scrubbers, writers, and reporters may
 * be passed as arrays — they will be composed via `combine` / `MultiWriter` / `MultiReporter`.
 */
export type PartialOptions = Partial<
  Omit<Options, "scrubber" | "reporter" | "writer">
> & {
  scrubber?: Scrubber | Scrubber[];
  reporter?: Reporter | Reporter[];
  writer?: Writer | Writer[];
};

export const identityScrubber: Scrubber = (s) => s;

export function defaultOptions(): Options {
  return {
    extension: "txt",
    scrubber: identityScrubber,
    reporter: new DefaultReporterFactory().create({ type: "cli" }),
    namer: vitestNamer,
    comparator: stringComparator,
    writer: new StringWriter(),
  };
}

export function withOptions(partial: PartialOptions = {}): Options {
  const defaults = defaultOptions();
  const { scrubber, reporter, writer, ...rest } = partial;
  return {
    ...defaults,
    ...rest,
    scrubber: Array.isArray(scrubber)
      ? combine(...scrubber)
      : scrubber ?? defaults.scrubber,
    reporter: Array.isArray(reporter)
      ? new MultiReporter(reporter)
      : reporter ?? defaults.reporter,
    writer: Array.isArray(writer)
      ? new MultiWriter(writer)
      : writer ?? defaults.writer,
  };
}
