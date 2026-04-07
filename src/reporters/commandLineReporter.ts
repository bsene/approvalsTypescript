import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import type { Reporter } from "./reporter.js";

/**
 * Default reporter: prints a unified diff between approved and received
 * files to stderr. Falls back to a simple line diff when `diff` is missing.
 */
export class CommandLineReporter implements Reporter {
  report(receivedPath: string, approvedPath: string): void {
    const result = spawnSync("diff", ["-u", approvedPath, receivedPath], {
      encoding: "utf8",
    });

    if (result.error || result.status === null) {
      this.fallback(receivedPath, approvedPath);
      return;
    }

    process.stderr.write(`\n--- Approval mismatch ---\n${result.stdout}\n`);
  }

  private fallback(receivedPath: string, approvedPath: string): void {
    const approved = existsSync(approvedPath)
      ? readFileSync(approvedPath, "utf8")
      : "";
    const received = existsSync(receivedPath)
      ? readFileSync(receivedPath, "utf8")
      : "";
    process.stderr.write(
      `\n--- Approval mismatch ---\n` +
        `approved: ${approvedPath}\n${approved}\n` +
        `received: ${receivedPath}\n${received}\n`,
    );
  }
}
