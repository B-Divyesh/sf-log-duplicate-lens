import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("@claim:sample-analysis demo immediately shows the bundled duplicate result", async ({ page }) => {
  await page.goto("/demo");
  await expect(page).toHaveTitle("Demo — Log Duplicate Lens");
  await expect(page.getByLabel("Demo controls")).toContainText("sample data, nothing is saved");
  await expect(page.locator("#readout-state")).toHaveText("Evidence found");
  await expect(page.locator("#metric-copies")).toHaveText("3");
  await expect(page.getByRole("heading", { name: "2 suspected duplicate groups" })).toBeVisible();
});

test("@claim:demo-isolation demo stores no normal application data and reset keeps its result", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.locator("#metric-copies")).toHaveText("3");
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys).toEqual(["demo:log-duplicate-lens:active"]);
  await page.getByRole("button", { name: "Reset demo" }).click();
  await expect(page.locator("#metric-copies")).toHaveText("3");
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual(["demo:log-duplicate-lens:active"]);
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

test("explains malformed input and restores focus", async ({ page }) => {
  await page.goto("/");
  await page.locator("#log-input").fill("{not-json");
  await page.getByRole("button", { name: "Analyze this sample" }).click();
  await expect(page.locator("#input-error")).toContainText("Line 1 is not valid JSON");
  await expect(page.locator("#log-input")).toBeFocused();
});

test("has no serious accessibility violations and one h1", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("main")).toHaveCount(1);
});

test("fits a 390px viewport with Demo and Privacy navigation", async ({ page }) => {
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await expect(page.getByRole("link", { name: "Demo" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Privacy" }).first()).toBeVisible();
});

test("routes expose separate titles and a designed not-found page", async ({ page }) => {
  await page.goto("/privacy/");
  await expect(page).toHaveTitle("Privacy — Log Duplicate Lens");
  await page.goto("/terms/");
  await expect(page).toHaveTitle("Terms — Log Duplicate Lens");
  await page.goto("/404/");
  await expect(page).toHaveTitle("Page not found — Log Duplicate Lens");
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
