# Find duplicate Loki logs across streams — review 8

**Verdict: PASS**

**Finding count:** 0  
**Untested public claim count:** 0

## Scope

Reviewed live product: <https://log-duplicate-lens.sociobot.in>  
Implementation candidate: `943d31ace07714b479dfd11b8e64a6117aecbda2`  
Documentation baseline: `66b6b378cd2b8c1e12de80ca4b94667138d2c3d9`  
Review baseline: `f2f251c9c4d13c22f3776a1003da69a64ef5b13d`

Commits after the implementation candidate contain only reports and handoff
material. No product code was modified during this review. Local rebuilt
HTML, JavaScript, CSS, service worker, demo, privacy, terms, and 404 content
matched the live deployment byte-for-byte where those files are served.

## Job, audience, and first action

The job is to find suspected duplicate Loki logs across streams. It is for
Loki operators checking inflated alerts and storage. The first action is
**Try it with sample data**.

Fresh desktop and 390 × 844 phone contexts loaded at scroll position zero.
Both showed the job, audience sentence, primary action, and three plain facts
on the first screen. Phone had no horizontal overflow.

## Demo and real-data boundary

The first click opened `/demo` with a populated result: two suspected
duplicate groups and three duplicate copies. The persistent notice reads
“Demo — sample data, nothing is saved.” **Reset demo** restored the same
sample result. **Start for real** removed all `demo:` keys and kept an
independently seeded normal-storage value. No request left the product origin
through the complete sample flow.

The invalid-input path gave “Line 1 is not valid JSON …”, returned focus to
the input, and then recovered with **Show sample result**. A fresh controlled
live context reloaded `/demo` offline after service-worker control and Reset
still produced the two-group, three-copy result.

## Claims

From a fresh clone at `f2f251c`, `npm ci` completed with zero vulnerabilities.
Every exact `test` value in `.factory/claims.json` was run separately. All 31
passed. `npm test` then passed with Playwright’s final result
`{"status":"passed","failedTests":[]}`.

| Claims | Result |
| --- | --- |
| `sample-analysis`, `demo-mobile-result`, `browser-sample-action` | PASS — sample result, phone viewport, and immediate action |
| `demo-isolation`, `demo-private`, `offline-demo`, `site-privacy` | PASS — separate demo state, same-origin requests, offline reset, no tracking storage |
| `json-export`, `browser-limit`, `browser-local-processing`, `browser-input-formats` | PASS — report download, 5 MiB boundary, local analysis, JSONL/Loki/plain input |
| `browser-normalization`, `browser-label-evidence`, `browser-retry-window`, `browser-impact-estimates` | PASS — matching, label evidence, time window, copy/alert/byte output |
| `cli-demo-recording` | PASS — self-hosted SVG recording and accessible transcript |
| `cli-demo`, `cli-detection`, `cli-json`, `report-evidence`, `cli-loki-format`, `cli-retry-window`, `cli-limits`, `cli-redaction`, `cli-local-processing` | PASS — demo, detection, JSON, evidence, Loki, limits, redaction, no proxy use |
| `cli-auto-format`, `cli-default-normalization`, `cli-normalize-rule`, `cli-ignore-label`, `cli-custom-fields`, `cli-stdin` | PASS — formats, matching controls, field mapping, standard input |

The landing copy and README were checked against the registry and current
copy audit. There are no public reliance claims without a registered,
observable test.

## Quality gates and CLI consumer

The clean checkout passed:

```sh
npm test
npm run build
npm run pack:cli
cargo clippy --workspace --all-targets -- -D warnings
npm run test:performance
```

`npm run build` produced `dist/site/`. The packed crate was produced at
`target/package/log-duplicate-lens-0.1.0.crate` (20 KB). The static bundle is
well below the product budget: main JavaScript is 10,413 bytes uncompressed
and CSS is 20,745 bytes uncompressed.

Lighthouse reported **96 performance, 100 accessibility, 100 best practices,
and 100 SEO**; FCP 1.0 s, LCP 1.4 s, TBT 210 ms, CLS 0.

In an empty consumer directory, the documented
`cargo install --path crates/log-duplicate-lens` installation succeeded. The
installed binary's `demo` command read seven records, found two groups and
three copies, and wrote a report in `/tmp`. It also parsed the documented
stdin JSONL shape and returned the documented recoverable I/O error and exit
code 2 for a missing file.

## Live site, accessibility, and routes

`verify-url.sh` passed for `/`, `/demo`, `/privacy/`, and `/terms/`: each had
an English language declaration, title, one h1, main landmark, image alt
coverage, no unlabeled buttons, and no console errors. Axe found zero
serious or critical violations on those routes and the designed 404 page.

| Route | HTTP | Title | Result |
| --- | ---: | --- | --- |
| `/` | 200 | Log Duplicate Lens — find duplicate Loki logs | PASS |
| `/demo` | 200 | Demo — Log Duplicate Lens | PASS |
| `/privacy/` | 200 | Privacy — Log Duplicate Lens | PASS |
| `/terms/` | 200 | Terms — Log Duplicate Lens | PASS |
| `/not-a-real-route` | 404 | Page not found — Log Duplicate Lens | PASS — expected HTTP 404 with styled page and way back |

The 404 document causes the browser’s normal “resource returned 404” console
notice for its own navigation; it has no page error or broken user path and
is not a defect. All rendered internal links returned 200; the source link
returned 200 and mail links are explicit. Live response headers include a
matching CSP with `frame-ancestors` as a response header, referrer policy,
content-type protection, and a restrictive permissions policy.

Keyboard Tab reached the visible **Skip to main content** link first (cream
3 px focus ring). Keyboard Enter operated the sample action and Reset.
Under reduced motion, the live page reported `animation: none` and a near-zero
transition duration. Live request recording used only
`https://log-duplicate-lens.sociobot.in`; there are no analytics, tracking
pixels, third-party fonts, or runtime CDNs.

## Earlier findings

All earlier issues were rechecked and remain fixed: first-screen clarity;
one-click phone demo and data isolation; bundled CLI demo/recording; complete
claims; removed dead checkout; routing, focus and announcements; direct
controls; metadata and local assets; responsive layout; service-worker update
and offline fallback; privacy wording; browser normalization, label, retry,
and impact claims; shared 404 footer; CLI redaction, formats, limits,
normalization, mappings, stdin, and no-network behavior; and removal of mood
headings. This includes every minor finding recorded in reviews 1–7 and
verifications 1–3.

## Findings

None.

**Final verdict: PASS — 0 findings and 0 untested public claims.**
