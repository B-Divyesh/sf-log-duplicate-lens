# Adversarial first-read review 3

Reviewed 2026-08-28 against deployed production and a clean clone of 0d5328821a410afe6220d93a8834f38f39107d66.

## Verdict: FAIL

Six findings remain. One declared claim command fails. The CLI page has a static transcript instead of the required local terminal recording. PASS requires zero findings and no failing claim.

## Cold first read

Fresh 390 × 844 and 1440 × 900 Chromium contexts loaded with no console or page errors. Before scrolling, I understood a local tool that finds duplicate Loki logs across streams, for Loki operators checking whether duplicate ingestion inflates alerts and storage. Click Try it with sample data first.

Successful first-screen text:

> “Find duplicate Loki logs across streams”

> “For Loki operators checking whether duplicate ingestion inflates alerts and storage.”

> “Try it with sample data” / “See two duplicate groups now.”

R1-B1 is fixed. There was no 390 px horizontal overflow. The mid-century instrument panel is product-specific, not a generic SaaS template.

## Findings, ordered by severity

### F-3-1 — BLOCKING (recurs R1-B2 / F-2-1): declared mobile-demo claim fails from a clean clone

Location: claims registry demo-mobile-result; site/tests/e2e/site.spec.ts line 26.

The exact registered command failed:

    npx playwright test --project=chromium --grep @claim:demo-mobile-result

The assertion says Expected <= 844; Received 877.625 for the bottom of “2 suspected duplicate groups”. It therefore fails to prove “One click opens the sample result with the demo notice visible on a phone.” A failing claim is blocking.

In a fresh live mobile context the banner was y=4–98 and the heading y=99–135. The source smooth-scrolls then the desktop-Chromium-at-390px command immediately measures the box, making the registered command timing-dependent.

Fix: settle the route-transition scroll before assertion, for example by instant programmatic scrolling, or run the registered check in the mobile project after waiting for scroll settlement. Re-run the exact command.

### F-3-2 — BLOCKING (R1-B3 partly fixed): the landing page has a static transcript, not a terminal recording

Quote/location: “CLI DEMO / BUNDLED SAMPLE”, then literal “$ log-duplicate-lens demo”; site/index.html uses a pre/code block.

The CLI demo command and sample work, but the required self-hosted terminal recording is absent. This unchanging mock-up is labelled as a recording, so it does not show the real command progressing from bundled input to report.

Fix: ship a self-hosted asciinema or SVG capture made from the real log-duplicate-lens demo command, with text fallback and no third-party player. Test that the local asset and fallback load and name the real command/result.

### F-3-3 — minor: a button promises an analysis but only fills the input

Quote/location: “Open sample analysis”. Its handler calls loadSample(false), which fills the textarea and leaves the readout empty.

A visitor expects the named result, then must find and press Analyze this sample.

Fix: rename to “Load sample into input”, or run analysis and call it “Show sample result”. Add an accessible-name and observable-result test.

### F-3-4 — minor: browser redaction is an unlisted, unsupported-looking claim

Quote/location: “Redact sensitive values before sharing the exported report.” in the browser workbench.

There is no browser redaction control. The only registered redaction capability is CLI redaction, located in the README and tested through the CLI. In the workbench this reads as a promised capability but export retains pasted input.

Fix: add browser redaction and a browser-redaction export test, or rewrite: “Remove sensitive values from this input before exporting.”

### F-3-5 — minor: “Hide changing IDs” is an unlisted normalization claim and unexplained jargon

Quote/location: “Hide changing IDs” in How Lens works.

This promises a matching rule but the registry neither names nor tests it. It does not say which values change or how matching treats them.

Fix: write “Ignore changing request IDs when matching messages.” Add a browser-normalization claim with two otherwise-identical cross-stream records whose request IDs differ.

### F-3-6 — minor: “Show differing labels” is an unlisted browser-evidence claim

Quote/location: “Show differing labels” in How Lens works.

The report-evidence claim covers CLI README output, not this browser promise. A visitor can rely on browser evidence to identify the label difference explaining a match.

Fix: add browser-label-evidence with a fixture that asserts the browser identifies a known differing label, such as shard; or change the caption to a non-capability description.

## Demo and sandbox evidence

- Fresh root → Try it with sample data entered /demo in one click. In actual 390 × 844 context it showed the sticky notice, two-group heading, and 3 duplicate copies from 7 records.
- The notice read “Demo — sample data, nothing is saved” and included Reset demo and Start for real.
- With real:review-probe=keep seeded before demo, only demo:log-duplicate-lens:active was added. Reset retained that marker and the 3-copy report. Start for real removed only the demo marker, restored normal empty workbench, and preserved the normal probe.
- Fresh demo navigation made no off-origin request and produced no console/page error. Offline reset is covered by offline-demo.
- From a temporary directory, log-duplicate-lens demo processed the bundled seven-record sample and wrote a temporary report. F-3-2 concerns only the missing page recording.

