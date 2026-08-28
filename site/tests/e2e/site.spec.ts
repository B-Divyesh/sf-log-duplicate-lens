import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("@claim:sample-analysis demo immediately shows the bundled duplicate result", async ({ page }) => {
  for (const path of ["/demo", "/?demo=1"]) {
    await page.goto(path);
    await expect(page).toHaveTitle("Demo — Log Duplicate Lens");
    await expect(page.getByLabel("Demo controls")).toContainText("sample data, nothing is saved");
    await expect(page.locator("#readout-state")).toHaveText("Evidence found");
    await expect(page.locator("#metric-copies")).toHaveText("3");
    await expect(page.locator("h1")).toHaveText("Review the sample duplicate groups");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByRole("heading", { name: "2 suspected duplicate groups" })).toBeVisible();
  }
});

test("@claim:demo-isolation demo stores no normal application data and reset keeps its result", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("real:operator-setting", "keep"));
  await page.goto("/demo");
  await expect(page.locator("#metric-copies")).toHaveText("3");
  const keys = await page.evaluate(() => Object.keys(localStorage).sort());
  expect(keys).toEqual(["demo:log-duplicate-lens:active", "real:operator-setting"]);
  await page.getByRole("button", { name: "Reset demo" }).click();
  await expect(page.locator("#metric-copies")).toHaveText("3");
  expect(await page.evaluate(() => Object.keys(localStorage).sort())).toEqual(["demo:log-duplicate-lens:active", "real:operator-setting"]);
  await page.getByRole("button", { name: "Start for real" }).click();
  await expect(page).toHaveURL(/\/$/);
  expect(await page.evaluate(() => Object.fromEntries(Object.entries(localStorage)))).toEqual({ "real:operator-setting": "keep" });
});

test("@claim:demo-mobile-result a sample click keeps the sandbox notice and result in a 390px viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("link", { name: "Try it with sample data" }).click();
  await expect(page).toHaveURL(/\/demo$/);
  const banner = page.getByLabel("Demo controls");
  const result = page.getByRole("heading", { name: "2 suspected duplicate groups" });
  await expect(banner).toBeVisible();
  await expect(result).toBeVisible();
  await expect(result).toBeFocused();
  for (const locator of [banner, result]) {
    await expect.poll(async () => {
      const box = await locator.boundingBox();
      return Boolean(box && box.y >= 0 && box.y + box.height <= 844);
    }).toBe(true);
  }
});

test("@claim:browser-sample-action Show sample result analyzes the sample immediately", async ({ page }) => {
  await page.goto("/");
  const action = page.getByRole("button", { name: "Show sample result" });
  await expect(action).toBeVisible();
  await action.click();
  await expect(page.locator("#readout-state")).toHaveText("Evidence found");
  await expect(page.locator("#metric-copies")).toHaveText("3");
  await expect(page.getByRole("heading", { name: "2 suspected duplicate groups" })).toBeVisible();
});

test("@claim:demo-private demo sends no off-origin requests", async ({ page }) => {
  const offOrigin: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== "http://127.0.0.1:4173") offOrigin.push(request.url());
  });
  await page.goto("/demo");
  await expect(page.locator("#metric-copies")).toHaveText("3");
  expect(offOrigin).toEqual([]);
});

test("@claim:json-export demo exports its observed report", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.locator("#metric-copies")).toHaveText("3");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export JSON evidence" }).click();
  const contents = await (await download).createReadStream();
  let text = "";
  for await (const chunk of contents!) text += chunk.toString();
  expect(JSON.parse(text)).toMatchObject({ suspectedGroups: 2, duplicateCopies: 3 });
});

test("@claim:browser-limit browser rejects a file above 5 MB", async ({ page }) => {
  await page.goto("/");
  await page.locator("#file-input").setInputFiles({
    name: "large.jsonl",
    mimeType: "application/x-ndjson",
    buffer: Buffer.alloc(5 * 1024 * 1024 + 1, 65)
  });
  await expect(page.locator("#input-error")).toContainText("larger than the 5 MB browser limit");
});

test("@claim:offline-demo demo analyzes after its first visit while offline", async ({ page, context }) => {
  await page.goto("/demo");
  await expect(page.locator("#metric-copies")).toHaveText("3");
  await context.setOffline(true);
  await page.getByRole("button", { name: "Reset demo" }).click();
  await expect(page.locator("#network-label")).toContainText("Offline");
  await expect(page.locator("#metric-copies")).toHaveText("3");
});

