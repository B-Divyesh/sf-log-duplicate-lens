# Copy audit — polish 5

Checked 2026-08-28. Counts treat hyphenated terms, options, and version strings
as one word. No visitor-facing sentence exceeds 22 words. No text uses the
banned marketing words. Imperative safety guidance is not represented as a
product capability.

## Landing and demo copy

| Copy unit | Words | Claim or status |
| --- | ---: | --- |
| Skip to main content | 4 | navigation |
| Local circuit ready · nothing uploaded | 5 | `browser-local-processing`, `site-privacy` |
| Log Duplicate Lens / Local diagnostic · 0.1.0 | 3 / 3 | identity |
| Demo / Install CLI / Privacy / Terms | 1 / 2 / 1 / 1 | navigation |
| Instrument 04 · Find duplicate logs across streams | 7 | context |
| Find duplicate Loki logs across streams | 6 | first-screen job |
| For Loki operators checking whether duplicate ingestion inflates alerts and storage. | 11 | first-screen audience |
| Try it with sample data / See two duplicate groups now. | 5 / 5 | `sample-analysis`, `demo-mobile-result` |
| Processes samples in this browser | 5 | `browser-local-processing` |
| Browser input limit: 5 MB | 5 | `browser-limit` |
| Evidence, not verdicts | 3 | limitation |
| Three stream traces through one suspected duplicate group | 8 | illustration caption |
| Read messages / Ignore changing request IDs when matching messages | 2 / 7 | `browser-normalization` |
| Set a retry window / Match retry timing | 4 / 3 | `browser-retry-window` |
| Compare streams / List labels that differ between streams | 2 / 6 | `browser-label-evidence` |
| Inspect groups / Review duplicate evidence | 2 / 3 | workflow |
| Bench test · browser edition / Check a log sample | 4 / 4 | context |
| Paste JSON lines, a Loki response, or plain lines. | 9 | `browser-input-formats` |
| The browser reads up to 5 MB. | 7 | `browser-limit` |
| Input A / Local circuit / Log sample | 2 / 2 / 2 | field labels |
| Remove sensitive values from this input before exporting. | 8 | user guidance; no browser-redaction promise |
| Show sample result | 3 | `browser-sample-action` |
| Choose file / Retry window | 2 / 2 | controls |
| 0.5 s / 2 s / 5 s | 2 / 2 / 2 | `browser-retry-window` controls |
| Analyze this sample | 3 | action |
| Readout B / Awaiting sample | 2 / 2 | status |
| No sample on the bench | 5 | empty state |
| Show the sample result or choose a log export. | 9 | empty-state action |
| Duplicate copies / 0% of sample | 2 / 3 | result labels |
| Estimated alerts if every duplicate fires / based on observed events | 6 / 4 | `browser-impact-estimates` |
| Extra log bytes / in suspected duplicate groups | 3 / 4 | `browser-impact-estimates` |
| Export JSON evidence | 3 | `json-export` |
| A match is a lead, not a verdict. | 8 | limitation |
| How to assess a suspected duplicate | 6 | section label |
| What the readout can—and cannot—tell you | 8 | heading |
| Evidence for a duplicate | 4 | heading |
| Look for matching message text across streams within the retry window. | 11 | interpretation |
| Cases that need context | 5 | heading |
| Health checks and expected fan-out can look alike. | 8 | limitation |
| Review the stream labels. | 4 | guidance |
| Check retry and sharding settings | 6 | heading |
| Check retry intervals, sharding labels, and producer request IDs before changing a pipeline. | 13 | guidance |
| Single binary / Put the lens beside your logs | 2 / 6 | CLI section |
| Run the bundled sample before pointing the tool at a log export. | 12 | `cli-demo` |
| Copy install command | 3 | action |
| Demo: uses the bundled seven-record sample and writes a temporary report. | 11 | `cli-demo` |
| JSON: use --json for a machine-readable report. | 7 | `cli-json` |
| Limits: set --max-events, --max-groups, and --max-input-mb. | 6 | `cli-limits` |
| Captured from the real CLI demo using the bundled seven-record sample. | 11 | `cli-demo-recording` |
| Read recording transcript | 3 | action |
| Bundled sample: 7 labeled log records | 6 | `cli-demo` |
| Result: 2 suspected duplicate groups / 3 duplicate copies | 8 | `cli-demo`, `sample-analysis` |
| Demo report: /tmp/log-duplicate-lens-demo-….json | 3 | `cli-demo` |
| Find suspected duplicate groups across Loki streams. | 7 | `cli-detection` |
| Built by Param Factory · v0.1.0 | 6 | attribution/build id |
| View source code | 3 | action |
| Demo — sample data, nothing is saved | 7 | `demo-isolation` |
| Reset demo / Start for real | 2 / 3 | demo actions |
| Review the sample duplicate groups | 5 | demo route h1 |

## README sentences

| Copy unit | Words | Claim or status |
| --- | ---: | --- |
| Find suspected duplicate Loki logs across streams. | 7 | `cli-detection` |
| For Loki and JSON-log operators checking whether duplicate ingestion inflates alerts and storage. | 12 | audience |
| The report shows messages, timing, and stream labels for each suspected duplicate group. | 12 | `report-evidence` |
| Try the browser sample at the live demo URL. | 8 | demo link |
| Build the single Rust binary from this checkout. | 8 | install instruction |
| Run this from any directory after installation. | 8 | CLI instruction |
| It reads the seven-record bundled sample and writes a report to a new temporary file. | 14 | `cli-demo` |
| The command prints that file path. | 6 | `cli-demo` |
| Use --format loki for a Loki query response. | 8 | `cli-loki-format` |
| Use --window 1500ms to set the retry window. | 8 | `cli-retry-window` |
| Add --json for a machine-readable report. | 7 | `cli-json` |
| Use --max-events, --max-groups, and --max-input-mb to set limits for large exports. | 10 | `cli-limits` |
| Use --redact before sharing a report. | 6 | `cli-redaction` |
| A suspected duplicate group is a lead, not proof of bad ingestion. | 12 | limitation |
| Check retry timing, stream sharding, and producer request IDs before changing a pipeline. | 12 | guidance |
| Requirements: Rust 1.85+, Node 22+, and npm 10+. | 8 | development requirement |
| npm run build creates the binary and static site. | 9 | build instruction |
| Deploy dist/site/ with the factory static deploy work order. | 8 | deployment instruction |
| npm run pack:cli prepares a crate but does not publish it. | 9 | packaging instruction |
| The browser demo uses its own demo: local-storage key. | 9 | `demo-isolation` |
| Resetting reruns the sample. | 4 | `demo-isolation` |
| Leaving the demo removes that key. | 6 | `demo-isolation` |
| See the privacy notice and terms. | 6 | legal links |
| MIT © 2026 Sociobot (Param Factory). | 5 | license |

## Terminology

| Concept | One term used |
| --- | --- |
| Candidate set of repeated logs | suspected duplicate group |
| Extra observations | duplicate copies |
| Data source identity | stream |
| Time matching control | retry window |
| Built-in trial data | sample |
| Long changing number within a message | request ID |

The catalog sentence is 83 characters before its newline, starts with “Find,”
and stays below the 120-character limit.
