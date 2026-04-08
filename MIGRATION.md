# Migration Status — porting from ApprovalTests.Python

Tracks which features of [ApprovalTests.Python](https://github.com/approvals/ApprovalTests.Python) have been ported to this TypeScript implementation.

Legend: ✅ done · ⚠️ partial · ❌ not started · ➖ not applicable

## Verify functions
| Python | TS | Status | Notes |
|---|---|---|---|
| `verify` | `verify` | ✅ | |
| `verify_as_json` | `verifyAsJson` | ✅ | |
| `verify_html` | `verifyHtml` | ✅ | **Added:** pretty-print with auto-void-element normalization |
| `verify_xml` | `verifyXml` | ✅ | **Added:** full XML pretty-print (comments, CDATA, decls, PIs) |
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
| `GenericDiffReporter` + factory + `reporters.json` | — | ❌ no factory, no config loading |
| `CommandLineReporter` (unified diff) | `CommandLineReporter` | ✅ |
| `MultiReporter` | `MultiReporter` | ✅ **Added:** composes multiple reporters |
| `FirstWorkingReporter` | — | ❌ |
| `ClipboardReporter` | — | ❌ |
| `ReceivedFileLauncherReporter` | — | ❌ |
| `ReporterThatAutomaticallyApproves` | — | ❌ |
| `ReporterThatCreatesAnApprovalScript` | — | ❌ |
| `ReportQuietly` / `PythonNativeReporter` / others | — | ❌ |

## Namers
| Python | TS | Status |
|---|---|---|
| Public `Namer` interface | `Namer` | ✅ **Added:** exported from `src/namer/namer.ts` |
| `StackFrameNamer` (default) | `vitestNamer` | ✅ |
| `ScenarioNamer` | — | ❌ |
| `CliNamer` | — | ❌ |
| `InlineComparator` | — | ❌ |

## Writers
| Python | TS | Status |
|---|---|---|
| Public `Writer` interface | — | ❌ |
| `StringWriter` | internal `writeReceived` | ✅ (internal, not pluggable) |
| `BinaryWriter` | internal `writeReceivedBinary` | ✅ (internal, not pluggable) |
| `ExistingFileWriter` | — | ❌ |

## Options / configuration
| Python | TS | Status |
|---|---|---|
| `Options` object | `Options` interface | ✅ |
| `with_reporter` / `add_reporter` (multi) | accepts `Reporter[]` in `partial` | ✅ |
| `with_namer` | `names?: Namer` in options | ✅ |
| `with_scrubber` / `add_scrubber` | accepts `Scrubber[]` in `partial` | ✅ |
| `with_comparator` | `comparator?: Comparator` in options | ✅ **Added:** pluggable comparator |
| `inline(...)` | — | ❌ |
| Fluent builder API | `withOptions(partial)` merge | ✅ |

## Other abstractions
| Python | TS | Status |
|---|---|---|
| `Comparator` core interface | `Comparator` interface | ✅ **Added:** exported from `src/comparator.ts` |
| `FormatWrapper` / `register_formatter` | — | ❌ |
| `FileApprover` low-level engine | inlined in `verify.ts` | ⚠️ |
| Combination / pairwise module | — | ❌ |
| `approvaltests.asserts` wrappers | — | ❌ |
| pytest / unittest integration plugins | implicit Vitest coupling | ⚠️ |
| `ApprovalException` | `ApprovalMissingError`, `ApprovalMismatchError` | ✅ (split into two) |
| XML/HTML pretty-printers | `prettyXml`, `prettyHtml` | ✅ **Added:** `src/format/xml.ts`, `src/format/html.ts` |

## Summary
- **Verify variants:** 7 + 2 pretty-print wrappers / ~12 ported.
- **Pluggable seams:** ✅ Namer, ✅ Comparator fully pluggable; ❌ Writer still internal.
- **Scrubbers:** 5 / 8+ ported.
- **Reporters:** 2 / ~20 core ported; no factory or composition configuration.

## TODO: Remaining Priorities

### High Priority (Pluggable Seams Complete)
1. ✅ **Namer** – Done (public interface + Vitest implementation)
2. ✅ **Comparator** – Done (public interface + stringComparator)
3. ✅ **MultiReporter** – Done (composite pattern)
4. ⚠️ **Writer interface** – Implementation exists but not public interface

### Medium Priority (Core Missing Features)
- [ ] `Writer` interface (StringWriter, BinaryWriter as pluggable)
- [ ] `ExistingFileWriter` for `verifyFile` with custom destinations
- [ ] Reporter factory + `reporters.json` configuration loading
- [ ] `ScenarioNamer` for scenario-based test naming
- [ ] `CliNamer` for CLI test mode

### Lower Priority (Advanced features)
- [ ] `verify_all` and `verify_all_combinations` / pairwise
- [ ] Inline approvals syntax
- [ ] Storyboard feature
- [ ] `verify_with_namer` / `verify_with_namer_and_writer` helpers
- [ ] Custom `Comparator` implementations (fuzzy, tolerance-based)
- [ ] Date format scrubber with built-in formats
- [ ] `scrub_lines_containing` scrubber