test("@claim:browser-local-processing pasted and selected samples produce a report without an off-origin request", async ({ page }) => {
  const offOrigin: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== "http://127.0.0.1:4173") offOrigin.push(request.url());
  });
  const events = [
    { ts: "2026-08-28T02:14:06.000Z", msg: "payment retry id=12345", stream: { shard: "a" } },
    { ts: "2026-08-28T02:14:06.200Z", msg: "payment retry id=67890", stream: { shard: "b" } }
  ];
  const jsonl = events.map((event) => JSON.stringify(event)).join("\n");
  await page.goto("/demo");
  await page.locator("#log-input").fill(jsonl);
  await page.getByRole("button", { name: "Analyze this sample" }).click();
  await expect(page.locator("#metric-copies")).toHaveText("1");
  await page.locator("#file-input").setInputFiles({ name: "local.jsonl", mimeType: "application/x-ndjson", buffer: Buffer.from(jsonl) });
  await page.getByRole("button", { name: "Analyze this sample" }).click();
  await expect(page.locator("#metric-copies")).toHaveText("1");
  expect(offOrigin).toEqual([]);
});

test("@claim:browser-input-formats browser accepts JSON lines, a Loki response, and plain lines", async ({ page }) => {
  const jsonl = [
    { ts: 1_700_000_000_000, msg: "cache retry 12345", stream: { shard: "a" } },
    { ts: 1_700_000_000_100, msg: "cache retry 67890", stream: { shard: "b" } }
  ].map((event) => JSON.stringify(event)).join("\n");
  const loki = JSON.stringify({ data: { result: [
    { stream: { shard: "a" }, values: [["1700000000000000000", "cache retry 12345"]] },
    { stream: { shard: "b" }, values: [["1700000000100000000", "cache retry 67890"]] }
  ] } });
  await page.goto("/demo");
  for (const [value, copies] of [[jsonl, "1"], [loki, "1"], ["one plain line\ntwo plain line", "0"]] as const) {
    await page.locator("#log-input").fill(value);
    await page.getByRole("button", { name: "Analyze this sample" }).click();
    await expect(page.locator("#readout-state")).not.toHaveText("Input error");
    await expect(page.locator("#metric-copies")).toHaveText(copies);
  }
});

test("@claim:browser-normalization browser ignores changing request IDs when matching messages", async ({ page }) => {
  const jsonl = [
    { ts: 1_700_000_000_000, msg: "checkout timed out request=12345", stream: { app: "checkout", shard: "a" } },
    { ts: 1_700_000_000_200, msg: "checkout timed out request=67890", stream: { app: "checkout", shard: "b" } }
  ].map((event) => JSON.stringify(event)).join("\n");
  await page.goto("/");
  await page.locator("#log-input").fill(jsonl);
  await page.getByRole("button", { name: "Analyze this sample" }).click();
  await expect(page.getByRole("heading", { name: "1 suspected duplicate group" })).toBeVisible();
  await expect(page.locator("#metric-copies")).toHaveText("1");
});

test("@claim:browser-label-evidence browser lists labels that differ between matched streams", async ({ page }) => {
  const jsonl = [
    { ts: 1_700_000_000_000, msg: "checkout timed out request=12345", stream: { app: "checkout", shard: "original" } },
    { ts: 1_700_000_000_200, msg: "checkout timed out request=67890", stream: { app: "checkout", shard: "auto-3" } }
  ].map((event) => JSON.stringify(event)).join("\n");
  await page.goto("/");
  await page.locator("#log-input").fill(jsonl);
  await page.getByRole("button", { name: "Analyze this sample" }).click();
  await expect(page.locator("#evidence")).toContainText("varying shard");
});

test("@claim:cli-demo-recording local recording and text fallback show the real CLI demo result", async ({ page }) => {
  await page.goto("/");
  const recording = page.getByRole("img", { name: /Terminal recording of log-duplicate-lens demo/ });
  await expect(recording).toHaveAttribute("src", "/cli-demo.svg");
  await expect(page.getByText("Captured from the real CLI demo using the bundled seven-record sample.")).toBeVisible();
  await page.getByText("Read recording transcript").click();
  await expect(page.locator(".cli-recording details")).toContainText("log-duplicate-lens demo");
  await expect(page.locator(".cli-recording details")).toContainText("2 suspected duplicate groups / 3 duplicate copies");
  const asset = await page.request.get("/cli-demo.svg");
  expect(asset.status()).toBe(200);
  const svg = await asset.text();
  expect(svg).toContain("cargo run --quiet -p log-duplicate-lens -- demo");
  expect(svg).toContain("Result: 2 suspected duplicate groups / 3 duplicate copies");
});

test("@claim:site-privacy site loads without third-party requests or persistent browser storage", async ({ page }) => {
  const offOrigin: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== "http://127.0.0.1:4173") offOrigin.push(request.url());
  });
  await page.goto("/");
  expect(offOrigin).toEqual([]);
  expect(await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage), cookie: document.cookie }))).toEqual({ local: [], session: [], cookie: "" });
});

test("explains malformed input and restores focus", async ({ page }) => {
  await page.goto("/");
  await page.locator("#log-input").fill("{not-json");
  await page.getByRole("button", { name: "Analyze this sample" }).click();
  await expect(page.locator("#input-error")).toContainText("Line 1 is not valid JSON");
  await expect(page.locator("#log-input")).toBeFocused();
});

