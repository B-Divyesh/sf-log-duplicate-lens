# Log Duplicate Lens — review 7 handoff

## Outcome

Completed the seven-day independent review without changing product code.
`.factory/review-7.md` records **FAIL**: four findings and nine untested public
claim groups. The main behavior defect is that CLI redaction leaves matching
secrets in stream-label values inside the exported report.

## What was verified

- Fresh live Chromium at 390 px and desktop: job, audience, first action,
  one-click populated demo, persistent notice, Reset, Start for real, storage
  isolation, invalid-input recovery, offline reset, and same-origin requests.
- All 25 exact claim commands passed independently from clean clone
  `/tmp/log-duplicate-lens-review7-clean` at documentation SHA `7d6ce5c`.
- `npm test`, `npm run build`, `npm run pack:cli`, strict Clippy, and
  `npm run test:performance` passed. Lighthouse was 96/100/100/100.
- The packaged crate and documented Git source installed into separate empty
  Cargo roots. Normal, duplicate, invalid, limit, missing-file, and demo paths
  were exercised from `/tmp`.
- Live root, demo, privacy, terms, and intentional 404 routes had correct
  status, title, h1/main structure, metadata, links, focus announcements, and
  zero serious/critical Axe violations. The deliberate HTTP 404 is expected.
- Live HTML, service worker, JavaScript, and CSS hashes exactly match
  implementation commit `d1e0bc035ef988d196588e6fc4fbe7bfff3fe578`.
- Every earlier review and verification finding was rechecked. The specific
  prior repairs hold, except the broader claims and plain-copy rules now have
  findings F-7-1 through F-7-3.

## Run and verify

```sh
npm ci
npm test
npm run build
```

Then run each exact `test` command in `.factory/claims.json` individually. The live review target is <https://log-duplicate-lens.sociobot.in> and the CLI demo is `log-duplicate-lens demo` from a temporary directory.

## Known gaps

- F-7-1: `--redact` does not redact matching stream-label names or values.
- F-7-2: nine public CLI claim groups lack complete contract tests.
- F-7-3: several labels/headings use instrument metaphor or invented numbering.
- F-7-4: only one of three facts fits fully in the 390 × 844 first screen.
