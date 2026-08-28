# Adversarial first-read review 1

Reviewed 2026-08-28 against live https://log-duplicate-lens.sociobot.in and commit 18cf12960417d3bd0d6a33a7a5de794bc650d8ab.

## Verdict: FAIL

The product has blocking failures in first-read clarity, the required CLI/demo sandbox, claim verification, purchasing, and routing.

## Cold first screen

Fresh Chromium contexts at 390 x 844 and 1440 x 900 loaded without console or page errors. The 390 px layout did not horizontally overflow. Before scrolling, I could infer a tool for repeated log messages and that I should click **“Analyze a sample.”** I could not identify *for whom* from the first screen: it never names Loki/log-pipeline operators or accidental duplicate ingestion.

The exact failing text is:

> “Find the copies your stream labels hide.”

> “Sample a Loki export. Lens groups near-identical messages across streams, measures the likely volume and alert inflation, and shows the label and retry evidence to investigate next.”

“copies,” “stream labels,” and “Lens” require prior context. This is a **BLOCKING** first-screen failure. Replace it with:

> **Find duplicate Loki logs across streams**

> For Loki operators checking whether duplicate ingestion inflates alerts and storage.

> **Try it with sample data — see two duplicate groups now**

## Findings, ordered by severity

### BLOCKING — no one-click, isolated demo

Quote: **“Analyze a sample”** only links to #workbench. In a fresh context, /?demo=1 kept the input empty and showed **“Awaiting sample.”** It had no **“Demo — sample data, nothing is saved”** banner, no **“Reset demo,”** and no **“Start for real.”** Clicking the hero action still required **“Load labeled sample”** then **“Analyze locally”;** loading alone showed no result.

A visitor does not see the product in use after one click, and no demo namespace can be checked. Make /demo and ?demo=1 immediately analyze the bundled seven-record sample, show the current result (two duplicate groups / three copies), and provide the persistent banner, Reset demo, and Start for real. Use demo: storage keys only while the banner is visible. Add direct-demo, reset, and storage-isolation browser tests.

### BLOCKING — no CLI demo command or bundled sample

The brief classifies this as a CLI. In a clean temp directory, the release binary given the argument demo exited 1:

> lens: I/O error: No such file or directory (os error 2)

There is no demo subcommand/option, no examples/ sample input, and no self-hosted terminal recording on the landing page. A CLI visitor cannot try the main artifact in the required sandbox. Ship examples/labeled-sample.jsonl; make the demo command use it in a temp directory and print its output path; record that real command on the landing page; add a CLI integration test.

### BLOCKING — missing claims registry and tests

.factory/claims.json does not exist. There were therefore no listed claim commands to run from a clean clone, despite numerous reliance claims on the page and README. Every C-marked item in the inventory is an individual unlisted-claim finding.

This makes claims such as local-only processing, no upload, memory limits, storage behaviour, feature availability, schema/version, and checkout promises unverified. Add one clean-state, observable test per claim: sample results, JSON export, offline/network interception, 5 MB limit, CLI demo, demo storage isolation, and paid-feature boundaries. Remove statements that cannot be tested.

### BLOCKING — the purchase action is dead

Quote: **“Buy Field Kit.”** Its live destination, https://api.sociobot.in/api/v1/products/log-duplicate-lens/checkout, returned HTTP **404**.

A visitor who elects to buy reaches no checkout. Configure the live Sociobot endpoint and test for a valid checkout redirect/200 without making a purchase. Otherwise remove the price, button, merchant, and refund copy.

### BLOCKING — /demo and unknown routes are not real routes; no designed 404

/demo returned 200 but rendered the ordinary empty landing page. /not-a-real-route also returned 200 and rendered the home title and h1:

> “Log Duplicate Lens — see cross-stream log amplification”

> “Find the copies your stream labels hide.”

