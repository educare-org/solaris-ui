import { test, expect } from '@playwright/test';

test('progress fill width matches value', async ({ page }) => {
  await page.goto('/feedback/loading/progress');
  const bar = page.locator('#examples solaris-progress').first();
  await expect(bar).toBeVisible();
  const fill = bar.locator('.solaris-progress__fill');
  const width = await fill.evaluate((el) => getComputedStyle(el).width);
  expect(parseFloat(width)).toBeGreaterThan(0);
});

test('progress thickness varies by size', async ({ page }) => {
  await page.goto('/feedback/loading/progress');
  const section = page.locator('#size-density');
  const bar = section.locator('solaris-progress').first();
  await expect(bar).toBeVisible();
  const heights = new Set<number>();
  for (const size of ['Small', 'Medium', 'Large']) {
    await section.getByRole('tab', { name: size }).click();
    const height = await bar
      .locator('.solaris-progress__track')
      .evaluate((el) => parseFloat(getComputedStyle(el).height) || 0);
    heights.add(height);
  }
  expect(heights.size).toBeGreaterThan(1);
});

test('status tints the bar', async ({ page }) => {
  await page.goto('/feedback/loading/progress');
  const section = page.locator('#status');
  await section.getByRole('tab', { name: 'Exception' }).click();
  const bar = section.locator(
    'solaris-progress[data-status="exception"]:visible',
  );
  await expect(bar).toBeVisible();
  const color = await bar
    .locator('.solaris-progress__fill')
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(color).toBeTruthy();
});

test('buffer renders behind the fill', async ({ page }) => {
  await page.goto('/feedback/loading/progress');
  const bar = page.locator('#buffer solaris-progress');
  await expect(bar).toBeVisible();
  await expect(bar.locator('.solaris-progress__buffer')).toBeVisible();
});

test('indeterminate progress renders sliding fill', async ({ page }) => {
  await page.goto('/feedback/loading/progress');
  const bar = page.locator('solaris-progress[data-indeterminate]').first();
  await expect(bar).toBeVisible();
  const fill = bar.locator('.solaris-progress__fill');
  await expect(fill).toHaveClass(/indeterminate/);
  expect(
    await bar.evaluate((el) => el.getAttribute('aria-valuenow')),
  ).toBeNull();
});

test('percent text renders when enabled', async ({ page }) => {
  await page.goto('/feedback/loading/progress');
  const percent = page.locator('.solaris-progress__percent').first();
  await expect(percent).toBeVisible();
});

test('determinate progress animates from 0 to 100', async ({ page }) => {
  await page.goto('/feedback/loading/progress');
  const bar = page
    .locator('solaris-progress', { hasText: 'Downloading' })
    .first();
  await expect(bar).toBeVisible();

  const valueAtStart = await bar.evaluate((el) =>
    el.getAttribute('aria-valuenow'),
  );
  expect(valueAtStart).toBe('0');

  await page.locator('#animated').getByRole('button', { name: 'Play' }).click();

  await expect
    .poll(
      async () => await bar.evaluate((el) => el.getAttribute('aria-valuenow')),
      { timeout: 5000 },
    )
    .toBe('100');
  await expect(bar.locator('.solaris-progress__percent')).toHaveText('100%');
});
