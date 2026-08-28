# Adversarial first-read review 5

Reviewed 2026-08-28 against https://log-duplicate-lens.sociobot.in and a clean clone of 943425b2751b2edf9556c721e30c68cade875ac0.

## Verdict: FAIL

All 23 registered claim commands passed. The landing screen and demo are clear and functional. Four minor findings remain; PASS requires zero findings.

## Cold first read

Fresh Chromium at 390 x 844 and 1440 x 900 loaded with no page or console errors before scrolling. In my own words, this is a local Loki duplicate-ingestion checker for Loki operators investigating alert and storage inflation; click **Try it with sample data** first.

The successful copy was:

> “Find duplicate Loki logs across streams”

> “For Loki operators checking whether duplicate ingestion inflates alerts and storage.”

> “Try it with sample data” / “See two duplicate groups now.”

The mobile page has no horizontal overflow. Its warm paper, engraved labels, signal traces, and original instrument art are product-specific, not a generic SaaS template.

## Findings, ordered by severity

### F-5-1 — minor: browser retry-window matching is an unlisted claim

**Quote/location:** landing: “Set a retry window” / “Match retry timing,” and the browser **Retry window** control (0.5 s, 2 s, 5 s).

**Check:** `cli-retry-window` in `.factory/claims.json` tests the CLI only. No registry entry or tagged browser test verifies that changing the browser control changes a browser result.

**Why this matters:** a visitor is asked to rely on a browser matching control without a verifiable claim.

**Concrete fix:** add `browser-retry-window`. From a fresh browser context, analyze two cross-stream events 1.6 seconds apart, assert no group at 0.5 s and one group at 2 s or 5 s.

### F-5-2 — minor: browser impact estimates are unregistered, and “Alert amplifier” is vague

**Quote/location:** populated browser/demo readout: “Alert amplifier” / “if each copy fires” and “Extra bytes” / “in suspected duplicate groups.”

**Check:** `sample-analysis` asserts two groups and three copies. No claim entry asserts the alert estimate, byte estimate, calculation, or displayed values.

**Why this matters:** the brief includes alert and volume inflation. These displayed metrics look actionable but are not sandbox-proven; “Alert amplifier” is not plain first-read wording.

**Concrete fix:** rewrite **Alert amplifier** as **Estimated alerts if every duplicate fires**. Add `browser-impact-estimates` using a known fixture and asserting duplicate copies, alert estimate, and extra bytes; otherwise remove both metrics.

### F-5-3 — minor: legal/static route changes leave focus on BODY and make no announcement

**Quote/location:** live Home -> **Privacy**. The URL becomes `/privacy/`, `document.activeElement` is `BODY`, and the destination has no `[aria-live]`. Terms and the generated 404 use the same static-page pattern.

**Why this matters:** keyboard and screen-reader visitors receive neither a new focus target nor a route announcement. The earlier Home <- Demo Back repair does not cover these routes.

**Concrete fix:** make every route h1 `tabindex="-1"`, focus it on entry without scrolling, and add a polite route message, for example “Privacy — Log Duplicate Lens.” Test Home -> Privacy, Privacy -> Terms, and direct 404/back.

### F-5-4 — minor: the generated 404 footer is not the shared footer

**Quote/location:** live `/not-a-real-route` says only “Find suspected duplicate groups across Loki streams.” `scripts/build-routes.mjs` omits “Built by Param Factory · v0.1.0”.

**Why this matters:** the normal, Privacy, and Terms footers include attribution and build information. A dead-link route should preserve that provenance.

**Concrete fix:** generate “Find suspected duplicate groups across Loki streams. Built by Param Factory · v0.1.0” and assert it in the 404 route test.

## Demo and sandbox checks

One click opened `/demo`. On a fresh 390 px context, the first product screen showed the sticky **“Demo — sample data, nothing is saved”** notice, **Reset demo**, **Start for real**, and focused **“2 suspected duplicate groups.”** It displayed realistic checkout-timeout and inventory-retry records and three duplicate copies.

