# Adversarial first-read review 2

Reviewed 2026-08-28 against the deployed site and commit 767ee41.

## Verdict: FAIL

The landing screen is clear and all seven declared claim commands pass from a clean clone. The product does not pass: on a phone, the advertised demo click does not put the result or required sandbox notice in view. The privacy page contradicts tested storage behaviour, and material claims remain unregistered.

## Cold first read

Fresh Chromium contexts at 390 x 844 and 1440 x 900 loaded with no console or page errors. Before scrolling, this was understandable as a local tool to find duplicate Loki logs across streams, for Loki operators investigating inflated alerts and storage. The first action is “Try it with sample data.”

Exact successful copy:

> “Find duplicate Loki logs across streams”

> “For Loki operators checking whether duplicate ingestion inflates alerts and storage.”

> “Try it with sample data” / “See two duplicate groups now.”

R1-B1 is fixed. The warm instrument-panel art is product-specific, not a generic SaaS template.

## Findings, ordered by severity

### F-2-1 (recurs R1-B2) — BLOCKING: the one-click mobile demo does not show the result or persistent banner

Evidence: From a fresh 390 px root, clicking “Try it with sample data” reached /demo, but the first viewport showed the hero illustration and “READ MESSAGES” steps. It showed neither the sample result nor “Demo — sample data, nothing is saved.” The result was 1,607 px below that viewport (metrics top 2237 px at scrollY 630 px); the banner had scrolled to -469 px. Direct /demo loaded 2 groups / 3 copies but its banner was likewise above the viewport.

Why this fails: The visitor sees neither proof that sample data loaded nor the required persistent isolation notice.

Fix: Make the mobile demo result-first. Place a sticky demo banner above the workbench and scroll/focus the 2-group / 3-copy result, not the workbench heading. Add a 390 px test that clicks the hero action and asserts both banner and result heading are inside the viewport.

### F-2-2 (recurs R1-B4) — BLOCKING: the Privacy storage statement is false

Quote/location: Privacy: “The demo stores only an active marker under a demo: key. Resetting or leaving the demo removes it.”

Evidence: In a fresh live demo, Reset demo retained demo:log-duplicate-lens:active. Start for real removed it. The declared demo-isolation test explicitly expects the marker to remain after Reset.

Why this fails: A visitor cannot tell whether Reset discards data, which is the advertised privacy boundary.

Fix: Replace it with: “Resetting reruns the sample. Leaving the demo removes its demo: marker.” Extend the isolation claim to assert cleanup on Start for real and list Privacy as a claim location.

### F-2-3 (recurs R1-B4) — BLOCKING: reliance claims lack registry entries and observable claim tests

All seven existing claims passed, but none names the following statements.

| Exact quote/location | Concrete closure |
| --- | --- |
| Landing: “Processes samples in this browser” | Add a local-processing claim that intercepts the complete pasted-file flow and asserts no request plus a report. |
| Landing: “Paste JSON lines, a Loki response, or plain lines.” | Add fixtures for each named form and assert observed groups. |
| Landing: “JSON: use --json for a machine-readable report.” | Add a CLI claim that parses output as JSON. |
| Landing: “Limits: set --max-events, --max-groups, and --max-input-mb.” | Add bounded-input CLI tests for every option. |
| README: “The report shows messages, timing, and stream labels for each suspected duplicate group.” | Add a report-evidence fixture. |
| README: “Use --format loki for a Loki query response.” | Add a Loki-response fixture and format claim. |
| README: “Use --window 1500ms to set the matching time window.” | Add a boundary fixture proving the setting changes matching. |
| README: “Add --json for a machine-readable report.” | Cover with the JSON CLI claim. |
| README: “Use --max-events, --max-groups, and --max-input-mb to set limits for large exports.” | Cover with the limits claim. |
| README: “Use --redact ... before sharing a report.” | Add a fixture proving a secret is absent after redaction. |
| README: “The browser demo uses its own demo: local-storage key. It removes that key when you leave the demo.” | Assert namespace and Start-for-real cleanup. |
| Privacy: “The CLI reads logs on your machine.” | Add a local CLI/no-network claim. |
| Privacy: “The browser workbench reads pasted or selected files in browser memory.” | Cover with local-processing. |
| Privacy: “This site uses no analytics, tracking pixels, advertising cookies, third-party fonts, or runtime content delivery networks.” | Add a full-load request/storage assertion or remove it. |

### F-2-4 (recurs R1-M1) — BLOCKING under the prior-finding rule: controls use inconsistent/vague words

Quote/location: The calibration strip says “Set a time window” and “Match retry timing”; the fieldset says “Timestamp tolerance”; README says “matching time window.” The install button says “Copy command.”

Why this fails: One setting has three names. “Copy command” does not say what is copied.

Fix: Use “Retry window” for the strip, fieldset, and README. Rename the button “Copy install command.” Add exact terminology and accessible-name assertions.

### F-2-5 — minor structure/asset finding: no 180 px touch icon or 1200 x 630 social card

Location: All routes link apple-touch-icon to /favicon.svg. No 180 px touch asset exists. The OG image is the 1280 x 853 hero, not a composed 1200 x 630 social card.

