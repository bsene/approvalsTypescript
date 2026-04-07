# Migration Status — porting from ApprovalTests.Python

Tracks which features of [ApprovalTests.Python](https://github.com/approvals/ApprovalTests.Python) have been ported to this TypeScript implementation.

Legend: ✅ done · ⚠️ partial · ❌ not started · ➖ not applicable

## Verify functions
| Python | TS | Status | Notes |
|---|---|---|---|
| `verify` | `verify` | ✅ | |
| `verify_as_json` | `verifyAsJson` | ✅ | |
| `verify_html` | `verifyHtml` | ⚠️ | no pretty-print (Python uses BeautifulSoup) |
| `verify_xml` | `verifyXml` | ⚠️ | no pretty-print |
| `verify_file` | `verifyFile` | ✅ | |
| `verify_binary` | `verifyBinary` | ✅ | bypasses scrubbers + line-ending normalization |
| `verify_exception` | `verifyException` | ✅ | |
| `verify_all` (collection + header + formatter) | — | ❌ | |
| `verify_all_combinations` / pairwise | — | ❌ | |
| `verify_with_namer` | — | ❌ | needs public Namer seam |
| `verify_with_namer_and_writer` | — | ❌ | needs public Namer + Writer seams |
| `verify_executable_command` | — | ❌ | |
| `verify_argument_parser` | — | ➖ | Python-specific |
| Inline approvals | — | ❌ | |
| Storyboard | — | ❌ | |

## Scrubbers
| Python | TS | Status |
|---|---|---|
| `scrub_all_guids` | `scrubGuids` | ✅ |
| `scrub_all_dates` (single regex) | `scrubDates` | ✅ |
| `DateScrubber` (~17 built-in formats) | — | ❌ |
| `create_regex_scrubber` | `scrubAll` | ✅ |
| `combine_scrubbers` | `combine` | ✅ |
| `scrub_lines_containing` / `create_line_scrubber` | — | ❌ |
| Lambda-replacement scrubber template | — | ❌ (`scrubAll` only takes a string) |

## Reporters
| Python | TS | Status |
|---|---|---|
| `Reporter` interface | `Reporter` | ✅ |
| `GenericDiffReporter` + factory + `reporters.json` | — | ❌ |
| `CommandLineReporter` (unified diff) | `CommandLineReporter` | ✅ |
| `MultiReporter` | — | ❌ |
| `FirstWorkingReporter` | — | ❌ |
| `ClipboardReporter` | — | ❌ |
| `ReceivedFileLauncherReporter` | — | ❌ |
| `ReporterThatAutomaticallyApproves` | — | ❌ |
| `ReporterThatCreatesAnApprovalScript` | — | ❌ |
| `ReportQuietly` / `PythonNativeReporter` / others | — | ❌ |

## Namers
| Python | TS | Status |
|---|---|---|
| Public `Namer` interface | — | ❌ |
| `StackFrameNamer` (default) | `namesFromVitest` (internal) | ⚠️ Vitest-only, not exported |
| `ScenarioNamer` | — | ❌ |
| `CliNamer` | — | ❌ |
| `InlineComparator` | — | ❌ |

## Writers
| Python | TS | Status |
|---|---|---|
| Public `Writer` interface | — | ❌ |
| `StringWriter` | internal `writeReceived` | ⚠️ not pluggable |
| `BinaryWriter` | internal `writeReceivedBinary` | ⚠️ not pluggable |
| `ExistingFileWriter` | — | ❌ |

## Options / configuration
| Python | TS | Status |
|---|---|---|
| `Options` object | `Options` interface | ⚠️ minimal — only `extension`, `scrubber`, `reporter` |
| `with_reporter` / `add_reporter` (multi) | reporter field | ⚠️ no multi |
| `with_namer` | — | ❌ |
| `with_scrubber` / `add_scrubber` | scrubber field | ⚠️ no multi |
| `with_comparator` | — | ❌ |
| `inline(...)` | — | ❌ |
| Fluent builder API | `withOptions(partial)` merge | ⚠️ |

## Other abstractions
| Python | TS | Status |
|---|---|---|
| `Comparator` core interface | — | ❌ |
| `FormatWrapper` / `register_formatter` | — | ❌ |
| `FileApprover` low-level engine | inlined in `verify.ts` | ⚠️ |
| Combination / pairwise module | — | ❌ |
| `approvaltests.asserts` wrappers | — | ❌ |
| pytest / unittest integration plugins | implicit Vitest coupling | ⚠️ |
| `ApprovalException` | `ApprovalMissingError`, `ApprovalMismatchError` | ✅ (split into two) |

## Summary
- **Verify variants:** 7 / ~12 ported (XML/HTML missing pretty-print).
- **Scrubbers:** 5 / 8+ ported.
- **Reporters:** 1 / ~20 ported; no factory or composition.
- **Pluggable seams (Namer/Writer/Reporter/Comparator):** the largest architectural gap — none are publicly extensible yet.
