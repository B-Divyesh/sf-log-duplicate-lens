# Independent repair verification 3 — PASS

**Implementation candidate:** `943d31ace07714b479dfd11b8e64a6117aecbda2`  
**Live URL:** <https://log-duplicate-lens.sociobot.in/>  
**Date:** 2026-09-06

## Outcome

All four review-7 findings are closed. The fresh checkout has 31 declared
claims, and every exact claim command passed. The deployed HTTPS site matches
the implementation candidate. No known product defect remains.

## Review-7 closure

| Finding | Repair and evidence |
| --- | --- |
| F-7-1 label-secret redaction | Report redaction now runs over every user-derived report string after analysis. It redacts message previews, stream-label names and values, differing-label evidence, timestamps, and evidence lines. The regression fixture puts a matching secret in a message, label value, and label name, then asserts the complete JSON report lacks it. |
| F-7-2 incomplete CLI claims | Removed the public “single binary” wording. Added outcome checks for automatic Loki/JSON-lines/text detection, UUID/IP/time/long-number matching, `--normalize-rule`, `--ignore-label`, custom JSON fields, standard input, and a configured capture proxy. The limits check now proves max-groups truncation and the 1 MiB boundary. |
| F-7-3 metaphor labels | Replaced `Instrument 04`, `Bench test`, `Input A`, `Readout B`, `Local circuit`, `Put the lens beside your logs`, and the 404 instrument heading with direct labels such as Browser log checker, Log input, Results, Runs locally, Install the CLI, and Page not found. |
| F-7-4 phone first screen | Moved Install the CLI after the three facts and tightened only the mobile hero spacing. A 390 × 844 regression test and live check keep job, audience, action, and all three facts fully inside the first viewport. |

## Clean checkout

Fresh clone: `/tmp/log-duplicate-lens-repair-14DUOR` from `origin/main` at
the implementation SHA. `npm ci` installed 175 packages and reported zero
vulnerabilities.

- Every one of the 31 exact commands in `.factory/claims.json` passed when
  run separately. The command logs are `/tmp/log-duplicate-lens-claim-*.log`.
- `npm test` passed: 24 Rust tests, 4 Vitest tests, and 54 Playwright checks.
- `npm run build` emitted `target/release/log-duplicate-lens` and `dist/site/`.
- `npm run pack:cli` passed: 75.7 KiB unpacked and 19.6 KiB compressed.
- `cargo clippy --workspace --all-targets -- -D warnings` passed.
- `npm run test:performance` passed: Lighthouse 100 performance, 100
  accessibility, 100 best practices, 100 SEO; FCP 0.9 s, LCP 1.2 s, TBT 30
  ms, CLS 0.

The packaged crate was installed into a new temporary Cargo root. Its CLI
reported version 0.1.0, completed `demo` with two groups and three copies,
returned exit 3 for the bundled duplicate sample with `--fail-on-duplicates`,
and returned exit 2 for malformed JSON. The documented Git installation was
also installed into a separate new Cargo root and completed the demo.

## Live HTTPS check

Static deployment succeeded as deployment
`cc07872b-9c8a-4629-b474-aada90fa49a8`. Live artifacts match the local
implementation build:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `a2430328f2f689d27bec30fd601bd9744d788d2f6dfef60ff8469e654947016b` |
| `sw.js` | `af2b346854cc537ad0cb0d8fee507aea684866b70903377a8f41d3aae8acd88e` |
| `assets/index-B7O_KNnC.js` | `35a065e89a8f614073fe14599e929312d30cba8ff73b0458cfbf30d7d6470ea3` |
| `assets/styles-BmhHAa86.css` | `aaac70f490cfc3e39f8a6f7766b06ad8419f4fa48143688a5904accad0d8b446` |

Fresh desktop and 390 × 844 phone sessions identified the job as finding
duplicate Loki logs across streams, the audience as Loki operators checking
alert and storage inflation, and the first action as **Try it with sample
data**. Before scrolling, the phone bounds were: job 210–353 px, audience
369–443 px, action 463–507 px, and the three facts 548–605 px.

One live click opened the populated demo with its persistent notice, two
groups, and three duplicate copies. Reset retained the sample result. Start
for real removed only the demo marker and preserved a seeded normal-storage
probe. The flow made no off-origin request and produced no console error.

`verify-url.sh` passed on root, demo, privacy, and terms. The live route audit
found correct titles, one h1, one main landmark, and zero serious or critical
Axe violations on root, demo, privacy, terms, and the deliberate HTTP-404
page. The 404 returned 404 as intended. A live service-worker check rejected a
locally injected stale online shell, then reloaded and reset the demo offline
with three copies.

## Earlier history

The one-click demo, isolation, CLI demo recording, route focus, static 404,
metadata, local assets, service-worker update path, offline reset, keyboard
operation, reduced motion, retry-window behavior, impact estimates, and legal
route focus repairs from R1 through review 6 were all re-exercised by the
fresh suite and live route audit. Their protections remain in place.

## Honest limits

The tool intentionally reports evidence, not a verdict that ingestion is
wrong. It remains local and has no backend, tenant state, payment offer, or
external AI dependency. There is no advertised paid offer to register with the
billing operator. The catalog description remains verb-first, 85 characters,
and is copied to `/work/.evidence/catalog-description.txt`.
