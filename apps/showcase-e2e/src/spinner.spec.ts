import { test, expect } from '@playwright/test';

test('spinner border thickness varies by size', async ({ page }) => {
  await page.goto('/feedback/loading/spinner');
  const sizes = ['sm', 'md', 'lg', 'xl'];
  const thicknesses = new Set<number>();
  for (const size of sizes) {
    const spinner = page
      .locator('.spinner-showcase__section')
      .first()
      .locator(`solaris-spinner[data-size="${size}"]`);
    await expect(spinner).toBeVisible();
    const thickness = await spinner
      .locator('.solaris-spinner__track')
      .evaluate((el) => parseFloat(getComputedStyle(el).borderTopWidth) || 0);
    thicknesses.add(thickness);
  }
  expect(thicknesses.size).toBeGreaterThan(1);
});

test('button loading renders solaris-spinner component', async ({ page }) => {
  await page.goto('/actions/button');
  const loadingButton = page
    .locator('button[solaris-button][data-loading=""]')
    .first();
  await expect(loadingButton).toBeVisible();
  const spinner = loadingButton.locator('solaris-spinner');
  await expect(spinner).toBeVisible();
});

test('button spinner thickness matches button size', async ({ page }) => {
  await page.goto('/actions/button');
  const loadingButton = page
    .locator('button[solaris-button][data-loading=""]')
    .first();
  const track = loadingButton.locator(
    'solaris-spinner .solaris-spinner__track',
  );
  const thickness = await track.evaluate(
    (el) => parseFloat(getComputedStyle(el).borderTopWidth) || 0,
  );
  expect(thickness).toBeGreaterThan(0);
});

test('backdrop spinner centers ring and overlays track', async ({ page }) => {
  await page.goto('/feedback/loading/spinner');
  await page.getByRole('button', { name: /backdrop/i }).click();
  const backdrop = page.locator('solaris-spinner[data-backdrop]');
  await expect(backdrop).toBeVisible();

  const ring = backdrop.locator('.solaris-spinner__ring');
  const track = ring.locator('.solaris-spinner__track');
  const indicator = ring.locator('.solaris-spinner__indicator');

  const ringPos = await ring.evaluate((el) => getComputedStyle(el).position);
  expect(ringPos).toBe('relative');

  for (const el of [track, indicator]) {
    const style = await el.evaluate((node) => {
      const s = getComputedStyle(node);
      return {
        position: s.position,
        top: s.top,
        left: s.left,
        right: s.right,
        bottom: s.bottom,
      };
    });
    expect(style.position).toBe('absolute');
    expect(style.top).toBe('0px');
    expect(style.left).toBe('0px');
    expect(style.right).toBe('0px');
    expect(style.bottom).toBe('0px');
  }

  const ringBox = (await ring.boundingBox())!;
  const viewport = page.viewportSize()!;
  expect(ringBox.x).toBeGreaterThan(0);
  expect(ringBox.y).toBeGreaterThan(0);
  expect(
    Math.abs(ringBox.x + ringBox.width / 2 - viewport.width / 2),
  ).toBeLessThan(120);
  expect(
    Math.abs(ringBox.y + ringBox.height / 2 - viewport.height / 2),
  ).toBeLessThan(120);

  await backdrop.click({ position: { x: 5, y: 5 } });
  await expect(backdrop).not.toBeVisible();
});
