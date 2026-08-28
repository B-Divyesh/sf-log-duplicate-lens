import { once } from "node:events";
import { readFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const root = fileURLToPath(new URL("..", import.meta.url));
const port = "4174";
const url = `http://127.0.0.1:${port}/`;
const report = `${root}/.lighthouse-report.json`;

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: "inherit", ...options });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolve() : reject(new Error(`${command} exited with ${code}`)));
  });
}

async function waitForServer() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The preview server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Vite preview did not become ready for Lighthouse");
}

const preview = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--port", port, "--strictPort"], {
  cwd: root,
  stdio: "inherit"
});

try {
  await waitForServer();
  await run(process.execPath, [
    "node_modules/lighthouse/cli/index.js",
    url,
    "--only-categories=performance,accessibility,best-practices,seo",
    "--output=json",
    `--output-path=${report}`,
    "--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage --disable-gpu",
    "--quiet"
  ], { env: { ...process.env, CHROME_PATH: chromium.executablePath() } });
  const result = JSON.parse(await readFile(report, "utf8"));
  const scores = Object.fromEntries(Object.entries(result.categories).map(([name, category]) => [name, Math.round(category.score * 100)]));
  const metrics = ["first-contentful-paint", "largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift"]
    .map((id) => result.audits[id].displayValue)
    .join(", ");
  console.log(`Lighthouse: ${Object.entries(scores).map(([name, score]) => `${name} ${score}`).join(", ")}; FCP, LCP, TBT, CLS: ${metrics}`);
  if (scores.performance < 90 || scores.accessibility < 95 || scores["best-practices"] < 95 || scores.seo < 95) {
    throw new Error(`Lighthouse budget failed: ${JSON.stringify(scores)}`);
  }
} finally {
  preview.kill("SIGTERM");
  await once(preview, "exit").catch(() => undefined);
  await rm(report, { force: true });
}
