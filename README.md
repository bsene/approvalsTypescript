# approvals-ts

A TypeScript port of [ApprovalTests.Python](https://github.com/approvals/ApprovalTests.Python) for [Vitest](https://vitest.dev). Golden-master testing: assert that output matches an approved file on disk, review diffs when it doesn't.

## Install

```sh
pnpm add -D approvals-ts
```

Requires Node 20+ and Vitest 2+.

## Usage

```ts
import { describe, it } from "vitest";
import { verify, verifyAsJson, verifyHtml } from "approvals-ts";

describe("greeter", () => {
  it("greets the world", async () => {
    await verify("Hello, world!");
  });

  it("serializes a user", async () => {
    await verifyAsJson({ name: "ada", skills: ["math", "code"] });
  });
});
```

On the first run, no approved file exists, so `verify` writes a `.received.<ext>` next to the test file and fails with `ApprovalMissingError`. Review the received content and rename it to `.approved.<ext>` to lock it in. On subsequent runs, mismatches are reported via a unified diff and a `.received.<ext>` is left behind for inspection.

File names are derived from the current Vitest test:

```
<testFile>.<sanitized test name>.approved.<ext>
```

## Scrubbers

Strip volatile data (GUIDs, timestamps, etc.) before comparison:

```ts
import { verify, combine, scrubGuids, scrubDates } from "approvals-ts";

await verify(payload, { scrubber: combine(scrubGuids, scrubDates) });
```

Build your own with `scrubAll(pattern, replacement)`.

## Options

```ts
interface Options {
  extension: string;   // default: "txt"
  scrubber: Scrubber;  // default: identity
  reporter: Reporter;  // default: CommandLineReporter
}
```

Pass any subset as the second argument to `verify` / `verifyAsJson` / `verifyHtml`.

## Custom reporters

Implement the `Reporter` interface to plug in your favorite diff tool:

```ts
import type { Reporter } from "approvals-ts";

class MyReporter implements Reporter {
  report(received: string, approved: string) {
    // open in Beyond Compare, VS Code, etc.
  }
}
```

## Errors

- `ApprovalMissingError` — no approved file yet (first run or deleted).
- `ApprovalMismatchError` — content drifted from the approved file.

Both leave a `.received.<ext>` on disk for review.

## Scripts

```sh
pnpm test       # run vitest
pnpm build      # tsup → dist/
pnpm typecheck  # tsc --noEmit
```

## Status

MVP. Core verify + namer + reporter + scrubbers are in. Out of scope for now: `GenericDiffReporterFactory`, combinations / pairwise, storyboard, logging verify, CLI.

## Reference

This library is a TypeScript port of [ApprovalTests.Python](https://github.com/approvals/ApprovalTests.Python), part of the broader [Approval Tests](https://approvaltests.com) family originally created by Llewellyn Falco. Credit for the design and ideas goes to the upstream maintainers.