Fix: Ship local 180 x 180 PNG and 1200 x 630 OG assets, reference both on every route, and test their dimensions/status.

## Demo and sandbox evidence

- Fresh live /demo: title “Demo — Log Duplicate Lens”, one h1, banner text, 2 groups, 3 copies, only demo:log-duplicate-lens:active storage, same-origin requests only, no console/page errors.
- Reset reran the sample and retained the demo marker. Start for real returned to root, hid banner, cleared storage, and returned the readout to “Awaiting sample.”
- Once the deployed service worker had loaded, offline mode still allowed Reset and reported “Offline · analysis and export still work locally.”
- From a new temp directory, the clean-clone binary ran log-duplicate-lens demo without input and printed the seven-record sample, 2 groups, 3 copies, and a temporary report path.

## Claims command evidence

Fresh clone: /tmp/log-duplicate-lens-review-fyXSEm. npm ci completed with no vulnerabilities.

| Claim id | Command | Result |
| --- | --- | --- |
| sample-analysis | npx playwright test --project=chromium --grep @claim:sample-analysis | pass |
| demo-isolation | npx playwright test --project=chromium --grep @claim:demo-isolation | pass |
| demo-private | npx playwright test --project=chromium --grep @claim:demo-private | pass |
| json-export | npx playwright test --project=chromium --grep @claim:json-export | pass |
| browser-limit | npx playwright test --project=chromium --grep @claim:browser-limit | pass |
| offline-demo | npx playwright test --project=chromium --grep @claim:offline-demo | pass |
| cli-demo | cargo test --test cli claim_cli_demo_runs_without_an_input_path | pass |

The six browser claims also ran together from that clone: 6 passed in 20.2 seconds.

## Earlier finding closure

| Earlier id | Confirmation | Status |
| --- | --- | --- |
| R1-B1 | Cold mobile/desktop screens identify job, audience, and action. | fixed |
| R1-B2 | Demo, sample, namespace, Reset, Start for real exist; first-viewport/banner failure remains. | F-2-1 |
| R1-B3 | Bundled sample, transcript, and temp-report demo command work. | fixed |
| R1-B4 | Registry/tests exist and pass, but coverage/privacy prose remain wrong. | F-2-2/F-2-3 |
| R1-B5 | Checkout links are gone; live crawl found no dead product link. | fixed |
| R1-B6 | Demo works in browser; unknown path returns designed HTTP 404. | fixed |
| R1-M1 | Most repairs hold; control terminology/action wording remains. | F-2-4 |
| R1-M2 | Canonical, OG, Twitter, favicon, legal links, titles exist; asset dimension gap is F-2-5. | partly fixed |
| R1-M3 | 390 px root has no horizontal overflow and retains Demo/Privacy. | fixed |
| R1-PWA1/R1-PWA2 | Service-worker regression, responsive WebP, and local assets remain. | confirmed |

## Structure, routing, and visual checks

Root, Demo, Privacy, Terms, favicon, manifest, hero assets, CSS, and GitHub source returned 200. Unknown route returned designed HTTP 404 with title “Page not found — Log Duplicate Lens” and h1 “This instrument page is not here.” The browser Demo title was “Demo — Log Duplicate Lens”; Privacy and Terms have individual title, description, canonical, and h1. Header/footer retain legal links. No AI feature is expected: duplicate analysis is deterministic and an AI/key flow would be decorative. JSON export and CLI JSON output are appropriate export paths.

## Complete copy audit

Counts treat versions, options, and numeric controls as words. UC = unlisted claim; T = terminology inconsistency; A = vague action; J = necessary Loki-domain jargon that should be defined on first use. No landing or README sentence exceeds 22 words. No banned marketing adjective appears.

### Landing page

