# Copy audit — repair 2

Checked 2026-09-06. Counts treat commands, hyphenated terms, and version
strings as one word. No visitor-facing sentence exceeds 22 words. No banned
marketing word or metaphor heading remains. Imperative safety guidance is not
a capability claim.

## Landing and demo copy

| Copy unit | Words | Claim or status |
| --- | ---: | --- |
| Skip to main content | 4 | navigation |
| Runs locally · nothing uploaded | 4 | `browser-local-processing`, `site-privacy` |
| Log Duplicate Lens / Local diagnostic · 0.1.0 | 3 / 3 | identity |
| Demo / Install CLI / Privacy / Terms | 1 / 2 / 1 / 1 | navigation |
| Duplicate log checker | 3 | page label |
| Find duplicate Loki logs across streams | 6 | first-screen job |
| For Loki operators checking whether duplicate ingestion inflates alerts and storage. | 11 | first-screen audience |
| Try it with sample data / See two duplicate groups now. | 5 / 5 | `sample-analysis`, `demo-mobile-result` |
| Processes samples in this browser | 5 | `browser-local-processing` |
| Browser input limit: 5 MB | 5 | `browser-limit` |
| Evidence, not verdicts | 3 | limitation |
| Install the CLI | 3 | navigation after first-screen facts |
| Three stream traces through one suspected duplicate group | 8 | illustration caption |
| Read messages / Ignore changing request IDs when matching messages | 2 / 7 | `browser-normalization` |
| Set a retry window / Match retry timing | 4 / 3 | `browser-retry-window` |
| Compare streams / List labels that differ between streams | 2 / 6 | `browser-label-evidence` |
| Inspect groups / Review duplicate evidence | 2 / 3 | workflow |
| Browser log checker / Check a log sample | 3 / 5 | section label |
| Paste JSON lines, a Loki response, or plain lines. | 9 | `browser-input-formats` |
| The browser reads up to 5 MB. | 7 | `browser-limit` |
| Log input / Runs in this browser / Log sample | 2 / 4 / 2 | field labels |
| Remove sensitive values from this input before exporting. | 8 | user guidance |
| Show sample result / Choose file / Retry window | 3 / 2 / 2 | controls |
| 0.5 s / 2 s / 5 s | 2 / 2 / 2 | retry-window control |
| Analyze this sample / Results / Awaiting sample | 3 / 1 / 2 | action and result labels |
| No log sample yet | 4 | empty state |
| Show the sample result or choose a log export. | 9 | empty-state next step |
| Duplicate copies / 0% of sample | 2 / 3 | result labels |
| Estimated alerts if every duplicate fires / based on observed events | 6 / 4 | `browser-impact-estimates` |
| Extra log bytes / in suspected duplicate groups | 3 / 4 | `browser-impact-estimates` |
| Export JSON evidence | 3 | `json-export` |
| A match is a lead, not a verdict. | 8 | limitation |
| How to assess a suspected duplicate / What results show | 6 / 3 | section heading |
| Evidence for a duplicate | 4 | heading |
| Look for matching message text across streams within the retry window. | 11 | guidance |
| Cases that need context | 5 | heading |
| Health checks and expected fan-out can look alike. | 8 | limitation |
| Review the stream labels. | 4 | guidance |
| Check retry and sharding settings | 6 | heading |
| Check retry intervals, sharding labels, and producer request IDs before changing a pipeline. | 13 | guidance |
| Command-line tool / Install the CLI | 2 / 3 | CLI section |
| Run the bundled sample before pointing the tool at a log export. | 12 | `cli-demo` |
| Local CLI / UTF-8 | 2 / 1 | terminal labels |
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
| Install the CLI from this checkout. | 6 | instruction |
| Run this from any directory after installation. | 8 | instruction |
| It reads the seven-record bundled sample and writes a report to a new temporary file. | 14 | `cli-demo` |
| The command prints that file path. | 6 | `cli-demo` |
| Automatic format checking accepts JSON lines, Loki query responses, and plain lines. | 11 | `cli-auto-format` |
| Use --format loki when you want to require a Loki response. | 11 | `cli-loki-format` |
| Use --window 1500ms to set the retry window. | 8 | `cli-retry-window` |
| Add --json for a machine-readable report. | 6 | `cli-json` |
| Use --max-events, --max-groups, and --max-input-mb to set limits for large exports. | 10 | `cli-limits` |
| Use --redact before sharing a report. | 6 | `cli-redaction` |
| Redaction covers message, label, timing, and evidence text in reports. | 10 | `cli-redaction` |
| Default matching ignores changing UUIDs, IP addresses, embedded timestamps, and numbers with four or more digits. | 15 | `cli-default-normalization` |
| Use --normalize none to compare the literal message text. | 9 | `cli-default-normalization` |
| Add --normalize-rule to rewrite a changing message fragment before matching. | 10 | `cli-normalize-rule` |
| Repeat the option for more rewrites. | 6 | `cli-normalize-rule` |
| Use --ignore-label pod when a changing label should not define a separate stream. | 13 | `cli-ignore-label` |
| Ignored labels are also omitted from reported stream evidence. | 9 | `cli-ignore-label` |
| Use --message-field, --timestamp-field, and --stream-field when your JSON lines use different field names. | 12 | `cli-custom-fields` |
| The CLI reads standard input when the input path is -. | 11 | `cli-stdin` |
| A suspected duplicate group is a lead, not proof of bad ingestion. | 12 | limitation |
| Check retry timing, stream sharding, and producer request IDs before changing a pipeline. | 12 | guidance |
| Requirements: Rust 1.85+, Node 22+, and npm 10+. | 8 | development requirement |
| npm run build creates the binary and static site. | 9 | build instruction |
| Deploy dist/site/ with the factory static deploy work order. | 8 | deployment instruction |
| npm run pack:cli prepares a crate but does not publish it. | 9 | packaging instruction |
| The browser demo uses its own demo: local-storage key. | 9 | `demo-isolation` |
| Resetting reruns the sample. | 4 | `demo-isolation` |
| Leaving the demo removes that key. | 6 | `demo-isolation` |
| The CLI makes no network requests. | 6 | `cli-local-processing` |
| It does not upload log content or emit telemetry. | 9 | `cli-local-processing` |

## Terminology

| Concept | One term used |
| --- | --- |
| Candidate set of repeated logs | suspected duplicate group |
| Extra observations | duplicate copies |
| Data source identity | stream |
| Time matching control | retry window |
| Built-in trial data | sample |
| Long changing number within a message | request ID |

The catalog description is 85 characters before its newline. It starts with
“Find” and stays below the 120-character limit.