With an existing `real:review5-probe` key, demo entry added only `demo:log-duplicate-lens:active`. Reset retained the real key and reran the result; Start for real removed only the `demo:` marker. Request interception saw only same-origin requests. After load, offline Reset still gave three copies and “Offline · analysis and export still work locally.”

From a new temporary directory, the clean-clone release CLI printed:

~~~text
Bundled sample: 7 labeled log records
Result: 2 suspected duplicate groups / 3 duplicate copies
Demo report: /tmp/log-duplicate-lens-demo-1787931304822.json
~~~

## Claims verification

Clean clone `/tmp/log-duplicate-lens-review5-DzngYe/repo` completed `npm ci` with zero vulnerabilities. Each exact `.factory/claims.json` command passed; transcript: `/tmp/log-duplicate-lens-review5-claims.log`.

| Claim | Result | Claim | Result |
| --- | --- | --- | --- |
| sample-analysis | PASS | demo-mobile-result | PASS |
| browser-sample-action | PASS | demo-isolation | PASS |
| demo-private | PASS | json-export | PASS |
| browser-limit | PASS | offline-demo | PASS |
| browser-local-processing | PASS | browser-input-formats | PASS |
| browser-normalization | PASS | browser-label-evidence | PASS |
| site-privacy | PASS | cli-demo-recording | PASS |
| cli-demo | PASS | cli-detection | PASS |
| cli-json | PASS | report-evidence | PASS |
| cli-loki-format | PASS | cli-retry-window | PASS |
| cli-limits | PASS | cli-redaction | PASS |
| cli-local-processing | PASS | — | — |

Clean-clone `npm test` passed 18 Rust tests, 4 Vitest tests, and 48 Playwright tests. `npm run build` produced `dist/site/` and the release CLI. These passing tests cannot cover F-5-1/F-5-2 because those claims do not exist.

## Earlier-finding closure

Every earlier `review-*.md`, `polish-*.md`, and handoff was read. Live and source checks confirm:

| Earlier finding(s) | Confirmation | Status |
| --- | --- | --- |
| R1-B1 | Headline, audience, primary action, and outcome are clear at phone and desktop widths. | fixed |
| R1-B2, F-2-1, F-3-1 | `/demo` and `?demo=1` immediately preload the visible result and sticky notice. | fixed |
| R1-B3, F-3-2 | Seven-record CLI demo, temp report, self-hosted SVG recording, and transcript work. | fixed |
| R1-B4, F-2-2 | Reset/leave storage behavior matches demo/privacy/README documentation. | fixed |
| F-2-3, F-3-4–F-3-6 | Prior local-processing, formats, normalization, labels, CLI, and privacy claims have tests. | fixed except new F-5-1/F-5-2 gaps |
| R1-B5 | No purchase offer or dead checkout remains. | fixed |
| R1-B6 | Deep demo/legal routes and styled HTTP 404 work; Home <- Demo Back focuses and announces Home. | fixed except F-5-3/F-5-4 |
| R1-M1, F-2-4, F-3-3 | Retry-window wording and sample/install actions are consistent and truthful. | fixed |
| R1-M2, F-2-5 | Canonical, OG/Twitter, local touch/social assets, and legal navigation exist. | fixed |
| R1-M3, R1-PWA1, R1-PWA2 | Mobile layout, offline path, local assets, and reduced motion remain covered. | fixed |
| F-4-1 | `pageshow` restores the Home h1 focus and live announcement after Back. | fixed |

## Structure, links, and leverage

| Route | HTTP | Title | h1/main |
| --- | ---: | --- | --- |
| `/` | 200 | Log Duplicate Lens — find duplicate Loki logs | 1 / 1 |
| `/demo` | 200 | Demo — Log Duplicate Lens | 1 / 1 |
| `/privacy/` | 200 | Privacy — Log Duplicate Lens | 1 / 1 |
| `/terms/` | 200 | Terms — Log Duplicate Lens | 1 / 1 |
| unknown | 404 | Page not found — Log Duplicate Lens | 1 / 1 |

