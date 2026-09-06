# Find duplicate Loki logs across streams — independent verification 3

**Verdict: PASS**

**Finding count:** 0

**Untested public claim count:** 0

**Implementation candidate:** `943d31ace07714b479dfd11b8e64a6117aecbda2`

**Documentation baseline:** `66b6b378cd2b8c1e12de80ca4b94667138d2c3d9`

**Live URL:** <https://log-duplicate-lens.sociobot.in/>

**Verified:** 2026-09-06

## Result

The live product, clean checkout, packed crate, and documented Git install all
pass. No finding remains at any severity. Every one of the 31 public claims has
an exact test, and every declared command passed separately from a fresh
checkout.

The implementation is `943d31a`. Commits through the reviewed documentation
baseline `66b6b37` change only `.factory/handoff.md` and
`.factory/verification-3.md`. Fresh production output matches the live site
byte for byte.

## Job, audience, and first action

Fresh 390 × 844 and 1440 × 1000 Chromium sessions were opened without prior
storage. Before scrolling, both said:

- Job: **Find duplicate Loki logs across streams**.
- Audience: Loki operators checking inflated alerts and storage.
- First action: **Try it with sample data**.

The phone placed the job at 210–353 px, audience at 369–443 px, action at
463–507 px, and all three facts at 548–605 px. Desktop also kept every required
item inside its first 1000 px. Neither viewport overflowed horizontally.

The title is `Log Duplicate Lens — find duplicate Loki logs`. The h1 names the
job. Section headings and controls use direct words, not product metaphors.

## Live sample and data isolation

One click from the fresh phone session opened `/demo`. The first view contained
the persistent **Demo — sample data, nothing is saved** notice, **Reset demo**,
**Start for real**, and the populated result. The notice occupied 4–106 px and
the result heading 122–157 px.

The seven realistic Loki-style records produced:

- 2 suspected duplicate groups and 3 duplicate copies;
- 1.75× estimated alerts and 91 B of extra logs;
- checkout and inventory messages;
- 411 ms and 720 ms retry timing;
- differing `shard` evidence.

JSON export contained the same two groups and three copies. Reset reran the
sample and kept `demo:log-duplicate-lens:active`. Start for real removed the
demo key, preserved a seeded `real:verify3-probe` value, returned home, and
showed the empty checker. No off-origin request, cookie, console error, page
error, or failed request occurred. The demo did not read or change normal data.

Malformed browser input named line 1 and focused the log input. **Show sample
result** then recovered to the populated result. A 5 MiB plus one-byte file
showed the stated limit and directed the user to the CLI.

## Every public claim

The clone at `/tmp/log-duplicate-lens-verify3-UuXE2e` began at documentation
SHA `66b6b37`. Node 22.23.2, npm 10.9.8, Rust 1.98.0, and Cargo 1.98.0 satisfy
the documented prerequisites. `npm ci` installed 175 packages with zero
reported vulnerabilities. Each exact `.factory/claims.json` command ran in a
separate process after installation.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `sample-analysis` | PASS | `/demo` showed 2 groups and 3 copies. |
| `demo-mobile-result` | PASS | Phone click kept the notice and populated result inside 390 × 844. |
| `browser-sample-action` | PASS | Show sample result analyzed immediately. |
| `demo-isolation` | PASS | Reset retained only the demo marker; exit removed it and preserved normal storage. |
| `demo-private` | PASS | Complete sample flow made no off-origin request. |
| `json-export` | PASS | Download parsed as JSON with 2 groups and 3 copies. |
| `browser-limit` | PASS | 5 MiB plus one byte produced the stated limit error. |
| `offline-demo` | PASS | Offline Reset retained the 3-copy result. |
| `browser-local-processing` | PASS | Pasted and selected samples produced results without off-origin traffic. |
| `browser-input-formats` | PASS | JSON lines, Loki response, and plain lines were analyzed. |
| `browser-normalization` | PASS | Changing request IDs formed one cross-stream group. |
| `browser-label-evidence` | PASS | Result listed the differing `shard` label. |
| `browser-retry-window` | PASS | 1.6-second events did not match at 0.5 s and did match at 2 s. |
| `browser-impact-estimates` | PASS | Fixture showed 1 copy, 2.00× alerts, and 1 B. |
| `site-privacy` | PASS | Fresh root used only same-origin requests and no persistent storage or cookie. |
| `cli-demo-recording` | PASS | Local SVG and transcript matched the real seven-record CLI demo. |
| `cli-demo` | PASS | Installed demo read 7 records, found 2 groups/3 copies, and wrote under `/tmp`. |
| `cli-detection` | PASS | Cross-stream fixture produced one group and duplicate exit 3. |
| `cli-json` | PASS | `--json` output parsed successfully. |
| `report-evidence` | PASS | Report contained message, retry timing, and stream labels. |
| `cli-loki-format` | PASS | Required Loki response parsed and produced a group. |
| `cli-retry-window` | PASS | The configured boundary changed the match result. |
| `cli-limits` | PASS | Event/group truncation, input-size boundary, and zero limits were observed. |
| `cli-redaction` | PASS | Complete serialized report removed a secret from messages and label names/values. |
| `cli-local-processing` | PASS | Capture proxy observed zero connection attempts. |
| `cli-auto-format` | PASS | Auto mode identified Loki, JSON lines, and plain text. |
| `cli-default-normalization` | PASS | UUID, IP, timestamp, and long-number changes matched only with defaults enabled. |
| `cli-normalize-rule` | PASS | The documented rewrite changed the fingerprint and match result. |
| `cli-ignore-label` | PASS | Ignoring `pod` changed stream comparison as documented. |
| `cli-custom-fields` | PASS | Message, timestamp, and stream field mappings produced a group. |
| `cli-stdin` | PASS | The documented standard-input example produced one JSON group. |

