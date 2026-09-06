# Find duplicate Loki logs across streams — review 7

Reviewed 2026-09-06 against the live site at
<https://log-duplicate-lens.sociobot.in>, implementation commit
`d1e0bc035ef988d196588e6fc4fbe7bfff3fe578`, and documentation baseline
`7d6ce5cf0bf7ef6a8debb638ea5a390b467a6259`.

## Verdict: FAIL

Four findings remain: two major and two minor. Nine public claim groups do not
have complete contract tests. All 25 declared claim commands passed, but a
passing command does not make its assertion complete.

## Job, audience, and first action

Before scrolling in fresh 390 × 844 and 1440 × 1000 Chromium contexts, I
understood the job as checking whether Loki logs were duplicated across
streams. The audience is Loki operators investigating inflated alerts and
storage. The first action is **Try it with sample data**.

The live title is `Log Duplicate Lens — find duplicate Loki logs`. The h1 is
`Find duplicate Loki logs across streams`. Both phone and desktop showed the
audience sentence and primary action before scrolling, with no horizontal
overflow or console error.

The phone did not show all three required facts before scrolling. Their live
vertical bounds were 801–820 px, 830–849 px, and 859–877 px in an 844 px
viewport. This is finding F-7-4.

## Findings

### F-7-1 — major: redaction leaves matching secrets in exported stream labels

The README tells an operator to use `--redact` before sharing a report. The
brief requires redaction before reports. The registered `cli-redaction` claim
only checks `message_preview`.

I installed the packaged crate in an empty Cargo root and analyzed two records
whose message and `tenant` stream label both contained `token=secret`:

```text
log-duplicate-lens review7-label-secret.jsonl --json \
  --redact 'token=[^ ]+=>token=[REDACTED]'
```

The report changed the message to `payment failed token=[REDACTED]`, but both
`groups[0].streams[*].tenant` values remained `token=secret`. The command
exited 0. An operator following the sharing guidance can therefore disclose a
matching secret from label evidence.

Apply redaction to every user-derived string in the report, including stream
label names and values. Extend the claim test with a secret in a label and
assert that the complete serialized report does not contain it.

### F-7-2 — major: public CLI claims are missing or incompletely tested

The claims registry has 25 entries, and every exact command passed. It still
does not cover nine public claim groups exposed by the landing page, README,
or installed `--help` output:

| Public claim group | Current evidence gap |
| --- | --- |
| The package is a single binary | Packaging was checked manually, but no claims entry or tagged test proves the published landing/README claim. |
| Auto format recognizes Loki responses, JSONL, and text | Tests cover auto JSONL and explicit `--format loki`; they do not prove auto Loki or CLI text input. |
| Built-in normalization handles UUIDs, IPs, embedded timestamps, and 4+ digit numbers | Existing CLI tests exercise changing numbers only; the registry does not name this CLI claim. |
| `--normalize-rule` adds fingerprint rewrites | No claim entry or observable test. |
| `--ignore-label` changes stream identity and comparison | No claim entry or observable test. |
| `--message-field`, `--timestamp-field`, and `--stream-field` map custom JSONL | No claim entry or observable test. |
| The documented stdin example works | No claim entry or installed-artifact test uses stdin. |
| No log content is uploaded and no telemetry is emitted | The proxy test proves that analysis completes with unusable proxy variables. It does not record or deny network attempts. |
| `--max-groups` and `--max-input-mb` enforce positive limits | `cli-limits` proves `--max-events 1`, but only checks that zero is rejected for the other two options. |

Independent manual checks found that `--max-groups 1` truncated the sample and
that 1 MiB plus one byte was rejected by `--max-input-mb 1`. Those checks show
the current behavior, but they do not satisfy the required repeatable claim
gate. Split broad claims where useful and add one exact observable test for
each group.

### F-7-3 — minor: several public labels and headings use product metaphor

The first h1 and primary action are plain. Other live copy conflicts with the
explicit no-metaphor and no-invented-lore rule:

- `Instrument 04`
- `Bench test · browser edition`
- `Input A`, `Readout B`, and `Local circuit`
- `Put the lens beside your logs`
- 404 h1 `This instrument page is not here`

Use direct names such as `Browser checker`, `Log input`, `Results`, `Runs in
this browser`, `Install the CLI`, and `Page not found`. This does not require
removing the product-specific visual design.

### F-7-4 — minor: the phone first screen omits two of the three facts

At 390 × 844, only `Processes samples in this browser` fits fully before the
bottom edge. `Browser input limit: 5 MB` is clipped and `Evidence, not
verdicts` is below the viewport. The first-screen contract requires all three
plain facts with the job, audience, and primary action.

Keep the h1, audience, primary action, and all three facts within the phone
viewport. The secondary install action can follow them.

## Demo and data isolation

One click from a fresh phone context opened `/demo`. The persistent notice read
`Demo — sample data, nothing is saved` and showed **Reset demo** and **Start for
real**. The result was already populated and focused:

