import type { Reporter } from "./reporter";
import type { ReporterOptions } from "./reporterOptions";
import { ReporterFactory } from "./reporterFactory";
import { CommandLineReporter } from "./commandLineReporter";

/**
 * Default implementation of ReporterFactory.
 * Supports the built‑in CLI reporter and dynamic loading of a custom reporter.
 */
export class DefaultReporterFactory implements ReporterFactory {
  create(options: ReporterOptions): Reporter {
    if (options.type === "cli") {
      return new CommandLineReporter();
    }

    if (options.type === "custom") {
      if (!options.customReporterPath) {
        throw new Error(
          "customReporterPath must be provided when type is 'custom'"
        );
      }
      try {
        const mod = require(options.customReporterPath);
        const ReporterClass = mod.default;
        if (!ReporterClass) {
          throw new Error(
            `Module ${options.customReporterPath} does not export a default reporter`
          );
        }
        return new ReporterClass();
      } catch (e) {
        throw new Error(
          `Failed to load custom reporter from ${options.customReporterPath}: ${e}`
        );
      }
    }

    throw new Error(`Unsupported reporter type: ${options.type}`);
  }
}