| Copy | Words | Flags |
| --- | ---: | --- |
| Skip to main content | 4 | — |
| Local circuit ready · nothing uploaded | 5 | UC |
| Log Duplicate Lens / Local diagnostic · 0.1.0 | 3 / 3 | — |
| Demo / Install CLI / Privacy / Terms | 1 / 2 / 1 / 1 | — |
| Instrument 04 | 2 | — |
| Find duplicate logs across streams | 6 | — |
| Find duplicate Loki logs across streams | 6 | appears twice |
| For Loki operators checking whether duplicate ingestion inflates alerts and storage. | 10 | — |
| Try it with sample data / See two duplicate groups now. | 5 / 6 | — |
| Install the CLI | 3 | — |
| Processes samples in this browser | 5 | UC |
| Browser input limit: 5 MB | 5 | browser-limit |
| Evidence, not verdicts | 3 | — |
| Three stream traces through one suspected duplicate group | 8 | — |
| Read messages / Hide changing IDs | 2 / 3 | — |
| Set a time window / Match retry timing | 4 / 3 | T |
| Compare streams / Show differing labels | 2 / 3 | — |
| Inspect groups / Review duplicate evidence | 2 / 3 | — |
| Bench test · browser edition / Check a log sample | 4 / 4 | — |
| Paste JSON lines, a Loki response, or plain lines. | 9 | UC, J |
| The browser reads up to 5 MB. | 6 | browser-limit |
| Input A / Local circuit / Log sample | 2 / 2 / 2 | — |
| Redact sensitive values before sharing the exported report. | 7 | — |
| Open sample analysis / Choose file | 3 / 2 | — |
| Timestamp tolerance / 0.5 s / 2 s / 5 s | 2 / 2 / 2 / 2 | T |
| Analyze this sample | 3 | — |
| Readout B / Awaiting sample | 2 / 2 | — |
| No sample on the bench | 5 | — |
| Open the sample analysis or choose a log export. | 9 | — |
| Duplicate copies / 0% of sample | 2 / 3 | — |
| Alert amplifier / if each copy fires | 2 / 4 | J |
| Extra bytes / in suspected duplicate groups | 2 / 4 | — |
| Export JSON evidence | 3 | json-export |
| A match is a lead, not a verdict. | 8 | — |
| How to assess a suspected duplicate | 6 | — |
| What the readout can—and cannot—tell you | 8 | — |
| Evidence for a duplicate | 4 | — |
| Look for one normalized message across streams within the retry window. | 10 | T, J |
| Cases that need context | 5 | — |
| Health checks and expected fan-out can look alike. / Review the stream labels. | 8 / 4 | J |
| Check retry and sharding settings | 6 | J |
| Check retry intervals, sharding labels, and producer request IDs before changing a pipeline. | 13 | J |
| Single binary / Put the lens beside your logs | 2 / 6 | — |
| Run the bundled sample before pointing the tool at a log export. | 11 | cli-demo |
| LOCAL / OPERATOR / UTF-8 | 1 / 1 / 1 | — |
| cargo install --git … / log-duplicate-lens demo | 4 / 2 | — |
| Copy command | 2 | A |
| Demo: uses the bundled seven-record sample and writes a temporary report. | 9 | cli-demo |
| JSON: use --json for a machine-readable report. | 7 | UC |
| Limits: set --max-events, --max-groups, and --max-input-mb. | 6 | UC |
| CLI demo / bundled sample / Local | 2 / 2 / 1 | — |
| Bundled sample: 7 labeled log records | 6 | cli-demo |
| Result: 2 suspected duplicate groups / 3 duplicate copies | 8 | cli-demo |
| Demo report: /tmp/log-duplicate-lens-demo-….json | 3 | cli-demo |
| Find suspected duplicate groups across Loki streams. | 7 | UC |
| Built by Param Factory · v0.1.0 / View source code | 5 / 3 | — |

### README

| Copy | Words | Flags |
| --- | ---: | --- |
| Log Duplicate Lens | 3 | — |
| Find suspected duplicate Loki logs across streams. | 6 | UC |
| For Loki and JSON-log operators checking whether duplicate ingestion inflates alerts and storage. | 11 | — |
| The report shows messages, timing, and stream labels for each suspected duplicate group. | 12 | UC |
| Try the browser sample at https://log-duplicate-lens.sociobot.in/demo. | 6 | — |
| Install / Try the bundled sample / Analyze a log export | 1 / 4 / 4 | — |
| Build the single Rust binary from this checkout: | 8 | — |
| Run this from any directory after installation: | 8 | — |
| It reads the seven-record bundled sample and writes a report to a new temporary file. | 14 | cli-demo |
| The command prints that file path. | 6 | cli-demo |
| Use --format loki for a Loki query response. | 8 | UC, J |
| Use --window 1500ms to set the matching time window. | 9 | UC, T |
| Add --json for a machine-readable report. | 5 | UC |
| Use --max-events, --max-groups, and --max-input-mb to set limits for large exports. | 10 | UC |
| Use --redact token=[^ ]+=>token=[REDACTED] before sharing a report. | 6 | UC, J |
| What a result means | 5 | — |
| A suspected duplicate group is a lead, not proof of bad ingestion. | 12 | — |
| Check retry timing, stream sharding, and producer request IDs before changing a pipeline. | 12 | J |
| Develop, test, and deploy | 4 | — |
| Requirements: Rust 1.85+, Node 22+, and npm 10+. | 8 | — |
| npm run build creates the binary in target/release/ and the static site in dist/site/. | 11 | UC |
| Deploy dist/site/ with the factory static deploy work order. | 8 | — |
| npm run pack:cli prepares a crate but does not publish it. | 9 | UC |
| Privacy and license | 3 | — |
| The browser demo uses its own demo: local-storage key. | 9 | UC |
| It removes that key when you leave the demo. | 9 | UC |
| See the privacy notice and terms. | 6 | — |
| MIT © 2026 Sociobot (Param Factory). / See LICENSE. | 5 / 2 | — |

## What would make this perfect

Make /demo result-first on a phone with a sticky sandbox banner, correct and test Reset/leave privacy wording, close each listed claim with a tagged observable test, add local touch/social assets, and standardize the control labels. Re-run clean-clone claims, mobile click-viewport test, route/link crawl, and copy audit. Only a zero-finding result should change the verdict to PASS.

