#!/usr/bin/env node
import { verify, verifyBinary } from "../dist/index.js";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { DefaultReporterFactory } from "../dist/reporters/defaultReporterFactory.js";
import { combine } from "../dist/scrubbers/regex.js";

const args = process.argv.slice(2);
let reporterPath: string | undefined;
let binary = false;
let outputPath: string | undefined;
let scrubPattern: string | undefined;
let filePath: string | undefined;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--reporter" && i + 1 < args.length) {
    reporterPath = resolve(args[i + 1]);
    i++;
  } else if (args[i] === "--binary") {
    binary = true;
  } else if (args[i] === "--output" && i + 1 < args.length) {
    outputPath = resolve(args[i + 1]);
    i++;
  } else if (args[i] === "--scrub" && i + 1 < args.length) {
    scrubPattern = args[i + 1];
    i++;
  } else if (!filePath) {
    filePath = resolve(args[i]);
  }
}
if (!filePath) {
  console.error("Usage: approvals-cli [--reporter <module>] [--binary] [--output <path>] [--scrub <pattern>] <file>");
  process.exit(1);
}
let content = readFileSync(filePath, binary ? undefined : "utf8");
if (scrubPattern) {
  const scrubber = combine((s: string) => s.replace(new RegExp(scrubPattern, "g"), ""));
  content = scrubber(content as string);
}
const ext = filePath.split(".").pop();
let extension = "txt";
if (ext === "json") extension = "json";
else if (ext === "html") extension = "html";
else if (ext === "xml") extension = "xml";

const factory = new DefaultReporterFactory();
const reporter = reporterPath
  ? factory.create({ type: "custom", customReporterPath: reporterPath })
  : factory.create({ type: "cli" });

const verifyFn = binary ? verifyBinary : verify;
verifyFn(content as any, { extension, reporter }).catch((e) => {
  console.error(e.message);
  process.exit(1);
});

if (outputPath) {
  writeFileSync(outputPath, typeof content === "string" ? content : Buffer.from(content), binary ? undefined : "utf8");
}