Every route has description, canonical, OG/Twitter data, favicon, and touch icon. All rendered HTTP links (home, demo, Privacy, Terms, GitHub) returned 200; the two mailto links are explicit. Live CSP, Referrer-Policy, and X-Content-Type-Options are present. The 404 is styled and links Home and sample analysis. F-5-3 and F-5-4 are the remaining structure gaps.

The brief implies deterministic local comparison, evidence, limits, redaction, input, and export; those paths exist. An AI feature would be decorative and would weaken local/offline use. No missed AI leverage was found.

## Complete copy audit

Counts treat hyphenated terms, options, versions, URLs, and commands as one word. `C:id` maps a reliance statement to the registry. No unit exceeds 22 words, has a banned marketing adjective, inconsistent terminology, an out-of-context heading, or a non-result-naming button. F-5-1 and F-5-2 are the only flags.

### Landing page and demo UI

| Copy unit | Words | Flag / coverage |
| --- | ---: | --- |
| Skip to main content | 4 | — |
| Local circuit ready · nothing uploaded | 5 | C:browser-local-processing, site-privacy |
| Log Duplicate Lens / Local diagnostic · 0.1.0 | 3 / 3 | identity |
| Demo / Install CLI / Privacy / Terms | 1 / 2 / 1 / 1 | navigation |
| Instrument 04 / Find duplicate logs across streams | 2 / 5 | context |
| Find duplicate Loki logs across streams | 6 | first-screen job |
| For Loki operators checking whether duplicate ingestion inflates alerts and storage. | 11 | audience |
| Try it with sample data / See two duplicate groups now. | 5 / 5 | C:sample-analysis, demo-mobile-result |
| Install the CLI | 3 | action |
| Processes samples in this browser | 5 | C:browser-local-processing |
| Browser input limit: 5 MB / Evidence, not verdicts | 5 / 3 | C:browser-limit / limitation |
| Three stream traces through one suspected duplicate group | 8 | caption |
| Read messages / Ignore changing request IDs when matching messages | 2 / 7 | C:browser-normalization |
| Set a retry window / Match retry timing | 4 / 3 | F-5-1 |
| Compare streams / List labels that differ between streams | 2 / 6 | C:browser-label-evidence |
| Inspect groups / Review duplicate evidence | 2 / 3 | workflow |
| Bench test · browser edition / Check a log sample | 4 / 4 | context |
| Paste JSON lines, a Loki response, or plain lines. | 9 | C:browser-input-formats |
| The browser reads up to 5 MB. | 7 | C:browser-limit |
| Input A / Local circuit / Log sample | 2 / 2 / 2 | labels |
| Remove sensitive values from this input before exporting. | 8 | instruction |
| Show sample result / Choose file / Retry window | 3 / 2 / 2 | C:browser-sample-action / actions |
| 0.5 s / 2 s / 5 s | 2 / 2 / 2 | F-5-1 control values |
| Analyze this sample / Readout B / Awaiting sample | 3 / 2 / 2 | action / labels |
| No sample on the bench | 5 | empty state |
| Show the sample result or choose a log export. | 9 | empty-state action |
| Duplicate copies / 0% of sample | 2 / 3 | C:sample-analysis |
| Alert amplifier / if each copy fires | 2 / 4 | F-5-2 |
| Extra bytes / in suspected duplicate groups | 2 / 4 | F-5-2 |
| Export JSON evidence / A match is a lead, not a verdict. | 3 / 8 | C:json-export / limitation |
| How to assess a suspected duplicate / What the readout can—and cannot—tell you | 6 / 8 | headings |
| Evidence for a duplicate | 4 | heading |
| Look for matching message text across streams within the retry window. | 10 | guidance |
| Cases that need context | 4 | heading |
| Health checks and expected fan-out can look alike. / Review the stream labels. | 8 / 4 | guidance |
| Check retry and sharding settings | 5 | heading |
| Check retry intervals, sharding labels, and producer request IDs before changing a pipeline. | 13 | guidance |
| Single binary / Put the lens beside your logs | 2 / 6 | CLI section |
| Run the bundled sample before pointing the tool at a log export. | 12 | C:cli-demo |
| Local / Operator / UTF-8 | 1 / 1 / 1 | labels |
| cargo install --git … / log-duplicate-lens demo | 3 / 2 | install/demo |
| Copy install command | 3 | action |
| Demo: uses the bundled seven-record sample and writes a temporary report. | 10 | C:cli-demo |
| JSON: use --json for a machine-readable report. | 7 | C:cli-json |
| Limits: set --max-events, --max-groups, and --max-input-mb. | 6 | C:cli-limits |
| Captured from the real CLI demo using the bundled seven-record sample. | 10 | C:cli-demo-recording |
| Read recording transcript | 3 | action |
| Bundled sample: 7 labeled log records | 6 | C:cli-demo |
| Result: 2 suspected duplicate groups / 3 duplicate copies | 8 | C:cli-demo, sample-analysis |
| Demo report: /tmp/log-duplicate-lens-demo-….json | 3 | C:cli-demo |
| Find suspected duplicate groups across Loki streams. | 7 | C:cli-detection |
| Built by Param Factory · v0.1.0 / View source code | 5 / 3 | attribution / action |
| Demo — sample data, nothing is saved / Reset demo / Start for real | 7 / 2 / 3 | C:demo-isolation |
| Review the sample duplicate groups | 5 | demo h1 |