Direct demo links do not restore demo state, and a mistyped address silently masquerades as home. Implement a real /demo route with title **“Demo — Log Duplicate Lens”** and a styled 404 that returns HTTP 404 and links Home/Demo. Add reload, back-button, focus, and route-announcement tests.

### Major — hard-limit copy, jargon, terminology, headings, and actions

The landing lede is 23 words, above the 22-word cap. Rewrite it as: “Lens finds near-identical messages across streams. It shows possible alert and volume inflation with label and retry evidence.”

The README opening is 32 words and its build/cache paragraph is 59 words. It uses JSONL, query_range, normalization, amplification, fingerprint, bounded, schema, and sensitivity sweep without a first-read explanation. Split long sentences and define necessary technical words only at the point of use.

The same apparent thing is called **“copies,” “near-identical messages,” “cross-stream matches,” “suspected amplification,” “groups,” “lead,”** and **“probable logical event.”** Use **“suspected duplicate group”** consistently. Replace out-of-context headings **“Evidence dial,” “Strong signal,” “Needs context,”** and **“Next check”** with **“How to assess a suspected duplicate,” “Evidence for a duplicate,” “Cases that need context,”** and **“Check retry and sharding settings.”**

**“Analyze a sample”** does not promise sample data or an immediate result; **“Try the lens”** is metaphorical; **“Source”** is a noun; and mobile hides all navigation but Source. Use **“Try it with sample data,” “Open sample analysis,” “View source code,”** and **“Install CLI.”** Keep Demo and Privacy reachable on mobile.

### Major — metadata, navigation, and route semantics are incomplete

The live home has title, description, one h1, language, favicon, and no initial console errors. It lacks canonical, Open Graph, Twitter-card, and apple-touch metadata. Header/footer navigation differs across home/legal pages, the home header omits Privacy/Terms, and hash navigation does not move focus or announce a new h1.

Add canonical, OG/Twitter image/title/description, apple-touch icon, a consistent Home/Demo/Privacy/Terms shell, and tested focus/live announcements on real route changes.

## Demo, privacy, link, and build evidence

A normal fresh sample flow eventually produced 3 copies, made no external request with no license token, and left local storage empty. Offline reload after first load showed **“Offline · analysis and export still work locally.”** These observations do not prove the absent demo contract.

Key live links: home, Privacy, Terms, and GitHub returned 200; checkout returned 404. The application returned home with 200 for both /demo and an unknown path.

From a fresh clone of the reviewed commit, npm ci, npm test (10 Rust + 4 Vitest + 12 Playwright), and npm run build passed. The production JS was 5.08 kB gzip. Passing generic tests cannot replace absent claim tests.

## Complete copy inventory

Counts treat numbers and command options as words. C = unlisted claim; J = jargon/out-of-context heading; L = over 22 words; T = inconsistent terminology; A = action not naming its result. C is assigned wherever a visitor could rely on a capability, privacy, pricing, storage, compatibility, or outcome statement; all are unlisted because claims.json is absent.

### Landing page