## Claims command evidence

Clean clone: /tmp/log-duplicate-lens-review3-FEPxQY. npm ci reported zero vulnerabilities. Browser entries were run independently. cargo test --test cli passed all 11 tests, including every nine registered CLI claim test.

| Claim id | Result |
| --- | --- |
| sample-analysis | pass |
| demo-mobile-result | **FAIL** — heading bottom 877.625 px, limit 844 px |
| demo-isolation | pass |
| demo-private | pass |
| json-export | pass |
| browser-limit | pass |
| offline-demo | pass |
| browser-local-processing | pass |
| browser-input-formats | pass |
| site-privacy | pass |
| cli-demo | pass |
| cli-detection | pass |
| cli-json | pass |
| report-evidence | pass |
| cli-loki-format | pass |
| cli-retry-window | pass |
| cli-limits | pass |
| cli-redaction | pass |
| cli-local-processing | pass |

## Earlier finding closure

| Earlier id | Confirmation | Status |
| --- | --- | --- |
| R1-B1 | Cold screen names job, audience, and action. | fixed |
| R1-B2 / F-2-1 | Live mobile works, but declared clean-clone viewport claim fails. | F-3-1 |
| R1-B3 | Bundled CLI demo works; page recording remains a transcript. | F-3-2 |
| R1-B4 / F-2-2 | Reset/leave wording and storage behavior agree. | fixed |
| F-2-3 | Prior coverage exists; F-3-4–F-3-6 are additional browser capabilities. | F-3-4–F-3-6 |
| R1-B5 | No checkout offer or dead purchase link remains. | fixed |
| R1-B6 | Direct demo and styled HTTP 404 work. | fixed |
| R1-M1 / F-2-4 | Retry window and Copy install command are consistent. | fixed |
| F-2-5 | Local 180 × 180 touch icon and 1200 × 630 social card load. | fixed |
| R1-M3, R1-PWA1, R1-PWA2 | Mobile overflow, local assets, and PWA coverage remain. | fixed |

## Structure, routing, and leverage check

Rendered routes have correct title/h1/metadata: root “Log Duplicate Lens — find duplicate Loki logs”; demo “Demo — Log Duplicate Lens”; legal routes have own titles and one h1. Root, demo, privacy, terms, manifest, favicon/touch/social assets, and source link returned 200. Unknown URL returned the designed HTTP 404. Header/footer retain Privacy and Terms; back navigation and focus-to-result were checked.

Raw /demo HTML starts with the root title/canonical and client code updates it at boot. This is acceptable for the SPA runtime check, but does not change the blockers. No AI feature is implied: the brief calls for deterministic local comparison, and import/export already exist.

## Copy audit

Every landing and README copy unit is listed. A means action mismatch; C means unlisted/unsupported capability; J means domain jargon. No unit exceeds 22 words and no banned marketing adjective appears.

### Landing page

