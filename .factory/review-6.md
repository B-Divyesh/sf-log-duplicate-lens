# Adversarial first-read review 6

Reviewed 2026-08-28 against commit `1ead1cd98467d0d30539eef7622b92aee177a7d3` and the live site at <https://log-duplicate-lens.sociobot.in>.

## Verdict: PASS

No findings remain. The checks below were run from scratch; no claim was left untested.

## Cold first read

Fresh Chromium contexts at 390 × 844 and 1440 × 1000 were inspected before scrolling. The first screen says **“Find duplicate Loki logs across streams”**, then names **“Loki operators”** and the risk of inflated alerts and storage. The unambiguous first action is **“Try it with sample data”**, with **“See two duplicate groups now.”** beside it.

In first-visitor words: this checks whether Loki logs have been accidentally duplicated across streams; it is for Loki operators; click **Try it with sample data** first. The phone view had no horizontal overflow. This clears the first-screen blocking check.

## Copy audit

The following is the complete visitor-facing landing/demo and README inventory. Counts treat commands, URLs, hyphenated terms, and version strings as one word. No unit exceeds 22 words. No banned marketing adjective, inconsistent product term, unexplained jargon, out-of-context heading, or non-result-naming action was found. Statements a visitor could rely on map to the claims registry below; instructions and limitations do not assert product capabilities.

### Landing and demo

| Copy unit | Words |
| --- | ---: |
| Skip to main content | 4 |
| Local circuit ready · nothing uploaded | 5 |
| Log Duplicate Lens / Local diagnostic · 0.1.0 | 3 / 3 |
| Demo / Install CLI / Privacy / Terms | 1 / 2 / 1 / 1 |
| Instrument 04 · Find duplicate logs across streams | 7 |
| Find duplicate Loki logs across streams | 6 |
| For Loki operators checking whether duplicate ingestion inflates alerts and storage. | 11 |
| Try it with sample data / See two duplicate groups now. | 5 / 5 |
| Processes samples in this browser | 5 |
| Browser input limit: 5 MB | 5 |
| Evidence, not verdicts | 3 |
| Three stream traces through one suspected duplicate group | 8 |
| Read messages / Ignore changing request IDs when matching messages | 2 / 7 |
| Set a retry window / Match retry timing | 4 / 3 |
| Compare streams / List labels that differ between streams | 2 / 6 |
| Inspect groups / Review duplicate evidence | 2 / 3 |
| Bench test · browser edition / Check a log sample | 4 / 4 |
| Paste JSON lines, a Loki response, or plain lines. | 9 |
| The browser reads up to 5 MB. | 7 |
| Input A / Local circuit / Log sample | 2 / 2 / 2 |
| Remove sensitive values from this input before exporting. | 8 |
| Show sample result / Choose file / Retry window | 3 / 2 / 2 |
| 0.5 s / 2 s / 5 s | 2 / 2 / 2 |
| Analyze this sample | 3 |
| Readout B / Awaiting sample | 2 / 2 |
| No sample on the bench | 5 |
| Show the sample result or choose a log export. | 9 |
| Duplicate copies / 0% of sample | 2 / 3 |
| Estimated alerts if every duplicate fires / based on observed events | 6 / 4 |
| Extra log bytes / in suspected duplicate groups | 3 / 4 |
| Export JSON evidence | 3 |
| A match is a lead, not a verdict. | 8 |
| How to assess a suspected duplicate | 6 |
| What the readout can—and cannot—tell you | 8 |
| Evidence for a duplicate | 4 |
| Look for matching message text across streams within the retry window. | 11 |
| Cases that need context | 5 |
| Health checks and expected fan-out can look alike. | 8 |
| Review the stream labels. | 4 |
| Check retry and sharding settings | 6 |
| Check retry intervals, sharding labels, and producer request IDs before changing a pipeline. | 13 |
| Single binary / Put the lens beside your logs | 2 / 6 |
| Run the bundled sample before pointing the tool at a log export. | 12 |
| Copy install command | 3 |
| Demo: uses the bundled seven-record sample and writes a temporary report. | 11 |
| JSON: use --json for a machine-readable report. | 7 |
| Limits: set --max-events, --max-groups, and --max-input-mb. | 6 |
| Captured from the real CLI demo using the bundled seven-record sample. | 11 |
| Read recording transcript | 3 |
| Bundled sample: 7 labeled log records | 6 |
| Result: 2 suspected duplicate groups / 3 duplicate copies | 8 |
| Demo report: /tmp/log-duplicate-lens-demo-….json | 3 |
| Find suspected duplicate groups across Loki streams. | 7 |
| Built by Param Factory · v0.1.0 | 6 |
| View source code | 3 |
| Demo — sample data, nothing is saved | 7 |
| Reset demo / Start for real | 2 / 3 |
| Review the sample duplicate groups | 5 |

