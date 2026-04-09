import { basename, dirname, extname, join } from "node:path";
import { expect } from "vitest";
import type { ApprovalNames, Namer } from "./namer";

export type { ApprovalNames } from "./namer";

/**
 * Derives approved/received file paths from Vitest's current test state.
 * Files live next to the test file as:
 *   <testFileBase>.<sanitized test name>.approved.<ext>
 */
export function namesFromVitest(extension: string): ApprovalNames {
  const state = expect.getState();
  const testPath = state.testPath;
  const testName = state.currentTestName;

  if (!testPath || !testName) {
    throw new Error(
      "approvals-ts: could not resolve current test. Call verify() from inside a Vitest test.",
    );
  }

  const dir = dirname(testPath);
  const base = basename(testPath, extname(testPath));
  const safeName = sanitize(testName);
  const stem = join(dir, `${base}.${safeName}`);

  return {
    approvedPath: `${stem}.approved.${extension}`,
    receivedPath: `${stem}.received.${extension}`,
  };
}

/** Default Namer implementation backed by Vitest's test state. */
export const vitestNamer: Namer = {
  names: namesFromVitest,
};

function sanitize(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/^_+|_+$/g, "");
}
