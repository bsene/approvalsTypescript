import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export class ApprovalMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApprovalMismatchError";
  }
}

export class ApprovalMissingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApprovalMissingError";
  }
}

export function normalize(content: string): string {
  return content.replace(/\r\n/g, "\n");
}

export function writeReceived(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

export function writeReceivedBinary(path: string, content: Buffer): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

export function readApprovedOrEmpty(path: string): string | null {
  if (!existsSync(path)) return null;
  return readFileSync(path, "utf8");
}

export function readApprovedBinaryOrNull(path: string): Buffer | null {
  if (!existsSync(path)) return null;
  return readFileSync(path);
}

export function deleteIfExists(path: string): void {
  if (existsSync(path)) rmSync(path);
}