### README

| Sentence | Words |
| --- | ---: |
| Find suspected duplicate Loki logs across streams. | 7 |
| For Loki and JSON-log operators checking whether duplicate ingestion inflates alerts and storage. | 12 |
| The report shows messages, timing, and stream labels for each suspected duplicate group. | 12 |
| Try the browser sample at the live demo URL. | 8 |
| Build the single Rust binary from this checkout. | 8 |
| Run this from any directory after installation. | 8 |
| It reads the seven-record bundled sample and writes a report to a new temporary file. | 14 |
| The command prints that file path. | 6 |
| Use --format loki for a Loki query response. | 8 |
| Use --window 1500ms to set the retry window. | 8 |
| Add --json for a machine-readable report. | 7 |
| Use --max-events, --max-groups, and --max-input-mb to set limits for large exports. | 10 |
| Use --redact before sharing a report. | 6 |
| A suspected duplicate group is a lead, not proof of bad ingestion. | 12 |
| Check retry timing, stream sharding, and producer request IDs before changing a pipeline. | 12 |
| Requirements: Rust 1.85+, Node 22+, and npm 10+. | 8 |
| npm run build creates the binary and static site. | 9 |
| Deploy dist/site/ with the factory static deploy work order. | 8 |
| npm run pack:cli prepares a crate but does not publish it. | 9 |
| The browser demo uses its own demo: local-storage key. | 9 |
| Resetting reruns the sample. | 4 |
| Leaving the demo removes that key. | 6 |
| See the privacy notice and terms. | 6 |
| MIT © 2026 Sociobot (Param Factory). | 5 |

Terminology is consistent: **suspected duplicate group**, **duplicate copies**, **stream**, **retry window**, **sample**, and **request ID**. The catalog sentence is 83 characters, starts with “Find,” and stays under its 120-character limit.

## Demo and sandbox

The first landing action reaches `/demo` in one click. On a fresh 390px context, the first post-click view showed the persistent **“Demo — sample data, nothing is saved”** notice, both controls, focus on the populated result, **2 suspected duplicate groups**, and **3** duplicate copies. The seven-record data is realistic Loki-style JSONL, not placeholder text.

`Reset demo` retained only `demo:log-duplicate-lens:active` and restored the 3-copy result. With `real:review6=keep` seeded before entry, `Start for real` removed the demo key, returned to `/`, and preserved the real key. Live request interception saw no off-origin request during demo entry, reset, or offline exercise. After the first load and service-worker readiness, an offline reset displayed **“Offline · analysis and export still work locally”** and retained the 3-copy result.

The CLI was also run from `/tmp` using the clean-clone binary. `log-duplicate-lens demo` read seven records, reported two groups and three copies, and wrote `/tmp/log-duplicate-lens-demo-1787934748208.json`; that report contains `suspected_groups: 2` and `duplicate_copies: 3`.

## Claims verification

All 25 exact commands in `.factory/claims.json` passed independently from the clean clone at `/tmp/log-duplicate-lens-review6-clean`. The first 16 were run as their exact Chromium Playwright commands; the last 9 as their exact `cargo test --test cli` commands.

| Claim id | Result |
| --- | --- |
| sample-analysis | PASS |
| demo-mobile-result | PASS |
| browser-sample-action | PASS |
| demo-isolation | PASS |
| demo-private | PASS |
| json-export | PASS |
| browser-limit | PASS |
| offline-demo | PASS |
| browser-local-processing | PASS |
| browser-input-formats | PASS |
| browser-normalization | PASS |
| browser-label-evidence | PASS |
| browser-retry-window | PASS |
| browser-impact-estimates | PASS |
| site-privacy | PASS |
| cli-demo-recording | PASS |
| cli-demo | PASS |
| cli-detection | PASS |
| cli-json | PASS |
| report-evidence | PASS |
| cli-loki-format | PASS |
| cli-retry-window | PASS |
| cli-limits | PASS |
| cli-redaction | PASS |
| cli-local-processing | PASS |