An independent scan of the live landing, privacy notice, README, and installed
`--help` found no unlisted reliance claim. Privacy statements map to the local
processing, isolation, no-request, site-privacy, and offline claims. The clean
consumer installs also proved that the CLI works without an account.

## Clean quality gates and installed artifact

The fresh checkout passed:

- `npm test`: 24 Rust tests, 4 Vitest tests, and 54 Playwright tests.
- `npm run build`: release binary and `dist/site/` created.
- `npm run pack:cli`: 75.7 KiB unpacked, 19.6 KiB compressed.
- `cargo clippy --workspace --all-targets -- -D warnings`.
- `npm run test:performance`: Lighthouse 97 performance, 100 accessibility,
  100 best practices, and 100 SEO; FCP 1.0 s, LCP 1.4 s, TBT 200 ms, CLS 0.

Production output contains 10,413 B of initial JavaScript, 20,745 B of CSS,
and a 24,206 B phone hero. These are below the required budgets.

The packaged crate was installed into an empty Cargo root. A second empty root
installed the documented Git command at `66b6b37`. Both public binaries
reported version 0.1.0 and completed the demo from an unrelated directory.

Installed-artifact paths passed:

| Path | Result |
| --- | --- |
| Bundled sample with `--fail-on-duplicates` | 2 groups, 3 copies, exit 3. |
| Malformed forced JSON lines | Clear line-1 error, exit 2. |
| Empty input | Empty report, exit 0. |
| Same-stream repeats | 0 groups and 0 copies. |
| Secret in message and label name/value | Secret absent from the complete report. |
| `--max-groups 1` | One group plus truncation caution. |
| `--max-events 1` | Sampled result plus truncation caution. |
| Zero resource limit | Clear validation error, exit 2. |
| 1 MiB plus one byte | Clear input-size error, exit 2. |

The researched 20-group fixture found all 20 intentional groups and no group
from 20 unique records: 100% detection and 0% false-positive groups.

## Live routes, accessibility, privacy, and offline use

| Route | HTTP | Title | h1 | Focus after route load | Axe serious/critical |
| --- | ---: | --- | --- | --- | ---: |
| `/` | 200 | Log Duplicate Lens — find duplicate Loki logs | Find duplicate Loki logs across streams | Normal initial document focus | 0 |
| `/demo` | 200 | Demo — Log Duplicate Lens | Review the sample duplicate groups | Populated result | 0 |
| `/privacy/` | 200 | Privacy — Log Duplicate Lens | Privacy | Privacy h1 | 0 |
| `/terms/` | 200 | Terms — Log Duplicate Lens | Terms | Terms h1 | 0 |
| Unknown route | 404 | Page not found — Log Duplicate Lens | Page not found | Page not found h1 | 0 |

The unknown route is a deliberate, designed HTTP 404. It has **Go home** and
**Open sample analysis** links plus the shared footer. It is expected behavior,
not a defect.

The factory URL verifier passed home, demo, privacy, and terms. All routes have
`lang=en`, one h1, one main landmark, complete image alternatives, and labeled
controls. Fresh live sessions produced no product console error. All rendered
HTTP links returned 200; the privacy and support `mailto:` links are valid
non-HTTP contacts. Robots, sitemap, manifest, recording, icons, and social art
returned their expected content types.