| Text | Words | Flags |
| --- | ---: | --- |
| Skip to main content | 4 | — |
| Local diagnostic · 0.1.0 | 3 | C |
| Try the lens | 3 | A |
| Install | 1 | A |
| Field Kit | 2 | J |
| Source | 1 | A |
| Instrument 04 Cross-stream amplification | 4 | C, J, T |
| Find the copies your stream labels hide. | 7 | C, J, T |
| Sample a Loki export. | 4 | C |
| Lens groups near-identical messages across streams, measures the likely volume and alert inflation, and shows the label and retry evidence to investigate next. | 23 | L, T |
| Analyze a sample | 3 | A |
| Install the CLI | 3 | — |
| ● Local-only processing | 2 | C |
| ● Explicit memory bounds | 3 | C |
| ● Evidence, not verdicts | 3 | — |
| Three observed stream traces · one probable logical event | 8 | T |
| Normalize noisy IDs | 3 | C, J |
| Set retry tolerance | 3 | J |
| Compare stream labels | 3 | J |
| Estimate amplification | 2 | C, J, T |
| Bench test · browser edition | 4 | — |
| Run a bounded investigation | 4 | J |
| Paste JSONL, a Loki query_range response, or plain lines. | 9 | J |
| This browser edition reads at most 5 MB and never sends the content anywhere. | 14 | C |
| Log sample | 2 | — |
| Secrets remain on this device. | 5 | — |
| Redact sensitive values before sharing exported evidence. | 7 | C |
| Load labeled sample | 3 | A |
| Choose file | 2 | A |
| Timestamp tolerance | 2 | — |
| 0.5 s | 2 | — |
| 2 s | 2 | — |
| 5 s | 2 | — |
| ▶ Analyze locally | 2 | C, A |
| Load the labeled example or choose a bounded production export. | 10 | C, J |
| 0% of sample | 3 | — |
| if each copy fires | 4 | — |
| within matched groups | 3 | C, T |
| Export JSON evidence | 3 | C |
| A match is a lead, not a verdict. | 8 | C, T |
| Evidence dial | 2 | J |
| What the readout can—and cannot—tell you | 8 | — |
| Strong signal | 2 | J |
| Same normalized message, tight timestamp spread, multiple stream identities, and one or two varying sharding labels. | 16 | C, J |
| Needs context | 2 | J |
| Recurring health messages or expected fan-out can look identical. | 9 | — |
| Lens preserves evidence so an operator—not an algorithm—decides. | 10 | — |
| Next check | 2 | J |
| Compare retry intervals, automatic stream-sharding labels, and producer request IDs before changing the pipeline. | 14 | J |
| Single binary · no telemetry | 4 | C |
| Put the lens beside your logs | 6 | — |
| Build from source today. | 4 | C |
| Release binaries use the same offline engine and stable JSON schema. | 11 | C, J |
| Copy command | 2 | — |
| Scriptable: --json emits schema version 1. | 6 | C, J |
| Bounded: --max-events, --max-groups, and --max-input-mb. | 5 | J, T |
| Safe: --redact scrubs report previews. | 5 | — |
| Optional operator upgrade | 3 | — |
| Field Kit | 2 | J |
| $29 once · one operator | 4 | — |
| The analyzer and evidence export stay free. | 7 | C |
| Field Kit unlocks saved local investigation presets and a side-by-side sensitivity sweep for 0.5×, 1×, and 2× your selected retry window. | 21 | C, J |
| Buy Field Kit | 3 | J |
| Secure checkout by Sociobot/Dodo, the merchant of record. | 8 | C |
| Refunds revoke the license automatically. | 5 | C |
| Have a license? | 3 | — |
| Paste it here | 3 | — |
| Verify license | 2 | — |
| Stored only in this browser. | 5 | C |
| Verification sends the token—not your logs—to Sociobot. | 9 | C |
| Preset name | 2 | — |
| Save preset | 2 | — |
| Compare window sensitivity | 3 | J |
| Privacy | 1 | C |
| Terms | 1 | — |
| LDL Log Duplicate Lens | 4 | — |
| Made for the moment “same log” stops meaning “same stream.” | 10 | C, T |
| Privacy | 1 | C |
| Terms | 1 | — |
| GitHub | 1 | — |

### README

