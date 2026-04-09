import type { Reporter } from "./reporter";

export type ReporterOptions = {
  /**
   * Type of reporter to create.
   * - 'cli'   : use the default CommandLineReporter.
   * - 'custom': load a custom reporter from a module path.
   */
  type: "cli" | "custom";
  /**
   * Path to a module that exports a Reporter as default.
   * Only used when type === 'custom'.
   */
  customReporterPath?: string;
};
