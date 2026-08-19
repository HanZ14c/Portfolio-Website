import { expect, test } from "@playwright/test";

test("home exposes navigation, featured work and an accessible main landmark", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Han Zhang/);
  await expect(page.getByRole("main")).toHaveAttribute("id", "main-content");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "A portfolio of code, space, and visual studies.",
  );
  await expect(page.getByRole("link", { name: "View Feeling in Form" })).toBeVisible();

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
});

test("work filters and sorts projects without losing the current result summary", async ({ page }) => {
  await page.goto("/work");
  await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
  await expect(page.locator(".filter-summary")).toContainText("Showing 16 projects");
  await expect(page.getByText("Chongqing Tianan Cyber Park T3")).toHaveCount(0);
  await expect(page.getByText("Dongguan Songshanhu Office Tower")).toHaveCount(0);

  await page.getByRole("button", { name: /Visual Studies/ }).click();
  await expect(page.locator(".filter-summary")).toContainText("Showing 3 projects");
  await expect(page.getByRole("link", { name: "View Bungalow" })).toBeVisible();
  await expect(page.getByRole("link", { name: "View Team Workflow Scheduler" })).toHaveCount(0);

  await page.getByRole("button", { name: /^All/ }).click();
  await page.getByLabel("Sort projects").selectOption("time");
  await expect(page.getByText(/Sorted by end time/i)).toBeVisible();
  await expect(page.locator(".project-group__heading h2").first()).toHaveText("2026");
});

test("computer science narratives stay hidden while architecture narratives remain", async ({ page }) => {
  await page.goto("/work/team-workflow-scheduler");
  await expect(page.locator(".project-sections")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Related work" })).toBeVisible();

  await page.goto("/work/qianhai-shimao-centre");
  await expect(page.locator(".project-sections")).toBeVisible();
});

test("project pages expose sequential previous and next navigation", async ({ page }) => {
  await page.goto("/work/feeling-in-form");

  const navigation = page.getByRole("navigation", { name: "Browse adjacent projects" });
  await expect(navigation).toBeVisible();
  await expect(navigation.locator("a.is-previous")).toHaveAttribute("href", "/work/vertical-city-housing");
  await expect(navigation.locator("a.is-next")).toHaveAttribute("href", "/work/mirriedge-opera-house");
  await expect(navigation).toContainText("07 / 16");

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test("header state and résumé actions follow the current page", async ({ page }) => {
  const resumeResponse = await page.request.get("/Han-Zhang-Resume.pdf");
  expect(resumeResponse.ok()).toBe(true);
  expect(resumeResponse.headers()["content-type"]).toContain("application/pdf");

  await page.goto("/work/feeling-in-form");
  await expect(page.locator(".desktop-nav a[href='/work']")).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".desktop-nav a[href='/Han-Zhang-Resume.pdf']")).toHaveAttribute(
    "target",
    "_blank",
  );

  await page.goto("/about");
  await expect(page.locator(".desktop-nav a[href='/about']")).toHaveAttribute("aria-current", "page");
  await expect(page.getByText("Working approach")).toHaveCount(0);
  await expect(page.locator(".about-links a[href='/Han-Zhang-Resume.pdf']")).toHaveAttribute("download", "");
});

test("portfolio guide answers a suggested question and links to relevant work", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Ask about Han's work" }).click();

  const guide = page.getByRole("dialog", { name: "Portfolio guide" });
  await expect(guide).toBeVisible();
  await guide.getByRole("button", { name: "Show projects involving Java or databases" }).click();
  await expect(guide.getByText(/Java-related projects/i)).toBeVisible();
  await expect(guide.getByRole("link", { name: /Team Workflow Scheduler/ })).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  expect(hasHorizontalOverflow).toBe(false);

  await page.keyboard.press("Escape");
  await expect(guide).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Ask about Han's work" })).toBeFocused();
});

test("mobile navigation opens and core pages do not overflow horizontally", async ({ page }) => {
  await page.goto("/");

  if ((page.viewportSize()?.width ?? 0) <= 640) {
    const guideLauncher = page.getByRole("button", { name: "Ask about Han's work" });
    await expect(page.locator(".portfolio-guide__launcher-label")).toBeHidden();
    const launcherBox = await guideLauncher.boundingBox();
    expect(launcherBox?.width).toBeLessThanOrEqual(46);
    expect(launcherBox?.height).toBeLessThanOrEqual(46);
  }

  const menu = page.getByText("Menu", { exact: true });
  if (await menu.isVisible()) {
    await menu.click();
    await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
  }

  for (const path of ["/", "/work", "/about", "/work/feeling-in-form"]) {
    await page.goto(path);
    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(hasHorizontalOverflow, `${path} should fit the viewport`).toBe(false);
  }
});