| Text | Words | Flags |
| --- | ---: | --- |
| Log Duplicate Lens | 3 | — |
| An offline-first CLI for Loki and JSON-log operators who need to measure suspected duplicate ingestion across streams. | 17 | C |
| Lens normalizes noisy message fields, groups equal messages within a timestamp tolerance, and reports volume, alert, label, and retry evidence without uploading logs or declaring that every repeated line is an error. | 32 | L, C, J, T |
| Live documentation and local demo: <https://log-duplicate-lens.sociobot.in> | 7 | C |
| Install | 1 | A |
| Download a release binary, or build the single binary from source: | 11 | C |
| Version 0.1.0 supports Linux, macOS, and Windows anywhere Rust can compile. | 11 | C |
| Usage | 1 | — |
| Analyze logcli --output=jsonl output with the default two-second tolerance: | 10 | J |
| Analyze a Loki query_range JSON response, redact secrets before they enter the report, and write machine-readable evidence: | 17 | J |
| Read newline-delimited text from standard input and disable built-in UUID, IP, and number normalization: | 14 | C, J |
| Useful controls: | 2 | — |
| --message-field, --timestamp-field, and --stream-field map custom JSONL records. | 8 | J |
| --ignore-label pod removes volatile labels from stream identity and evidence. | 10 | — |
| --max-events 250000 and --max-groups 10000 put explicit bounds on analysis memory. | 11 | C, T |
| --fail-on-duplicates exits with code 3 when suspected cross-stream groups are found. | 11 | C, T |
| Invalid input exits 2; I/O errors exit 1. | 8 | C |
| --json provides a stable, typed report surface for scripts. | 9 | — |
| Lens accepts plain text, JSONL records, Loki JSONL (timestamp, line, and labels), and Loki query_range stream responses. | 17 | C, J |
| Timestamps may be RFC 3339 or Unix seconds/milliseconds/microseconds/nanoseconds. | 8 | — |
| Lines without timestamps receive deterministic sequence timestamps and are compared by adjacency. | 12 | — |
| Interpretation | 1 | — |
| A group is a suspected amplification cluster, not proof of bad ingestion. | 12 | C, J, T |
| Lens only reports groups that cross distinct stream identities, then shows the labels that differ and the observed retry timing. | 20 | C, T |
| Confirm the producer, retry, or sharding behavior before changing ingestion. | 10 | J |
| Develop and verify | 3 | — |
| Requirements: Rust 1.85+, Node 22+, and npm 10+. | 8 | — |
| npm run build produces the release binary under target/release/ and the deployable static site at dist/site/. | 16 | C |
| The site build stamps a content-derived service-worker cache key, uses network-first document navigation with an offline shell fallback, and sends sw.js with Cache-Control: no-cache on Static Web Apps. | 28 | L, C, J |
| npm run pack:cli runs cargo package without publishing. | 8 | C, J |
| npm run test:performance runs reproducible mobile Lighthouse against the production build and requires Performance ≥90 and the other audited categories ≥95. | 20 | C, J |
| Privacy | 1 | C |
| CLI analysis is entirely local and contains no telemetry. | 9 | C |
| The browser demo also processes selected files in the browser. | 10 | — |
| The site stores a license token, a daily verification result, and optional paid investigation presets in local storage only. | 19 | C |
| See the privacy notice. | 4 | C |
| License | 1 | — |
| MIT © 2026 Sociobot (Param Factory). | 5 | — |
| See LICENSE. | 2 | — |

### Flag fixes

Each C entry needs a matching claims.json record and tagged observable test, or
the claim must be removed. Split every L entry at the first complete idea; the
two exact long-copy rewrites are in the Major finding above. Replace J labels:
“Instrument 04 Cross-stream amplification” → “Find duplicate logs across
streams”; “Run a bounded investigation” → “Check a log sample”; “Evidence
dial” → “How to assess a suspected duplicate”; “Field Kit” → “Save
investigation settings.” Use “suspected duplicate group” for all T entries.
For A entries, use the result-naming replacements in the action finding; the
primary action must be “Try it with sample data — see two duplicate groups now.”

## Required repair verification

1. /?demo=1 and /demo must immediately show the realistic result, banner, Reset, and Start-for-real controls.
2. Demo storage must use only demo: keys and leave normal storage untouched.
3. Offline demo analysis/export must work after first load; interception must prove no off-origin demo request.
4. The CLI demo must work in an empty temp directory against the shipped sample and print an output location.
5. Every claims.json test command must pass from a clean clone.
6. Checkout must be live, /404 must return 404, and all routes/links/metadata must pass a crawl and browser smoke.
