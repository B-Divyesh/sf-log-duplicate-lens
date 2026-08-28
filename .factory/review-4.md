# Adversarial first-read review 4

Reviewed 2026-08-28 against deployed production at
`https://log-duplicate-lens.sociobot.in` and a fresh clone of
`4902a593270a942bb89417c39db1f4b0be3bec98`.

## Verdict: FAIL

One minor route-accessibility finding remains. The product cannot receive PASS
until it has zero findings.

## Cold first read

Fresh Chromium contexts at 390 × 844 and 1440 × 1000 loaded with no page or
console errors. Before scrolling, the product was understandable as a local
tool that finds duplicate Loki logs across streams, for Loki operators checking
whether duplicate ingestion is inflating alerts and storage. The first action
to take is **Try it with sample data**.

The successful first-screen copy was:

> “Find duplicate Loki logs across streams”

> “For Loki operators checking whether duplicate ingestion inflates alerts and storage.”

> “Try it with sample data” / “See two duplicate groups now.”

The 390 px page had zero horizontal overflow. The warm enamel, paper readout,
calibration marks, and original signal-lens illustration form a distinct
mid-century instrument panel; this is not a generic SaaS template.

## Findings, ordered by severity

### F-4-1 — minor: Back navigation leaves keyboard and screen-reader focus on the document body

**Location:** live `/` → `/demo` → browser Back; `site/src/main.ts` contains
demo-entry focus handling but no `popstate`/`pageshow` handling for the return
route. The existing route test at `site/tests/e2e/site.spec.ts` checks the title
after `page.goBack()` but not focus.

**Evidence:** after activating **“Try it with sample data”**, the demo moves
focus to the visible result heading as required. After browser Back, the URL
returns to `/` and `document.activeElement` is `BODY`, not the root h1 or the
triggering **“Try it with sample data”** link. No route announcement is made
for the returned home route.

**Why this matters:** a keyboard or screen-reader visitor returning from the
sample loses their reading position and is not told that the route changed.

**Concrete fix:** restore focus deliberately on Back/forward. Either retain the
link that opened demo as the focus return target, or focus `#hero-title` and
set `#route-announcer` to “Log Duplicate Lens — find duplicate Loki logs” on
the restored root route. Add an end-to-end test that follows `/` → `/demo` →
Back and asserts the URL, route announcement, and focus target.

## One-click demo and sandbox checks

From a fresh 390 × 844 context, one click on **Try it with sample data** opened
`/demo`. The first visible screen contained the sticky banner **“Demo — sample
data, nothing is saved”**, Reset demo and Start for real controls, and a
populated **“2 suspected duplicate groups”** readout with realistic checkout
timeout and inventory retry evidence. It reported three duplicate copies.

The banner occupied y=4–106 and the result began at y=120 in the viewport.
Fresh demo navigation made no off-origin request and no console/page error.
Only `demo:log-duplicate-lens:active` was added. Reset retained that marker and
reran the sample; Start for real removed it and left normal storage untouched.

The offline and privacy paths are covered by the registry and passed below. In
an independent temporary directory, the bundled CLI binary completed
`log-duplicate-lens demo` and printed:

```text
Bundled sample: 7 labeled log records
Result: 2 suspected duplicate groups / 3 duplicate copies
Demo report: /tmp/log-duplicate-lens-demo-….json
```

The landing page uses the local `cli-demo.svg` recording, names its real command
and bundled sample, and supplies an expandable text transcript.

## Claims verification

Fresh clone used: `/tmp/log-duplicate-lens-review4-no0LbB/repo`.
`npm ci` completed with zero vulnerabilities. Every one of the 23 entries in
`.factory/claims.json` was run from that clone; all passed. The 14 browser
entries passed as tagged Playwright tests and the nine CLI entries use the
registered `cargo test --test cli` command, which passed all relevant tests.