- 7 realistic Loki-style records;
- 2 suspected duplicate groups;
- 3 duplicate copies;
- 1.75× estimated alerts and 91 B extra log bytes;
- checkout and inventory messages with retry timing and differing `shard`
  labels.

The notice occupied y=4–106 px and the result heading y=122–157 px in the
390 × 844 viewport. A seeded `real:review7-probe=keep` value survived demo
entry, Reset, and Start for real. Reset kept only that real value plus
`demo:log-duplicate-lens:active` and restored the three-copy result. Start for
real removed the demo key, preserved the real value, and returned to the empty
workbench. All requests during the flow stayed on the product origin.

The installed `log-duplicate-lens demo` command ran from `/tmp`, read seven
records, reported two groups and three copies, and wrote a new report under
`/tmp`. It did not read or change real product data.

## Claims and clean-checkout commands

Fresh checkout: `/tmp/log-duplicate-lens-review7-clean` at documentation SHA
`7d6ce5c`. Documented prerequisites were Rust 1.85+, Node 22+, and npm 10+;
the review used Rust 1.98.0, Node 22.23.2, and npm 10.9.8. `npm ci` installed
175 packages with zero reported vulnerabilities.

Every `test` value in `.factory/claims.json` was run independently. The 16
browser commands and 9 CLI commands all passed:

| Claim ids | Result |
| --- | --- |
| `sample-analysis`, `demo-mobile-result`, `browser-sample-action`, `demo-isolation`, `demo-private`, `json-export`, `browser-limit`, `offline-demo` | PASS |
| `browser-local-processing`, `browser-input-formats`, `browser-normalization`, `browser-label-evidence`, `browser-retry-window`, `browser-impact-estimates`, `site-privacy`, `cli-demo-recording` | PASS |
| `cli-demo`, `cli-detection`, `cli-json`, `report-evidence`, `cli-loki-format`, `cli-retry-window`, `cli-limits`, `cli-redaction`, `cli-local-processing` | PASS |

F-7-1 shows that the redaction promise is narrower in the registry than in the
README and brief. F-7-2 records the nine remaining public claim groups that do
not have complete contract tests.

## Quality, package, and CLI paths

From the clean checkout:

- `npm test`: PASS — 18 Rust tests, 4 Vitest tests, and 52 Playwright tests.
- `npm run build`: PASS — release binary and `dist/site/` created.
- `npm run pack:cli`: PASS — 62.2 KiB unpacked, 17.0 KiB compressed.
- `cargo clippy --workspace --all-targets -- -D warnings`: PASS.
- `npm run test:performance`: PASS — Lighthouse 96 performance, 100
  accessibility, 100 best practices, 100 SEO; FCP 1.0 s, LCP 1.4 s, TBT
  240 ms, CLS 0.

The packaged crate was unpacked and installed into
`/tmp/log-duplicate-lens-consumer-LabTl0`. The documented Git install was also
run into a separate empty Cargo root. Both binaries reported version 0.1.0,
and both demo commands worked from `/tmp`.

Installed-artifact paths produced these expected results:

| Path | Result |
| --- | --- |
| Normal labeled sample with `--json --fail-on-duplicates` | 2 groups, 3 copies, exit 3 |
| `--max-events 1` | `sampled: true`, truncation caution, exit 0 |
| `--max-groups 0` | clear invalid-limit message, exit 2 |
| Missing file | clear I/O message, exit 1 |
| JSONL forced through `--format loki` | clear invalid Loki JSON message, exit 2 |
| `--max-groups 1` | one retained group and truncation caution, exit 0 |
| 1 MiB plus one byte with `--max-input-mb 1` | safety-limit message, exit 2 |

The live browser invalid-input path named line 1, returned focus to the log
input, and recovered to the three-copy sample after **Show sample result**.

## Live routes, accessibility, privacy, and offline use

| Route | HTTP | Title | h1/main | Axe serious or critical |
| --- | ---: | --- | --- | ---: |
| `/` | 200 | `Log Duplicate Lens — find duplicate Loki logs` | 1 / 1 | 0 |
| `/demo` | 200 | `Demo — Log Duplicate Lens` | 1 / 1 | 0 |
| `/privacy/` | 200 | `Privacy — Log Duplicate Lens` | 1 / 1 | 0 |
| `/terms/` | 200 | `Terms — Log Duplicate Lens` | 1 / 1 | 0 |
| unknown path | 404 | `Page not found — Log Duplicate Lens` | 1 / 1 | 0 |

The deliberate 404 is expected and is not a defect. It is styled, returns HTTP
404, announces the route, focuses its h1, includes the shared footer, and links
back. All rendered HTTP links returned 200. `robots.txt`, `sitemap.xml`, the
manifest, touch icon, social image, and local CLI recording returned their
expected content types.

