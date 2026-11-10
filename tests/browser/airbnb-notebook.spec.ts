import { expect, test } from "@playwright/test";

test("Airbnb embeds the complete notebook and fits its content", async ({ page }) => {
  await page.goto("/work/airbnb-ml");
  const frame = page.locator('iframe[title^="Airbnb Review Activity"]');
  const notebook = page.frameLocator('iframe[title^="Airbnb Review Activity"]');
  await expect(notebook.getByRole("heading", { name: "Airbnb Review Activity Prediction" })).toBeVisible();
  await expect(notebook.getByRole("heading", { name: "13. Results summary" })).toHaveCount(1);
  await expect(page.locator(".project-gallery")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Github Repository/ })).toBeVisible();
  await expect.poll(() => frame.evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThan(10000);
  const metrics = await notebook.locator("body").evaluate((body) => ({
    content: body.getBoundingClientRect().height,
    viewport: window.innerHeight,
    images: [...body.querySelectorAll("img")].every((image) => image.complete && image.naturalWidth > 0),
  }));
  expect(Math.abs(metrics.content - metrics.viewport)).toBeLessThan(2);
  expect(metrics.images).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