### README

| Copy unit | Words | Flag / coverage |
| --- | ---: | --- |
| Log Duplicate Lens | 3 | identity |
| Find suspected duplicate Loki logs across streams. | 7 | C:cli-detection |
| For Loki and JSON-log operators checking whether duplicate ingestion inflates alerts and storage. | 13 | audience |
| The report shows messages, timing, and stream labels for each suspected duplicate group. | 12 | C:report-evidence |
| Try the browser sample at the live demo URL. | 8 | demo link |
| Install / Try the bundled sample / Analyze a log export | 1 / 4 / 4 | headings |
| Build the single Rust binary from this checkout. | 8 | instruction |
| Run this from any directory after installation. | 8 | instruction |
| It reads the seven-record bundled sample and writes a report to a new temporary file. | 14 | C:cli-demo |
| The command prints that file path. | 6 | C:cli-demo |
| Use --format loki for a Loki query response. | 8 | C:cli-loki-format |
| Use --window 1500ms to set the retry window. | 8 | C:cli-retry-window |
| Add --json for a machine-readable report. | 5 | C:cli-json |
| Use --max-events, --max-groups, and --max-input-mb to set limits for large exports. | 10 | C:cli-limits |
| Use --redact token=[^ ]+=>token=[REDACTED] before sharing a report. | 6 | C:cli-redaction |
| What a result means | 5 | heading |
| A suspected duplicate group is a lead, not proof of bad ingestion. | 12 | limitation |
| Check retry timing, stream sharding, and producer request IDs before changing a pipeline. | 12 | guidance |
| Develop, test, and deploy | 4 | heading |
| Requirements: Rust 1.85+, Node 22+, and npm 10+. | 8 | requirement |
| npm run build creates the binary and static site. | 9 | instruction |
| Deploy dist/site/ with the factory static deploy work order. | 8 | instruction |
| npm run pack:cli prepares a crate but does not publish it. | 9 | instruction |
| Privacy and software license | 4 | heading |
| The browser demo uses its own demo: local-storage key. | 9 | C:demo-isolation |
| Resetting reruns the sample. / Leaving the demo removes that key. | 4 / 6 | C:demo-isolation |
| See the privacy notice and terms. | 6 | legal links |
| MIT © 2026 Sociobot (Param Factory). See LICENSE. | 7 | license |

## What would make this perfect

Add observable browser claims for retry-window matching and impact estimates, make every static route announce/focus its h1 on entry, and reuse the complete shared footer on the 404. Then rerun the 23 registry commands from a clean clone, the 390 px demo check, legal-route focus checks, and the rendered link crawl. Only zero findings supports PASS.
