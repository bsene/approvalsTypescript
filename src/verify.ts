import { readFileSync } from "node:fs";
import { withOptions, type PartialOptions } from "./options.js";
import { prettyXml } from "./format/xml.js";
import { prettyHtml } from "./format/html.js";
import type { Writer } from "./writer/strings.js";
import type { Namer } from "./namer/namer.js";
import type { Reporter } from "./reporters/reporter.js";
import type { Comparator } from "./comparator.js";
import {
  ApprovalMismatchError,
  ApprovalMissingError,
  deleteIfExists,
  normalize,
  readApprovedBinaryOrNull,
  readApprovedOrEmpty,
  writeReceived,
  writeReceivedBinary,
} from "./writer/fileWriter.js";

/**
 * Core verification engine. Handles path resolution, content normalization,
 * approval comparison, and file write/reporting via injected dependencies.
 */
export async function verify(
  data: unknown,
  partial: PartialOptions = {},
): Promise<void> {
  const options = withOptions(partial);
  const { approvedPath, receivedPath } = options.namer.names(options.extension);
  const writer: Writer = options.writer;

  const raw = typeof data === "string" ? data : String(data);
  const received = normalize(options.scrubber(raw));

  const approved = readApprovedOrEmpty(approvedPath);

  if (approved === null) {
    writer.write(receivedPath, received);
    await options.reporter.report(receivedPath, approvedPath);
    throw new ApprovalMissingError(
      `No approved file found.\n  approved: ${approvedPath}\n  received: ${receivedPath}\nReview the received file and rename it to .approved if correct.`,
    );
  }

  if (options.comparator.equals(received, normalize(approved))) {
    deleteIfExists(receivedPath);
    return;
  }

  writer.write(receivedPath, received);
  await options.reporter.report(receivedPath, approvedPath);
  throw new ApprovalMismatchError(
    `Approval mismatch.\n  approved: ${approvedPath}\n  received: ${receivedPath}`,
  );
}

export async function verifyAsJson(
  data: unknown,
  partial: PartialOptions = {},
): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  return verify(json, { extension: "json", ...partial });
}

export async function verifyHtml(
  html: string,
  partial: PartialOptions = {},
): Promise<void> {
  return verify(prettyHtml(html), { extension: "html", ...partial });
}

export async function verifyXml(
  xml: string,
  partial: PartialOptions = {},
): Promise<void> {
  return verify(prettyXml(xml), { extension: "xml", ...partial });
}

/**
 * Verifies the contents of an existing file on disk against an approved
 * golden file. The file's extension is used for the approved file unless
 * overridden via options.
 */
export async function verifyFile(
  filePath: string,
  partial: PartialOptions = {},
): Promise<void> {
  const content = readFileSync(filePath, "utf8");
  const ext = filePath.split(".").pop() ?? "txt";
  return verify(content, { extension: ext, ...partial });
}

/**
 * Runs `fn` and verifies the resulting error's name + message against the
 * approved file. Fails if `fn` does not throw.
 */
export async function verifyException(
  fn: () => unknown | Promise<unknown>,
  partial: PartialOptions = {},
): Promise<void> {
  let formatted: string;
  try {
    await fn();
    formatted = "<no exception thrown>";
  } catch (err) {
    if (err instanceof Error) {
      formatted = `${err.name}: ${err.message}`;
    } else {
      formatted = String(err);
    }
  }
  return verify(formatted, partial);
}

/**
 * Verifies a binary buffer against an approved file. Comparison is byte-exact;
 * scrubbers and line-ending normalization do not apply.
 */
export async function verifyBinary(
  data: Buffer,
  partial: PartialOptions = {},
): Promise<void> {
  const options = withOptions({ extension: "bin", ...partial });
  const { approvedPath, receivedPath } = options.namer.names(options.extension);
  const writer: Writer = options.writer;

  const approved = readApprovedBinaryOrNull(approvedPath);

  if (approved === null) {
    writer.writeBinary(receivedPath, data);
    await options.reporter.report(receivedPath, approvedPath);
    throw new ApprovalMissingError(
      `No approved file found.\n  approved: ${approvedPath}\n  received: ${receivedPath}\nReview the received file and rename it to .approved if correct.`,
    );
  }

  if (approved.equals(data)) {
    deleteIfExists(receivedPath);
    return;
  }

  writer.writeBinary(receivedPath, data);
  await options.reporter.report(receivedPath, approvedPath);
  throw new ApprovalMismatchError(
    `Approval mismatch.\n  approved: ${approvedPath}\n  received: ${receivedPath}`,
  );
}