| Claim ids | Evidence | Result |
| --- | --- | --- |
| `sample-analysis`, `demo-mobile-result`, `browser-sample-action` | Browser sample result and 390 px viewport | PASS |
| `demo-isolation`, `demo-private`, `offline-demo`, `site-privacy` | Demo namespace, interception, offline reset, storage check | PASS |
| `json-export`, `browser-limit`, `browser-local-processing`, `browser-input-formats`, `browser-normalization`, `browser-label-evidence` | Observable browser flows | PASS |
| `cli-demo-recording` | Local SVG asset and accessible transcript | PASS |
| `cli-demo`, `cli-detection`, `cli-json`, `report-evidence`, `cli-loki-format`, `cli-retry-window`, `cli-limits`, `cli-redaction`, `cli-local-processing` | Fresh-clone Rust integration tests | PASS |

The full clean-clone browser claim run reported **14 passed**. `cargo test
--test cli` reported **11 passed**, including all nine registered CLI claims.
There are no untested registry entries.

Live landing and README copy was cross-checked against the registry. Capability
and privacy statements map to the entries above: local browser processing, 5 MB
limit, input forms, request-ID matching, differing labels, the sample result,
JSON export, CLI demo/format/window/limits/redaction, and local/no-tracking
promises. The remaining cautions and user instructions are not reliance claims.
No unlisted claim was found.

## Earlier-finding closure

| Earlier finding | Live and code confirmation | Status |
| --- | --- | --- |
| R1-B1 | Headline, audience sentence, first action, and immediate outcome are clear at 390 px and desktop. | fixed |
| R1-B2 / F-2-1 / F-3-1 | `/demo` and `?demo=1` are result-first; banner/result remain in the mobile viewport; exact tagged test passes. | fixed |
| R1-B3 / F-3-2 | Shipped seven-record sample, working temp-report CLI demo, self-hosted real-command SVG, and transcript all load. | fixed |
| R1-B4 / F-2-2 | Reset/leave wording, `demo:` storage behavior, and normal-storage preservation agree. | fixed |
| F-2-3 / F-3-4–F-3-6 | Registry now covers browser input, local processing, normalization, labels, CLI capabilities, privacy, and recording. | fixed |
| R1-B5 | No paid checkout or dead purchase path remains. | fixed |
| R1-B6 | Direct demo, legal routes, static 404, route titles, and reloads work. | fixed, except F-4-1 return-focus gap |
| R1-M1 / F-2-4 / F-3-3 | “Retry window,” “Copy install command,” and “Show sample result” are consistent and truthful. | fixed |
| R1-M2 / F-2-5 | Local 180×180 touch icon, 1200×630 social image, canonical/OG/Twitter metadata exist. | fixed |
| R1-M3, R1-PWA1, R1-PWA2 | 390 px layout, service-worker offline path, local assets, and reduced-motion behavior remain covered. | fixed |

## Structure, metadata, links, and leverage

Root, Demo, Privacy, Terms, and 404 each had one visible h1 and one main
landmark. Their titles, descriptions, and canonicals were correct:

| Route | Title | HTTP |
| --- | --- | ---: |
| `/` | `Log Duplicate Lens — find duplicate Loki logs` | 200 |
| `/demo` | `Demo — Log Duplicate Lens` | 200 |
| `/privacy/` | `Privacy — Log Duplicate Lens` | 200 |
| `/terms/` | `Terms — Log Duplicate Lens` | 200 |
| unknown route | `Page not found — Log Duplicate Lens` | 404 |

All routes expose a description, canonical, Open Graph/Twitter metadata,
favicon, and local apple-touch icon. The 404 is styled, explains the miss, and
links Home and Demo. The complete rendered-link crawl found 200 responses for
all internal and GitHub targets; `mailto:` links were explicit. Header/footer
links retain Demo, Privacy, and Terms. The sole route failure is F-4-1.

