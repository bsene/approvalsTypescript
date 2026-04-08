# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

| Command | Purpose |
|---------|---------|
| `pnpm build` | Compile TypeScript to `dist/` using `tsup`. |
| `pnpm test` | Run all Vitest tests (`vitest run`). |
| `pnpm test:watch` | Run Vitest in watch mode (`vitest`). |
| `pnpm typecheck` | Run TypeScript compiler in no‑emit mode (`tsc --noEmit`). |
| `pnpm test <file>` | Run a single test file (e.g., `pnpm test test/greeter.test.ts`). |

## High‑Level Architecture

* **Library Purpose** – A TypeScript port of [ApprovalTests.Python](https://github.com/approvals/ApprovalTests.Python) for Vitest. It provides *golden‑master* testing utilities: `verify`, `verifyAsJson`, and `verifyHtml`.
* **Core Concepts**
  * **Approved Files** – On first run, a `.received.<ext>` file is written next to the test and the test fails with `ApprovalMissingError`. The developer reviews the file and renames it to `.approved.<ext>`.
  * **Scrubbers** – Functions that remove volatile data (GUIDs, timestamps, etc.) before comparison. Built‑in scrubbers include `scrubGuids`, `scrubDates`, and `scrubAll`. Custom scrubbers can be composed with `combine`.
  * **Reporters** – The default `CommandLineReporter` prints a unified diff. Custom reporters implement the `Reporter` interface.
  * **Options** – `extension`, `scrubber`, and `reporter` can be passed to `verify` functions.
* **Build Output** – Compiled files live in `dist/`. The package exports the ESM entry `dist/index.js` and type definitions `dist/index.d.ts`.
* **Testing** – Vitest is the test runner. Tests reside in the `test/` directory and import the library via `import { verify } from "approvals-ts"`.

## Important Files

| Path | Description |
|------|-------------|
| `src/` | Source TypeScript files implementing the library. |
| `test/` | Vitest test files exercising the library. |
| `tsup.config.ts` | Configuration for `tsup` build. |
| `vitest.config.ts` | Vitest configuration. |
| `package.json` | Scripts, dependencies, and build configuration. |
| `tsconfig.json` | TypeScript compiler options. |

## Usage Snippet

```ts
import { verify, verifyAsJson } from "approvals-ts";

await verify("Hello, world!");
await verifyAsJson({ name: "ada", skills: ["math", "code"] });
```

## Common Errors

* `ApprovalMissingError` – No approved file exists. Rename the generated `.received.<ext>` to `.approved.<ext>`. |
* `ApprovalMismatchError` – Received content differs from approved. Inspect the `.received.<ext>` file and update the approved file if the change is intentional. |

## Development Tips

* Run `pnpm test:watch` while writing tests to get instant feedback. |
* Use `pnpm typecheck` to catch type errors before committing. |
* When adding new scrubbers or reporters, place them in `src/` and export them from `src/index.ts`. |

---

**Note**: This repository does not contain any `.cursor` or Copilot instruction files. The README provides the primary usage guidance.
