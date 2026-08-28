# Log Duplicate Lens

Find suspected duplicate Loki logs across streams.

For Loki and JSON-log operators checking whether duplicate ingestion inflates
alerts and storage. The report shows messages, timing, and stream labels for
each suspected duplicate group.

Try the browser sample at <https://log-duplicate-lens.sociobot.in/demo>.

## Install

Build the single Rust binary from this checkout:

```sh
cargo install --path crates/log-duplicate-lens
```

## Try the bundled sample

Run this from any directory after installation:

```sh
log-duplicate-lens demo
```

It reads the seven-record bundled sample and writes a report to a new temporary
file. The command prints that file path.

## Analyze a log export

```sh
log-duplicate-lens loki.jsonl
```

Use `--format loki` for a Loki query response. Use `--window 1500ms` to set
the retry window. Add `--json` for a machine-readable report.

```sh
log-duplicate-lens export.json --format loki --window 1500ms --json
```

Use `--max-events`, `--max-groups`, and `--max-input-mb` to set limits for
large exports. Use `--redact 'token=[^ ]+=>token=[REDACTED]'` before sharing a
report.

## What a result means

A suspected duplicate group is a lead, not proof of bad ingestion. Check retry
timing, stream sharding, and producer request IDs before changing a pipeline.

## Develop, test, and deploy

Requirements: Rust 1.85+, Node 22+, and npm 10+.

```sh
npm ci
npm test
npm run build
npm run pack:cli
npm run test:performance
```

`npm run build` creates the binary in `target/release/` and the static site
in `dist/site/`. Deploy `dist/site/` with the factory static deploy work
order. `npm run pack:cli` prepares a crate but does not publish it.

## Privacy and software license

The browser demo uses its own `demo:` local-storage key. Resetting reruns the
sample. Leaving the demo removes that key. See the [privacy notice](https://log-duplicate-lens.sociobot.in/privacy/)
and [terms](https://log-duplicate-lens.sociobot.in/terms/).

MIT © 2026 Sociobot (Param Factory). See [LICENSE](LICENSE).
