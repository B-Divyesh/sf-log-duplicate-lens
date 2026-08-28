# Log Duplicate Lens — polish 1 handoff

## Delivered

Repair commit: b7e8c29eef035e2a71aaf5780cdb5f450c428dba (with the final static
route configuration committed alongside this handoff).

- One-click browser demo at /demo and ?demo=1. It analyzes the shipped
  seven-record sample, shows two suspected duplicate groups and three duplicate
  copies, and uses only demo: local storage while active.
- Reset demo reruns the sample; Start for real removes demo keys and returns to
  the normal workbench.
- CLI demo command: log-duplicate-lens demo. It uses the bundled sample and
  writes a new report in the operating system temporary directory.
- All reviewed copy, title, metadata, navigation, legal-shell, 390 px, route,
  404, and paid-checkout findings are closed. The unavailable paid offer was
  removed rather than leaving a dead purchase flow.
- Claims registry, demo documentation, copy audit, terminal transcript, and a
  styled 404 are included.

## Verification

Run from a clean checkout:

```sh
npm ci
npm test
cargo clippy --workspace --all-targets -- -D warnings
npm run build
npm run pack:cli
npm run test:performance
```

Local evidence on 2026-08-28:

- npm test: 11 Rust tests, 4 Vitest tests, and 22 Playwright tests across
  desktop and 390 px mobile passed. Browser coverage includes aXe with no
  serious/critical findings, demo isolation, download export, offline demo,
  malformed-input focus recovery, route titles, mobile overflow, and the PWA
  online-update/offline-shell regression.
- Every .factory/claims.json command passed: six tagged browser claims and the
  CLI bundled-demo integration claim.
- Clippy passed with -D warnings. npm run build produced target/release and
  dist/site. npm run pack:cli produced target/package/log-duplicate-lens-0.1.0.crate
  (16,751 bytes).
- npm run test:performance reported Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 0.9 s, LCP 1.4 s, TBT 0 ms, CLS 0.
- verify-url.sh against localhost and live passed: title, lang, one h1, main,
  alt text, no unlabeled buttons, and no console/page errors.

## Deployment and live evidence

Static deploy root: dist/site. Deployment used:

```sh
/opt/fleet/lib/deploy-static.sh log-duplicate-lens dist/site
```

The live cold-browser check at https://log-duplicate-lens.sociobot.in/demo
found title “Demo — Log Duplicate Lens,” the demo banner, 3 copies, 2 groups,
0 px mobile overflow, only demo:log-duplicate-lens:active in local storage,
and no errors. ?demo=1 also entered the demo. Root, Privacy, and Terms return
200; /not-a-real-route returns 404. Screenshots and verify output are under
.factory/evidence/ (not tracked).

## Known gaps

None for the reviewed release scope. The factory owns publishing registry
credentials; use npm run pack:cli to prepare the crate, not to publish it.
