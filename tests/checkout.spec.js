// checkout-guard — Playwright suite.
// Role-based selectors only; assertions on the money.
const { test, expect } = require("@playwright/test");
const path = require("path");

const PAGE = "file://" + path.resolve(__dirname, "..", "checkout.html");

test.beforeEach(async ({ page }) => {
  await page.goto(PAGE);
});

test("initial totals are correct", async ({ page }) => {
  // 45.00 + 2x22.00 + 38.00 = 127.00
  await expect(page.locator("#subtotal")).toHaveText("$127.00");
  await expect(page.locator("#total")).toHaveText("$127.00");
});

test("increasing quantity updates line and grand totals", async ({ page }) => {
  await page.getByRole("button", { name: "Increase Studio Tee quantity" }).click();
  await expect(page.locator("#subtotal")).toHaveText("$172.00");
});

test("quantity cannot go below 1", async ({ page }) => {
  const dec = page.getByRole("button", { name: "Decrease Studio Tee quantity" });
  await dec.click();
  await dec.click();
  await expect(page.getByLabel("Studio Tee quantity")).toHaveText("1");
});

test("valid promo code applies a 10% discount", async ({ page }) => {
  await page.getByPlaceholder("Promo code").fill("SAVE10");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.locator("#discount")).toHaveText("−$12.70");
  await expect(page.locator("#total")).toHaveText("$114.30");
});

test("invalid promo code shows an error and no discount", async ({ page }) => {
  await page.getByPlaceholder("Promo code").fill("FREESTUFF");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.locator("#promo-msg")).toHaveText("That code isn't valid.");
  await expect(page.locator("#total")).toHaveText("$127.00");
});

test("removing all items shows the empty cart state", async ({ page }) => {
  for (let i = 0; i < 3; i++) {
    await page.getByRole("button", { name: "Remove" }).first().click();
  }
  await expect(page.locator("#empty")).toBeVisible();
  await expect(page.locator("#total")).toHaveText("$0.00");
});

// DELIBERATELY FAILING — this is the good first issue.
// Promo codes should arguably be case-insensitive; the page currently rejects "save10".
// Decide the spec, then either fix the page or fix this test's expectation.
test("promo codes are case-insensitive", async ({ page }) => {
  await page.getByPlaceholder("Promo code").fill("save10");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.locator("#total")).toHaveText("$114.30");
});
