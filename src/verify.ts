import { namesFromVitest } from "./namer/vitestNamer.js";
import { withOptions, type Options } from "./options.js";
import {
  ApprovalMismatchError,
  ApprovalMissingError,
  deleteIfExists,
  normalize,
  readApprovedOrEmpty,
  writeReceived,
} from "./writer/fileWriter.js";

export async function verify(
  data: unknown,
  partial: Partial<Options> = {},
): Promise<void> {
  const options = withOptions(partial);
  const { approvedPath, receivedPath } = namesFromVitest(options.extension);

  const raw = typeof data === "string" ? data : String(data);
  const received = normalize(options.scrubber(raw));

  const approved = readApprovedOrEmpty(approvedPath);

  if (approved === null) {
    writeReceived(receivedPath, received);
    await options.reporter.report(receivedPath, approvedPath);
    throw new ApprovalMissingError(
      `No approved file found.\n  approved: ${approvedPath}\n  received: ${receivedPath}\nReview the received file and rename it to .approved if correct.`,
    );
  }

  if (normalize(approved) === received) {
    deleteIfExists(receivedPath);
    return;
  }

  writeReceived(receivedPath, received);
  await options.reporter.report(receivedPath, approvedPath);
  throw new ApprovalMismatchError(
    `Approval mismatch.\n  approved: ${approvedPath}\n  received: ${receivedPath}`,
  );
}

export async function verifyAsJson(
  data: unknown,
  partial: Partial<Options> = {},
): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  return verify(json, { extension: "json", ...partial });
}

export async function verifyHtml(
  html: string,
  partial: Partial<Options> = {},
): Promise<void> {
  return verify(html, { extension: "html", ...partial });
}
