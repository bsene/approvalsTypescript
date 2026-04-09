#!/usr/bin/env node
import { verify } from "../dist/index.js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: approvals-cli <file> [--json|--html|--xml] [--output <path>]");
  process.exit(1);
}
const filePath = resolve(args[0]);
const content = readFileSync(filePath, "utf8");
const ext = filePath.split(".").pop();
let extension = "txt";
if (ext === "json") extension = "json";
else if (ext === "html") extension = "html";
else if (ext === "xml") extension = "xml";

verify(content, { extension }).catch((e) => {
  console.error(e.message);
  process.exit(1);
});
