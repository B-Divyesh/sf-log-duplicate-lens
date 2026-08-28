# Log Duplicate Lens — polish 2 handoff

## Delivered

Repair commits: `bfb8aa4435348cd0051696feea68f8103e57242b`, `e3f29f8`,
and `a2f04a6` (deployed). The repair closes every finding in review 1 and
review 2.

- The browser demo is genuinely one-click and isolated. `/demo` and `?demo=1`
  analyze the bundled sample immediately. On mobile, the result is first, the
  demo notice stays sticky, and the result heading receives focus.
- Reset and exit have truthful privacy wording and tested storage behavior.
- The claim registry now has 19 observable browser/CLI claims, covering all
  reviewed reliance statements. The CLI still ships its bundled `demo` path.
- The product uses **Retry window** consistently, and the install control has
  a precise accessible name.
- Local 180×180 touch and 1200×630 social PNG assets are composed from the
  product’s original instrument art and documented in `design.md`.
- The scrollable demo evidence pane is keyboard-focusable and labeled.

## Verification

Fresh clean clone `/tmp/log-duplicate-lens-clean-round2` started at
`bfb8aa4`; `npm ci` reported 0 vulnerabilities. Every one of the 19 exact
commands in `.factory/claims.json` passed from that clone: ten Playwright
claim commands and nine targeted CLI claim commands.

Final checkout at `a2f04a6` passed:

```sh
npm test
cargo clippy --workspace --all-targets -- -D warnings
npm run build
npm run pack:cli
npm run test:performance
```

- `npm test`: 7 Rust unit/binary tests, 11 CLI integration tests, 4 Vitest
  tests, and 36 Playwright tests passed across desktop and 390 px projects.
- `npm run build`: produced `target/release/log-duplicate-lens` and
  `dist/site/`.
- `npm run pack:cli`: produced `target/package/log-duplicate-lens-0.1.0.crate`.
- Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO
  100; FCP 0.9 s, LCP 1.4 s, TBT 0 ms, CLS 0.
- `verify-url.sh` against live `/demo`: correct title/lang/h1/main/alt,
  zero console errors, and zero unnamed controls. Live aXe found zero serious
  or critical violations.

## Deployment and live check

Static output was deployed with:

```sh
/opt/fleet/lib/deploy-static.sh log-duplicate-lens dist/site
```

Cold live re-checks at https://log-duplicate-lens.sociobot.in confirm:

- 390×844 landing click → `/demo`: sticky banner and two-group result are both
  visible; three duplicate copies, zero horizontal overflow, result focus.
- `?demo=1` uses only `demo:log-duplicate-lens:active`; Reset retains it and
  Start for real clears it. No off-origin requests or page errors occurred.
- `/`, `/demo`, `/privacy/`, `/terms/`, `/apple-touch-icon.png`, and
  `/social-card.png` return 200; an unknown route returns designed HTTP 404.

Evidence screenshots and verifier output are in ignored
`.factory/evidence/polish-2-live/`. See `.factory/polish-2.md` for the
finding-by-finding map.

## Known gaps

None. The factory owns registry publishing credentials; use `npm run pack:cli`
to prepare the crate, not to publish it.
