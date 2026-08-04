import { test, expect } from '@playwright/test';

test('progress fill width matches value', async ({ page }) => {
  await page.goto('/progress');
  const bar = page.locator('solaris-progress[data-size="lg"]').first();
  await expect(bar).toBeVisible();
  const fill = bar.locator('.solaris-progress__fill');
  const width = await fill.evaluate((el) => getComputedStyle(el).width);
  expect(parseFloat(width)).toBeGreaterThan(0);
});

test('progress thickness varies by size', async ({ page }) => {
  await page.goto('/progress');
  const section = page.locator('.progress-showcase__section').first();
  const sizes = ['sm', 'md', 'lg'];
  const heights = new Set<number>();
  for (const size of sizes) {
    const bar = section.locator(`solaris-progress[data-size="${size}"]`);
    await expect(bar).toBeVisible();
    const height = await bar
      .locator('.solaris-progress__track')
      .evaluate((el) => parseFloat(getComputedStyle(el).height) || 0);
    heights.add(height);
  }
  expect(heights.size).toBeGreaterThan(1);
});

test('indeterminate progress renders sliding fill', async ({ page }) => {
  await page.goto('/progress');
  const bar = page.locator('solaris-progress[data-indeterminate]').first();
  await expect(bar).toBeVisible();
  const fill = bar.locator('.solaris-progress__fill');
  await expect(fill).toHaveClass(/indeterminate/);
  expect(
    await bar.evaluate((el) => el.getAttribute('aria-valuenow')),
  ).toBeNull();
});

test('percent text renders when enabled', async ({ page }) => {
  await page.goto('/progress');
  const percent = page.locator('.solaris-progress__percent').first();
  await expect(percent).toBeVisible();
});

test('determinate progress animates from 0 to 100', async ({ page }) => {
  await page.goto('/progress');
  const bar = page
    .locator('solaris-progress', { hasText: 'Downloading' })
    .first();
  await expect(bar).toBeVisible();
  const fill = bar.locator('.solaris-progress__fill');

  const valueAtStart = await bar.evaluate((el) =>
    el.getAttribute('aria-valuenow'),
  );
  expect(valueAtStart).toBe('0');

  await page.getByRole('button', { name: 'Play' }).click();

  await expect
    .poll(
      async () => await bar.evaluate((el) => el.getAttribute('aria-valuenow')),
      { timeout: 5000 },
    )
    .toBe('100');
  await expect(bar.locator('.solaris-progress__percent')).toHaveText('100%');
});
