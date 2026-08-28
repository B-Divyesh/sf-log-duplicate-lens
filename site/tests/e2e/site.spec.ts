import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("runs the local sample and exposes evidence", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Log Duplicate Lens/);
  await expect(page.locator("#empty-readout")).toBeVisible();
  await expect(page.locator("#metrics")).toBeHidden();
  await page.getByRole("button", { name: "Load labeled sample" }).click();
  await page.getByRole("button", { name: "Analyze locally" }).click();
  await expect(page.locator("#readout-state")).toHaveText("Evidence found");
  await expect(page.locator("#metric-copies")).toHaveText("3");
  await expect(page.getByRole("heading", { name: "2 suspected amplification groups" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Export JSON evidence" })).toBeEnabled();
});

test("explains malformed input and retains keyboard focus path", async ({ page }) => {
  await page.goto("/#workbench");
  await page.locator("#log-input").fill("{not-json");
  await page.getByRole("button", { name: "Analyze locally" }).click();
  await expect(page.locator("#input-error")).toContainText("Line 1 is not valid JSON");
  await expect(page.locator("#log-input")).toBeFocused();
});

test("has no serious accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("main")).toHaveCount(1);
});

test("fits the 390px mobile viewport and reports offline mode", async ({ page, context }) => {
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await context.setOffline(true);
  await expect(page.locator("#network-label")).toContainText("Offline");
  await page.getByRole("button", { name: "Load labeled sample" }).click();
  await page.getByRole("button", { name: "Analyze locally" }).click();
  await expect(page.locator("#metric-copies")).toHaveText("3");
});

test("service worker uses the fresh online shell and retains an offline fallback", async ({ page, context }) => {
  await page.goto("/");
  await page.waitForFunction(() => "serviceWorker" in navigator);
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  try {
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), undefined, { timeout: 5_000 });
  } catch {
    await page.reload();
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  }

  await page.evaluate(async () => {
    const cacheName = (await caches.keys()).find((name) => name.startsWith("log-duplicate-lens-"));
    if (!cacheName) throw new Error("Expected the versioned application cache");
    const cache = await caches.open(cacheName);
    await cache.put("/", new Response("<!doctype html><title>STALE-CACHE-PROOF</title><p>STALE-CACHE-PROOF</p>", {
      headers: { "content-type": "text/html" }
    }));
  });

  await page.reload();
  await expect(page).toHaveTitle(/Log Duplicate Lens/);
  await expect(page.locator("body")).not.toContainText("STALE-CACHE-PROOF");

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1, name: /Find the copies/ })).toBeVisible();
  await context.setOffline(false);
});

test("legal pages are present", async ({ page }) => {
  await page.goto("/privacy/");
  await expect(page.getByRole("heading", { level: 1, name: "Privacy" })).toBeVisible();
  await page.goto("/terms/");
  await expect(page.getByRole("heading", { level: 1, name: "Terms" })).toBeVisible();
});