Keyboard checks reached the skip link first. Its focus treatment is a 3 px
cream outline plus 6 px amber ring. Enter and Space operated sample and Reset;
focus then advanced to Export without a trap. Back from Demo focused the home
h1 and announced the restored title. Demo controls measured 44 px high.
Reduced motion lowered trace animation to `0.00001s`. The viewport permits
zoom, and 390 px and 720 px reflow checks had no horizontal overflow.

Fresh root and demo contexts made only same-origin requests. Root storage,
session storage, and cookies were empty. Security headers include CSP,
`frame-ancestors 'none'`, HSTS, `nosniff`, Referrer-Policy, and
Permissions-Policy. The privacy page explains storage, traffic, offline use,
and contact choices accurately.

After service-worker control, an injected stale cached shell did not win an
online reload. Offline `/demo` reload and Reset still showed 3 copies and the
explicit offline notice. `/sw.js` uses `no-cache`; hashed JavaScript is served
immutable.

This is a static site and local CLI. It has no backend, tenant state, payment
path, health endpoint, restart-persistent server data, or live rate allowance.
Tenant isolation, SQLite persistence, health, and 429/Retry-After checks do not
apply. The product does not need an AI step: deterministic local matching is
the core job, and a remote model would weaken its privacy boundary.

## Live implementation identity

| Artifact | Local and live SHA-256 |
| --- | --- |
| `index.html` | `a2430328f2f689d27bec30fd601bd9744d788d2f6dfef60ff8469e654947016b` |
| `sw.js` | `af2b346854cc537ad0cb0d8fee507aea684866b70903377a8f41d3aae8acd88e` |
| `assets/index-B7O_KNnC.js` | `35a065e89a8f614073fe14599e929312d30cba8ff73b0458cfbf30d7d6470ea3` |
| `assets/styles-BmhHAa86.css` | `aaac70f490cfc3e39f8a6f7766b06ad8419f4fa48143688a5904accad0d8b446` |

## Earlier finding disposition

Every review, verification, and polish report was inspected. The current
disposition was proved again, including minor findings.

| Earlier finding | Current evidence and disposition |
| --- | --- |
| R1-B1 | Job, audience, first action, and facts are visible before scrolling. Fixed. |
| R1-B2 / F-2-1 / F-3-1 | One click opens the isolated, result-first phone demo. Fixed. |
| R1-B3 / F-3-2 | CLI demo, bundled sample, temporary report, SVG recording, and transcript work. Fixed. |
| R1-B4 / F-2-3 | All 31 public claim groups have complete passing tests. Fixed. |
| R1-B5 | No paid offer or dead checkout remains. Fixed. |
| R1-B6 | Demo/legal deep links, Back, focus, announcements, and HTTP 404 work. Fixed. |
| R1-M1 / F-2-4 | Controls and headings use consistent direct words. Fixed. |
| R1-M2 / F-2-5 | Metadata, canonical links, local icons, and 1200 × 630 social art load. Fixed. |
| R1-M3 | Phone has no horizontal overflow and retains essential navigation. Fixed. |
| Verification 1 update finding | Online navigation rejects the stale shell; offline fallback works. Fixed. |
| Verification 1 performance finding | Lighthouse performance is 97 and budgets pass. Fixed. |
| F-2-2 | Reset and Start for real behavior match the privacy wording. Fixed. |
| F-3-3 | Show sample result analyzes immediately. Fixed. |
| F-3-4 | Browser copy gives redaction guidance without promising a browser redactor. Fixed. |
| F-3-5 | Request-ID normalization is explained and tested. Fixed. |
| F-3-6 | Differing stream labels are explained and tested. Fixed. |
| F-4-1 | Back focuses and announces the home h1. Fixed. |
| F-5-1 | Browser retry-window behavior is registered and tested. Fixed. |
| F-5-2 | Alert/byte labels are direct and their values are tested. Fixed. |
| F-5-3 | Demo, privacy, terms, and 404 focus and announce their destinations. Fixed. |
| F-5-4 | The 404 uses the shared footer and provides routes back. Fixed. |
| F-7-1 | CLI redaction removes secrets from every user-derived report field. Fixed. |
| F-7-2 | Auto formats, normalization, rewrites, ignored labels, custom fields, stdin, network capture, and real limits are tested. Fixed. |
| F-7-3 | Metaphor labels and mood headings are gone. Fixed. |
| F-7-4 | All three facts fit the 390 × 844 first screen. Fixed. |

## Findings

None.

**Final verdict: PASS — 0 findings and 0 untested public claims.**
