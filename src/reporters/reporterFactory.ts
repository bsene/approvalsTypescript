import type { Reporter } from "./reporter";
import type { ReporterOptions } from "./reporterOptions";

export interface ReporterFactory {
  /**
   * Create a Reporter based on the provided options.
   * @throws Error if a custom reporter cannot be loaded.
   */
  create(options: ReporterOptions): Reporter;
}
