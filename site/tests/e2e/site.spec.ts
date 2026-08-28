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

test("legal pages are present", async ({ page }) => {
  await page.goto("/privacy/");
  await expect(page.getByRole("heading", { level: 1, name: "Privacy" })).toBeVisible();
  await page.goto("/terms/");
  await expect(page.getByRole("heading", { level: 1, name: "Terms" })).toBeVisible();
});