The brief implies deterministic local comparison, evidence, and export; the
product already provides browser/CLI input, JSON export, label and retry
evidence, and bounded processing. An AI step would be decorative here, so no
AI integration or provider key is expected.

## Copy audit

Word counts treat commands, versions, and option names as one word. No landing
or README unit exceeds 22 words. No banned marketing adjective, inconsistent
term, action mismatch, or heading that fails out of context was found. `Loki`,
`JSON`, `CLI`, `retry window`, and `redact` are necessary named formats or
controls for the explicitly named Loki/log-operator audience; each is paired
with an action or context rather than used as unexplained marketing jargon.

### Landing page

| Copy unit | Words | Flag |
| --- | ---: | --- |
| Skip to main content | 4 | — |
| Local circuit ready · nothing uploaded | 5 | `browser-local-processing`, `site-privacy` |
| Log Duplicate Lens / Local diagnostic · 0.1.0 | 3 / 3 | — |
| Demo / Install CLI / Privacy / Terms | 1 / 2 / 1 / 1 | — |
| Instrument 04 / Find duplicate logs across streams | 2 / 5 | — |
| Find duplicate Loki logs across streams | 6 | — |
| For Loki operators checking whether duplicate ingestion inflates alerts and storage. | 11 | — |
| Try it with sample data / See two duplicate groups now. | 5 / 5 | `sample-analysis` |
| Install the CLI | 3 | — |
| Processes samples in this browser | 5 | `browser-local-processing` |
| Browser input limit: 5 MB | 5 | `browser-limit` |
| Evidence, not verdicts | 3 | — |
| Three stream traces through one suspected duplicate group | 8 | — |
| Read messages / Ignore changing request IDs when matching messages | 2 / 7 | `browser-normalization` |
| Set a retry window / Match retry timing | 4 / 3 | — |
| Compare streams / List labels that differ between streams | 2 / 6 | `browser-label-evidence` |
| Inspect groups / Review duplicate evidence | 2 / 3 | — |
| Bench test · browser edition / Check a log sample | 4 / 4 | — |
| Paste JSON lines, a Loki response, or plain lines. | 9 | `browser-input-formats` |
| The browser reads up to 5 MB. | 7 | `browser-limit` |
| Input A / Local circuit / Log sample | 2 / 2 / 2 | — |
| Remove sensitive values from this input before exporting. | 8 | instruction, not capability claim |
| Show sample result / Choose file / Retry window | 3 / 2 / 2 | `browser-sample-action` |
| 0.5 s / 2 s / 5 s | 2 / 2 / 2 | — |
| Analyze this sample / Readout B / Awaiting sample | 3 / 2 / 2 | — |
| No sample on the bench | 5 | — |
| Show the sample result or choose a log export. | 9 | — |
| Export JSON evidence | 3 | `json-export` |
| A match is a lead, not a verdict. | 8 | caution |
| How to assess a suspected duplicate / What the readout can—and cannot—tell you | 6 / 8 | — |
| Evidence for a duplicate | 4 | — |
| Look for matching message text across streams within the retry window. | 10 | explanation |
| Cases that need context | 4 | — |
| Health checks and expected fan-out can look alike. / Review the stream labels. | 8 / 4 | caution |
| Check retry and sharding settings | 5 | — |
| Check retry intervals, sharding labels, and producer request IDs before changing a pipeline. | 13 | caution |
| Single binary / Put the lens beside your logs | 2 / 6 | — |
| Run the bundled sample before pointing the tool at a log export. | 11 | `cli-demo` |
| Local / Operator / UTF-8 | 1 / 1 / 1 | — |
| `cargo install --git …` / `log-duplicate-lens demo` | 3 / 2 | `cli-demo` |
| Copy install command | 3 | — |
| Demo: uses the bundled seven-record sample and writes a temporary report. | 9 | `cli-demo` |
| JSON: use --json for a machine-readable report. | 7 | `cli-json` |
| Limits: set --max-events, --max-groups, and --max-input-mb. | 6 | `cli-limits` |
| Captured from the real CLI demo using the bundled seven-record sample. | 10 | `cli-demo-recording` |
| Read recording transcript | 3 | `cli-demo-recording` |
| Bundled sample: 7 labeled log records | 6 | `cli-demo` |
| Result: 2 suspected duplicate groups / 3 duplicate copies | 8 | `sample-analysis`, `cli-demo` |
| Demo report: /tmp/log-duplicate-lens-demo-….json | 3 | `cli-demo` |
| Find suspected duplicate groups across Loki streams. | 7 | `cli-detection` |
| Built by Param Factory · v0.1.0 / View source code | 5 / 3 | — |