test("all routes have one h1, one main, and no serious accessibility violations", async ({ page }) => {
  for (const path of ["/", "/demo", "/privacy/", "/terms/", "/404/"]) {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("main")).toHaveCount(1);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? "")), path).toEqual([]);
  }
});

test("demo evidence pane remains keyboard-accessible", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.locator("#evidence")).toBeVisible();
  await expect(page.locator("#evidence")).toHaveAttribute("tabindex", "0");
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
});

test("fits a 390px viewport with Demo and Privacy navigation", async ({ page }) => {
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await expect(page.getByRole("link", { name: "Demo" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Privacy" }).first()).toBeVisible();
});

test("uses Retry window and Copy install command consistently", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Set a retry window")).toBeVisible();
  await expect(page.getByRole("group", { name: "Retry window" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Copy install command" })).toBeVisible();
});

test("ships local touch and social assets with their declared dimensions", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute("href", "/apple-touch-icon.png");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /social-card\.png$/);
  const touch = await page.request.get("/apple-touch-icon.png");
  const social = await page.request.get("/social-card.png");
  expect(touch.status()).toBe(200); expect(social.status()).toBe(200);
  const pngSize = (body: Buffer) => [body.readUInt32BE(16), body.readUInt32BE(20)];
  expect(pngSize(Buffer.from(await touch.body()))).toEqual([180, 180]);
  expect(pngSize(Buffer.from(await social.body()))).toEqual([1200, 630]);
});

test("routes expose separate titles and a designed not-found page", async ({ page }) => {
  const demoResponse = await page.request.get("/demo/index.html");
  const demoSource = await demoResponse.text();
  expect(demoSource).toContain("<title>Demo — Log Duplicate Lens</title>");
  expect(demoSource).toContain('content="Try a local sample that shows duplicate Loki logs across streams."');
  await page.goto("/");
  await page.getByRole("link", { name: "Demo" }).first().click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://log-duplicate-lens.sociobot.in/demo");
  await expect(page.locator("#route-announcer")).toHaveText("Demo — Log Duplicate Lens");
  await expect(page.getByRole("heading", { name: "2 suspected duplicate groups" })).toBeFocused();
  await page.goBack();
  await expect(page).toHaveTitle("Log Duplicate Lens — find duplicate Loki logs");
  await expect(page.locator("#route-announcer")).toHaveText("Log Duplicate Lens — find duplicate Loki logs");
  await expect(page.getByRole("heading", { name: "Find duplicate Loki logs across streams" })).toBeFocused();
  await page.goto("/privacy/");
  await expect(page).toHaveTitle("Privacy — Log Duplicate Lens");
  await expect(page.getByRole("link", { name: "Terms" }).first()).toHaveAttribute("href", "/terms/");
  await page.goto("/terms/");
  await expect(page).toHaveTitle("Terms — Log Duplicate Lens");
  await expect(page.getByRole("link", { name: "Privacy" }).first()).toHaveAttribute("href", "/privacy/");
  await page.goto("/404/");
  await expect(page).toHaveTitle("Page not found — Log Duplicate Lens");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://log-duplicate-lens.sociobot.in/404/");
  await expect(page.getByRole("heading", { name: "This instrument page is not here" })).toBeVisible();
});

test("service worker uses a fresh online shell and retains an offline fallback", async ({ page, context }) => {
  await page.goto("/");
  await page.waitForFunction(() => "serviceWorker" in navigator);
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  try { await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), undefined, { timeout: 5_000 }); }
  catch { await page.reload(); await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller)); }
  await page.evaluate(async () => {
    const name = (await caches.keys()).find((key) => key.startsWith("log-duplicate-lens-"));
    if (!name) throw new Error("Expected app cache");
    await (await caches.open(name)).put("/", new Response("<title>STALE-CACHE-PROOF</title>"));
  });
  await page.reload();
  await expect(page).toHaveTitle(/Log Duplicate Lens/);
  await expect(page.locator("body")).not.toContainText("STALE-CACHE-PROOF");
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { name: /Find duplicate Loki logs/ })).toBeVisible();
});

test("mobile controls meet touch targets and reduced motion removes animation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/demo");
  await expect(page.locator("#metric-copies")).toHaveText("3");
  for (const control of [
    page.getByRole("button", { name: "Reset demo" }),
    page.getByRole("button", { name: "Start for real" }),
    page.getByRole("button", { name: "Export JSON evidence" })
  ]) {
    const box = await control.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
  const reducedDuration = await page.locator(".trace").first().evaluate((element) => Number.parseFloat(getComputedStyle(element).animationDuration));
  expect(reducedDuration).toBeLessThanOrEqual(0.00001);
});

test("keyboard operates sample and demo controls without a trap", async ({ page }) => {
  await page.goto("/");
  const action = page.getByRole("button", { name: "Show sample result" });
  await action.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#metric-copies")).toHaveText("3");
  await page.goto("/demo");
  const reset = page.getByRole("button", { name: "Reset demo" });
  await reset.focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("heading", { name: "2 suspected duplicate groups" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Export JSON evidence" })).toBeFocused();
});
