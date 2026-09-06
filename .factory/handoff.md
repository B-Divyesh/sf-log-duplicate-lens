# Log Duplicate Lens — repair 2 handoff

## Outcome

Review-7 is closed with no known product defect. The implementation commit is
`943d31ace07714b479dfd11b8e64a6117aecbda2`. The documentation and verification
evidence commit is `70d5c5a077c54ad4a2491c1c0541774f0b4077c7`.

The job is to find suspected duplicate Loki logs across streams. It is for Loki
operators checking inflated alerts and storage. The first action is **Try it
with sample data**.

## What changed

- CLI redaction now covers all user-derived report text, including label names,
  label values, differing-label evidence, timestamps, and evidence lines.
- The 31-claim registry now covers every public CLI behavior. New outcome tests
  cover automatic input detection, default normalization, custom rewrites,
  ignored labels, custom field mappings, standard input, proxy capture, and
  actual group/input limits.
- Removed the public single-binary claim. Rewrote metaphor labels into direct
  product language, including the 404 page.
- Kept the install action after the three first-screen facts on phone. The
  390 × 844 live bounds place all required first-screen content above 605 px.

## Verification

From fresh remote checkout `/tmp/log-duplicate-lens-repair-14DUOR`:

```sh
npm ci
# every exact .factory/claims.json command, separately
npm test
npm run build
npm run pack:cli
cargo clippy --workspace --all-targets -- -D warnings
npm run test:performance
```

All 31 claim commands passed. `npm test` passed 24 Rust tests, 4 Vitest tests,
and 54 Playwright tests. Build and package passed. Lighthouse was 100/100/100/100
(FCP 0.9 s, LCP 1.2 s, TBT 30 ms, CLS 0).

The packaged crate and the documented Git install were each exercised in a
fresh Cargo root. Both ran the demo. The packaged CLI also passed duplicate
exit code 3 and malformed-input exit code 2 paths.

Static deployment succeeded as `cc07872b-9c8a-4629-b474-aada90fa49a8`.
Live root, demo, privacy, and terms passed `verify-url.sh`. Fresh desktop and
phone sessions had no console errors or off-origin requests. Axe found no
serious or critical issue on root, demo, legal routes, or the deliberate
HTTP-404 page. The service worker rejected a stale online shell and reset the
demo offline with three copies.

See [verification-3.md](verification-3.md) for artifact hashes, finding
closures, and detailed live evidence.

## Product boundaries and remaining work

The free local CLI and browser demo are complete. The product intentionally
reports evidence rather than declaring ingestion wrong. It has no backend,
tenant data, payment flow, or AI dependency. There is no advertised paid offer
to register; no billing metadata file is needed. The catalog description is
verb-first and copied to `/work/.evidence/catalog-description.txt`.