### README

| Copy unit | Words | Flag |
| --- | ---: | --- |
| Log Duplicate Lens | 3 | — |
| Find suspected duplicate Loki logs across streams. | 7 | `cli-detection` |
| For Loki and JSON-log operators checking whether duplicate ingestion inflates alerts and storage. | 12 | — |
| The report shows messages, timing, and stream labels for each suspected duplicate group. | 12 | `report-evidence` |
| Try the browser sample at https://log-duplicate-lens.sociobot.in/demo. | 6 | — |
| Install / Try the bundled sample / Analyze a log export | 1 / 4 / 4 | — |
| Build the single Rust binary from this checkout: | 8 | — |
| Run this from any directory after installation: | 8 | — |
| It reads the seven-record bundled sample and writes a report to a new temporary file. | 14 | `cli-demo` |
| The command prints that file path. | 6 | `cli-demo` |
| Use --format loki for a Loki query response. | 8 | `cli-loki-format` |
| Use --window 1500ms to set the retry window. | 8 | `cli-retry-window` |
| Add --json for a machine-readable report. | 5 | `cli-json` |
| Use --max-events, --max-groups, and --max-input-mb to set limits for large exports. | 10 | `cli-limits` |
| Use --redact `token=[^ ]+=>token=[REDACTED]` before sharing a report. | 6 | `cli-redaction` |
| What a result means | 5 | — |
| A suspected duplicate group is a lead, not proof of bad ingestion. | 12 | caution |
| Check retry timing, stream sharding, and producer request IDs before changing a pipeline. | 12 | caution |
| Develop, test, and deploy | 4 | — |
| Requirements: Rust 1.85+, Node 22+, and npm 10+. | 8 | — |
| npm run build creates the binary in target/release/ and the static site in dist/site/. | 11 | build instruction |
| Deploy dist/site/ with the factory static deploy work order. | 8 | deployment instruction |
| npm run pack:cli prepares a crate but does not publish it. | 9 | build instruction |
| Privacy and license | 3 | — |
| The browser demo uses its own demo: local-storage key. | 9 | `demo-isolation` |
| Resetting reruns the sample. | 4 | `demo-isolation` |
| Leaving the demo removes that key. | 6 | `demo-isolation` |
| See the privacy notice and terms. | 6 | — |
| MIT © 2026 Sociobot (Param Factory). See LICENSE. | 7 | — |

## Verification

- Fresh clone: `npm ci`, all 23 registered claim commands, `cargo test --test
  cli`, `npm test`, and `npm run build` were run. Claim tests passed; the full
  test run exercised 18 Rust tests, 4 Vitest tests, and 48 Playwright tests.
  The release build produced `dist/site/` and the release CLI.
- Live cold checks: root at 390 px and desktop; one-click demo; reset/leave
  storage isolation; same-origin requests; direct routes; title/metadata/h1/main
  checks; 404; link crawl; Back focus; and the real CLI demo in a temp directory.

## What would make this perfect

Implement and test focus restoration plus the home-route announcement after
browser Back/forward. Then repeat the clean-clone claim suite and route
navigation check. With F-4-1 closed and no new findings, this review can pass.