The fresh clone also passed `npm test` (18 Rust tests, 4 Vitest tests, 52 Playwright tests) and `npm run build`, which emitted `dist/site/`. A second live copy/claims scan found no unlisted reliance statement.

## History: every prior finding rechecked

All earlier review, polish, verification, and handoff files were read. The following prior findings were confirmed in the live site and relevant code/tests, not accepted on their status label alone.

| Earlier id | Current confirmation |
| --- | --- |
| R1-B1 | Cold phone and desktop screens state job, audience, first action, and immediate outcome. |
| R1-B2 | `/demo` and `?demo=1` open an isolated, result-first demo with banner, reset, and exit. |
| R1-B3 | Bundled CLI demo, temp report, self-hosted SVG recording, and transcript work. |
| R1-B4 | Registry coverage, demo namespace, and Reset/exit storage wording match behavior. |
| R1-B5 | No checkout or paid promise is present; rendered links resolve. |
| R1-B6 | Direct demo/legal routes, browser Back, focus announcement, and HTTP 404 work. |
| R1-M1 | “Retry window” and “Copy install command” remain the only control/action terms. |
| R1-M2 | Canonical, OG/Twitter, favicon, 180px touch icon, and 1200×630 social asset load. |
| R1-M3 | The 390px layout has zero horizontal overflow and preserves essential navigation. |
| R1-PWA1 | Service-worker-backed demo reset works offline after initial visit. |
| R1-PWA2 | Local responsive assets and small built bundles remain in the release build. |
| F-2-1 | Mobile demo contains visible banner and populated result in one viewport. |
| F-2-2 | Reset reruns sample; Start for real removes only demo-prefixed storage. |
| F-2-3 | Every reliance claim has an observable exact test. |
| F-2-4 | Retry window and install-copy wording are consistent. |
| F-2-5 | Local 180×180 touch and 1200×630 social assets are served. |
| F-3-1 | The exact clean-clone mobile result claim passes. |
| F-3-2 | The site serves a self-hosted recording plus accessible transcript. |
| F-3-3 | “Show sample result” performs analysis, not input-only filling. |
| F-3-4 | Browser redaction language is safety guidance, not an unsupported feature promise. |
| F-3-5 | Request-ID normalization is explained and test-covered. |
| F-3-6 | Differing stream-label evidence is explained and test-covered. |
| F-4-1 | Browser Back focuses `#hero-title` and announces the home route. |
| F-5-1 | Browser retry-window behavior is registered and test-covered. |
| F-5-2 | Browser impact labels are precise and registered/tested. |
| F-5-3 | Demo, privacy, terms, and 404 hand off focus and route announcement. |
| F-5-4 | The generated 404 has the shared footer, source link, privacy, terms, build attribution, and version. |

## Structure, accessibility, and visual check

Live `/`, `/demo`, `/privacy/`, `/terms/`, and an unknown path returned 200, 200, 200, 200, and 404 respectively. Each has its own correct title, one visible h1, one main landmark, `lang=en`, a meta description, canonical URL, favicon, and shared local social image. The 404 is intentionally styled in the instrument-panel system and provides a way back. Header/footer navigation is consistent; all rendered HTTP links from the landing page returned 200, including the source repository. `robots.txt` and `sitemap.xml` are served. Security headers include a restrictive CSP, `Referrer-Policy`, and `X-Content-Type-Options`.

Live axe scans found zero serious or critical violations on all five routes. No page or script console errors occurred on normal routes; the browser's expected failed-resource message occurred only when deliberately navigating to the HTTP 404. The warm enamel/paper/amber instrument-panel composition, original analyzer art, calibrated trace/scale language, condensed labels, and non-card layout are recognizably product-specific rather than a generic SaaS template.

The brief does not imply a missing AI step: duplicate detection is deterministic and local, while adding a gateway key would weaken the privacy-first workflow. The product already offers the expected input forms, CLI/landing demo, evidence export, Loki parsing, redaction, and local processing.

## Findings

None.

## What would make this perfect

No additional product change is identified by this review. Keep the exact claims matrix, offline demo exercise, live route/aXe scan, and first-screen copy audit in the release gate so this state does not regress after future changes.