| Copy unit | Words | Flag |
| --- | ---: | --- |
| Skip to main content | 4 | — |
| Local circuit ready · nothing uploaded | 5 | local-processing/privacy |
| Log Duplicate Lens / Local diagnostic · 0.1.0 | 3 / 3 | — |
| Demo / Install CLI / Privacy / Terms | 1 / 2 / 1 / 1 | — |
| Instrument 04 · Find duplicate logs across streams | 7 | — |
| Find duplicate Loki logs across streams | 6 | — |
| For Loki operators checking whether duplicate ingestion inflates alerts and storage. | 11 | — |
| Try it with sample data / See two duplicate groups now. | 5 / 5 | sample-analysis |
| Install the CLI | 3 | — |
| Processes samples in this browser | 5 | browser-local-processing |
| Browser input limit: 5 MB | 5 | browser-limit |
| Evidence, not verdicts | 3 | — |
| Three stream traces through one suspected duplicate group | 8 | — |
| Read messages / Hide changing IDs | 2 / 3 | C, J — F-3-5 |
| Set a retry window / Match retry timing | 4 / 3 | — |
| Compare streams / Show differing labels | 2 / 3 | C, J — F-3-6 |
| Inspect groups / Review duplicate evidence | 2 / 3 | — |
| Bench test · browser edition / Check a log sample | 4 / 4 | — |
| Paste JSON lines, a Loki response, or plain lines. | 9 | browser-input-formats; J |
| The browser reads up to 5 MB. | 6 | browser-limit |
| Input A / Local circuit / Log sample | 2 / 2 / 2 | — |
| Redact sensitive values before sharing the exported report. | 8 | C — F-3-4 |
| Open sample analysis | 3 | A — F-3-3 |
| Choose file / Retry window | 2 / 2 | — |
| 0.5 s / 2 s / 5 s | 3 / 2 / 2 | — |
| Analyze this sample | 3 | — |
| Readout B / Awaiting sample | 2 / 2 | — |
| No sample on the bench | 5 | — |
| Open the sample analysis or choose a log export. | 9 | follows F-3-3 |
| Duplicate copies / 0% of sample | 2 / 3 | — |
| Alert amplifier / if each copy fires | 2 / 4 | — |
| Extra bytes / in suspected duplicate groups | 2 / 4 | — |
| Export JSON evidence | 3 | json-export |
| A match is a lead, not a verdict. | 8 | — |
| How to assess a suspected duplicate | 6 | — |
| What the readout can—and cannot—tell you | 8 | — |
| Evidence for a duplicate | 4 | — |
| Look for one normalized message across streams within the retry window. | 10 | J; clarify with F-3-5 |
| Cases that need context | 5 | — |
| Health checks and expected fan-out can look alike. / Review the stream labels. | 8 / 4 | J |
| Check retry and sharding settings | 6 | J |
| Check retry intervals, sharding labels, and producer request IDs before changing a pipeline. | 13 | J |
| Single binary / Put the lens beside your logs | 2 / 6 | — |
| Run the bundled sample before pointing the tool at a log export. | 11 | cli-demo |
| Local / Operator / UTF-8 | 1 / 1 / 1 | — |
| Copy install command | 3 | — |
| Demo: uses the bundled seven-record sample and writes a temporary report. | 9 | cli-demo |
| JSON: use --json for a machine-readable report. | 7 | cli-json |
| Limits: set --max-events, --max-groups, and --max-input-mb. | 6 | cli-limits |
| CLI demo / bundled sample / Local | 2 / 2 / 1 | F-3-2 |
| Bundled sample: 7 labeled log records | 6 | cli-demo |
| Result: 2 suspected duplicate groups / 3 duplicate copies | 8 | sample-analysis/cli-demo |
| Demo report: /tmp/log-duplicate-lens-demo-….json | 3 | cli-demo |
| Find suspected duplicate groups across Loki streams. | 7 | cli-detection |
| Built by Param Factory · v0.1.0 / View source code | 5 / 3 | — |

### README

| Copy unit | Words | Flag |
| --- | ---: | --- |
| Log Duplicate Lens | 3 | — |
| Find suspected duplicate Loki logs across streams. | 7 | cli-detection |
| For Loki and JSON-log operators checking whether duplicate ingestion inflates alerts and storage. | 12 | — |
| The report shows messages, timing, and stream labels for each suspected duplicate group. | 12 | report-evidence |
| Try the browser sample at https://log-duplicate-lens.sociobot.in/demo. | 6 | — |
| Install / Try the bundled sample / Analyze a log export | 1 / 4 / 4 | — |
| Build the single Rust binary from this checkout: | 8 | — |
| Run this from any directory after installation: | 8 | — |
| It reads the seven-record bundled sample and writes a report to a new temporary file. | 14 | cli-demo |
| The command prints that file path. | 6 | cli-demo |
| Use --format loki for a Loki query response. | 8 | cli-loki-format; J |
| Use --window 1500ms to set the retry window. | 8 | cli-retry-window |
| Add --json for a machine-readable report. | 5 | cli-json |
| Use --max-events, --max-groups, and --max-input-mb to set limits for large exports. | 10 | cli-limits |
| Use --redact token=[^ ]+=>token=[REDACTED] before sharing a report. | 6 | cli-redaction; J |
| What a result means | 5 | — |
| A suspected duplicate group is a lead, not proof of bad ingestion. | 12 | — |
| Check retry timing, stream sharding, and producer request IDs before changing a pipeline. | 12 | J |
| Develop, test, and deploy | 4 | — |
| Requirements: Rust 1.85+, Node 22+, and npm 10+. | 8 | — |
| npm run build creates the binary in target/release/ and the static site in dist/site/. | 11 | — |
| Deploy dist/site/ with the factory static deploy work order. | 8 | — |
| npm run pack:cli prepares a crate but does not publish it. | 9 | — |
| Privacy and license | 3 | — |
| The browser demo uses its own demo: local-storage key. | 9 | demo-isolation |
| Resetting reruns the sample. | 4 | demo-isolation |
| Leaving the demo removes that key. | 6 | demo-isolation |
| See the privacy notice and terms. | 6 | — |
| MIT © 2026 Sociobot (Param Factory). See LICENSE. | 7 | — |

## What would make this perfect

Make the exact 390 px claim deterministic and passing, replace the transcript with a local real-command recording, make the sample-load action truthful, and resolve the three unregistered browser capabilities. Then rerun all 19 claims from a fresh clone and repeat the full review. Only zero findings supports PASS.

