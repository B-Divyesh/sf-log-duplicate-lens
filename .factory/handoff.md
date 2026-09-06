# Log Duplicate Lens — review 8 handoff

## Outcome

**PASS — 0 findings and 0 untested public claims.**

Review 8 reviewed implementation
`943d31ace07714b479dfd11b8e64a6117aecbda2` against documentation baseline
`66b6b378cd2b8c1e12de80ca4b94667138d2c3d9` and the live site at
<https://log-duplicate-lens.sociobot.in/>. Commits after the implementation
candidate contain only report and handoff changes. No product code was changed.

The job is to find duplicate Loki logs across streams. It is for Loki
operators checking inflated alerts and storage. The first action is **Try it
with sample data**.

## Verification completed

- Ran all 31 exact claim commands separately from a fresh clone. All passed.
- Ran `npm test`: 24 Rust, 4 Vitest, and 54 Playwright tests passed.
- Ran `npm run build`, `npm run pack:cli`, strict Clippy, and the performance
  gate. All passed.
- Lighthouse scored 96 performance and 100/100/100 for accessibility, best
  practices, and SEO. FCP was 1.0 s, LCP 1.4 s, TBT 210 ms, and CLS 0.
- Installed the packed crate into an empty Cargo root. Installed the documented
  Git command into a second empty root. Both demos found two groups and three
  copies and wrote their reports under `/tmp`.
- Exercised normal, malformed, empty, same-stream, redaction, resource-limit,
  input-size, and duplicate-exit paths on the installed artifact.
- The 20-group labeled fixture measured 100% detection and 0% false-positive
  groups.
- Opened fresh desktop and 390 × 844 phone browsers. Job, audience, primary
  action, and all three facts fit before scrolling.
- Verified the one-click populated demo, persistent notice, JSON export, Reset,
  Start for real, normal-storage preservation, invalid recovery, and 5 MB
  boundary. No off-origin request or product console error occurred.
- Verified keyboard operation, visible focus, Back focus, route announcements,
  reduced motion, 44 px demo controls, reflow, and Axe on home, demo, privacy,
  terms, and the deliberate HTTP-404 page.
- Verified offline reload/Reset and that a stale cached shell loses to an
  online refresh.
- Crawled rendered HTTP links and checked route titles, metadata, legal pages,
  assets, security headers, privacy behavior, and the styled 404.
- Compared live and local HTML, service worker, JavaScript, and CSS hashes.
  They match exactly.
- Rechecked every earlier review and verification finding, including minor
  copy, focus, 404-footer, asset, and first-screen findings. All remain fixed.

## Commands

```sh
npm ci
# Run every `test` value from .factory/claims.json separately.
npm test
npm run build
npm run pack:cli
cargo clippy --workspace --all-targets -- -D warnings
npm run test:performance
```

The factory URL verifier also passed `/`, `/demo`, `/privacy/`, and `/terms/`.

## Product boundary and next steps

This product is a static site and local CLI. It has no backend, tenant state,
payment path, server-side persistence, or AI dependency, so backend isolation,
restart, health, and 429 checks do not apply.

No product follow-up is required. Preserve the claim matrix and run it before
future releases. See [review-8.md](review-8.md) for the current complete
evidence and earlier-finding disposition.
