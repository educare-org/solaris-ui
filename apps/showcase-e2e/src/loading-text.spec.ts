import { test, expect } from '@playwright/test';

test('loading text renders default caption', async ({ page }) => {
  await page.goto('/loading-text');
  const text = page.locator('solaris-loading-text').first();
  await expect(text).toBeVisible();
  await expect(text).toContainText('Loading...');
});

test('loading text renders visible custom text', async ({ page }) => {
  await page.goto('/loading-text');
  const text = page.getByText('Uploading your document...');
  await expect(text).toBeVisible();
});

test('loading text exposes accessible name', async ({ page }) => {
  await page.goto('/loading-text');
  const text = page.locator('solaris-loading-text').first();
  await expect(text).toHaveAttribute('role', 'status');
  await expect(text).toHaveAttribute('aria-live', 'polite');
});

test('loading text font size varies by size', async ({ page }) => {
  await page.goto('/loading-text');
  const section = page.locator('.loading-text-showcase__section').nth(1);

  const sizes = ['sm', 'md', 'lg', 'xl'];
  const fontSizes = new Set<string>();

  for (const attr of sizes) {
    const el = section.locator(`solaris-loading-text[data-size="${attr}"]`);
    await expect(el).toBeVisible();
    const fs = await el.evaluate(
      (node) => getComputedStyle(node as HTMLElement).fontSize,
    );
    fontSizes.add(fs);
  }

  expect(fontSizes.size).toBeGreaterThan(1);
});

test('loading text shimmer animation is present', async ({ page }) => {
  await page.goto('/loading-text');
  const text = page.locator('.solaris-loading-text__text').first();
  await expect(text).toBeVisible();
  const anim = await text.evaluate(
    (el) => getComputedStyle(el as HTMLElement, '::after').animationName,
  );
  expect(anim.toLowerCase()).toContain('solaris-loading-text-shimmer');
});

test('loading text base color is always visible', async ({ page }) => {
  await page.goto('/loading-text');
  const text = page.locator('.solaris-loading-text__text').first();
  await expect(text).toBeVisible();
  const color = await text.evaluate(
    (el) => getComputedStyle(el as HTMLElement).color,
  );
  expect(color).toBeTruthy();
});