The factory `verify-url.sh` passed for root, demo, privacy, and terms with no
console errors, one h1, `lang=en`, a main landmark, complete image alt text,
and labeled buttons. Independent Playwright Axe scans found no serious or
critical violations. Keyboard checks found a visible 3 px cream plus 6 px
amber focus ring, no trap, working Enter/Space controls, and a skip link whose
next Tab starts at the primary action. Demo controls measured at least 44 px
high. Reduced motion lowered trace animation to `0.00001s`. The viewport meta
does not disable zoom, and the 720 px reflow check had no horizontal overflow.

Fresh live root and demo sessions requested only
`https://log-duplicate-lens.sociobot.in`, stored no cookie, and produced no
page, console, or failed-request errors. Security headers included CSP,
`frame-ancestors 'none'`, HSTS, `nosniff`, Referrer-Policy, and
Permissions-Policy. The site has no backend, tenant state, payment path, or
live request allowance, so tenant isolation, restart persistence, health, and
429/Retry-After checks do not apply.

After service-worker control, a locally injected stale cache entry did not win
an online reload. An offline `/demo` reload and Reset still showed the two
groups, three copies, and `Offline · analysis and export still work locally`.

## Live implementation identity

Only reports changed after implementation commit `d1e0bc0`. The locally built
candidate and live deployment matched byte for byte:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `d02baec9a90d4bb75a1dde7e30a92fd51c78684add2f11d4a70311703f058d8a` |
| `sw.js` | `f7cbc67cb568e60fa4019060dd1c373f1e768117a5c0d923f87cc47b35bc9ffe` |
| `assets/index-DrKgNdhG.js` | `fe2d596718223b520e27dd51a9cbb7425ae2d59c8361857c412e76763547ac87` |
| `assets/styles-LP4amcsO.css` | `5899608c659c4d010202990643f91dc69d8ffa58fd233ae7199a9d0f8292e79f` |

The initial JavaScript is 10.42 kB raw and the CSS is 20.51 kB raw. The mobile
hero is 24.21 kB. These remain below the product budgets.

## Earlier finding disposition

Every earlier review, verification, polish, and handoff report was read. The
following checks were repeated against the live site or installed artifact.

| Earlier id | Current disposition |
| --- | --- |
| R1-B1 | Job, audience, and primary action remain clear before scrolling. F-7-4 is the separate three-fact layout gap. |
| R1-B2 / F-2-1 / F-3-1 | One-click phone demo remains result-first with its notice and controls visible. Fixed. |
| R1-B3 / F-3-2 | Bundled CLI demo, temporary report, local SVG recording, and transcript all work. Fixed. |
| R1-B4 / F-2-3 | All existing entries pass, but complete public-claim coverage is not fixed; see F-7-1 and F-7-2. |
| R1-B5 | No paid offer or dead checkout claim is present. Fixed. |
| R1-B6 | Demo/legal deep links, route titles, focus announcements, Back behavior, and HTTP 404 work. Fixed. |
| R1-M1 / F-2-4 | Retry-window and install-action terms are consistent. The broader no-metaphor rule still fails under F-7-3. |
| R1-M2 / F-2-5 | Canonical, Open Graph/Twitter metadata, favicon, 180 px touch icon, and 1200 × 630 social image load. Fixed. |
| R1-M3 | Phone layout has no horizontal overflow and keeps essential navigation. Fixed. |
| R1-PWA1 / Verification 1 service-worker finding | Online refresh rejects stale cached HTML and offline fallback works. Fixed. |
| R1-PWA2 / Verification 1 performance finding | Responsive assets and budgets pass; Lighthouse performance is 96. Fixed. |
| F-2-2 | Reset keeps the marker; Start for real removes only demo data. Copy and behavior agree. Fixed. |
| F-3-3 | **Show sample result** analyzes immediately. Fixed. |
| F-3-4 | Browser copy tells the user to remove sensitive input; it does not promise browser redaction. Fixed. F-7-1 concerns CLI report labels. |
| F-3-5 | Browser request-ID normalization is named and tested. Fixed. |
| F-3-6 | Differing browser label evidence is named and tested. Fixed. |
| F-4-1 | Back from demo focuses and announces the home h1. Fixed. |
| F-5-1 | Browser retry-window behavior is registered and tested. Fixed. |
| F-5-2 | Browser alert and byte estimates use plain labels and are tested. Fixed. |
| F-5-3 | Demo, privacy, terms, and 404 focus and announce their destinations. Fixed. |
| F-5-4 | The 404 includes the full footer, provenance, source, privacy, terms, and version. Fixed. |

The deterministic local job does not need an AI step. Adding a model or remote
gateway would not improve this bounded duplicate check and would weaken the
local privacy model.

## Required next review

Fix F-7-1 through F-7-4. Then run every claim command from a fresh checkout,
add the nine missing or incomplete claim groups, install the packaged artifact
again, and repeat the phone first-screen, redaction, privacy, route, offline,
and accessibility checks.

**Final verdict: FAIL — 4 findings, 9 untested public claim groups.**
