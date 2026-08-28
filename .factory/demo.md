# Demo sandbox

- Browser demo: https://log-duplicate-lens.sociobot.in/demo or https://log-duplicate-lens.sociobot.in/?demo=1.
- CLI demo: log-duplicate-lens demo.

Both demos use the seven labeled records in examples/labeled-sample.jsonl.
They contain a three-copy checkout timeout and a two-copy inventory retry. The
browser immediately reports two suspected duplicate groups and three duplicate
copies. Demo entry focuses that result below the persistent safety banner. The
landing page also shows a self-hosted SVG recording captured from the same CLI
command, with an HTML transcript. The CLI writes its JSON report to a new file in the operating system
temporary directory and prints the path.

The browser demo uses only the localStorage key
demo:log-duplicate-lens:active. It does not read normal application storage.
**Reset demo** reruns the bundled sample and keeps the active demo marker.
**Start for real** removes every demo-prefixed key, preserves normal storage,
and returns to the empty workbench.
