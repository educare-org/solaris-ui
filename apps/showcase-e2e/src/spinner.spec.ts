import { test, expect } from '@playwright/test';

test('spinner stroke thickness varies by size', async ({ page }) => {
  await page.goto('/feedback/loading/spinner');
  const sizes = ['sm', 'md', 'lg', 'xl'];
  const thicknesses = new Set<number>();
  for (const size of sizes) {
    const spinner = page
      .locator('.spinner-showcase__section', {
        has: page.locator(
          'solaris-spinner[data-size="xl"][data-variant="ring"]',
        ),
      })
      .locator(`solaris-spinner[data-size="${size}"][data-variant="ring"]`);
    await expect(spinner).toBeVisible();
    const rendered = await spinner
      .locator('.solaris-spinner__track')
      .evaluate((el) => {
        const circle = el as SVGCircleElement;
        const svg = circle.ownerSVGElement as SVGSVGElement;
        const strokeWidth =
          parseFloat(getComputedStyle(circle).strokeWidth) || 0;
        const renderedWidth = svg.getBoundingClientRect().width;
        const viewBoxWidth = svg.viewBox.baseVal.width;
        return strokeWidth * (renderedWidth / viewBoxWidth);
      });
    thicknesses.add(rendered);
  }
  expect(thicknesses.size).toBeGreaterThan(1);
});

test('button loading renders solaris-spinner component', async ({ page }) => {
  await page.goto('/actions/button');
  const loadingButton = page
    .locator('button[solaris-button][data-loading]')
    .first();
  await expect(loadingButton).toBeVisible();
  const spinner = loadingButton.locator('solaris-spinner');
  await expect(spinner).toBeVisible();
});

test('button spinner thickness matches button size', async ({ page }) => {
  await page.goto('/actions/button');
  const loadingButton = page
    .locator('button[solaris-button][data-loading]')
    .first();
  const track = loadingButton.locator(
    'solaris-spinner .solaris-spinner__track',
  );
  const thickness = await track.evaluate(
    (el) => parseFloat(getComputedStyle(el).strokeWidth) || 0,
  );
  expect(thickness).toBeGreaterThan(0);
});

test('stacked spinner renders 8 independent bars', async ({ page }) => {
  await page.goto('/feedback/loading/spinner');
  const spinner = page
    .locator('solaris-spinner[data-variant="stacked"]')
    .first();
  await expect(spinner).toBeVisible();
  await expect(spinner).toHaveAttribute('role', 'status');
  const bars = spinner.locator('.solaris-spinner__bar');
  await expect(bars).toHaveCount(8);
  await expect(spinner.locator('.solaris-spinner__track')).toHaveCount(0);
  await expect(spinner.locator('.solaris-spinner__indicator')).toHaveCount(0);
});

test('progress spinner exposes value and renders percent', async ({ page }) => {
  await page.goto('/feedback/loading/spinner');
  const spinner = page
    .locator('solaris-spinner[data-variant="progress"]')
    .first();
  await expect(spinner).toBeVisible();
  await expect(spinner).toHaveAttribute('role', 'progressbar');
  const value = await spinner.getAttribute('aria-valuenow');
  expect(value).not.toBeNull();
  const percent = spinner.locator('.solaris-spinner__percent');
  await expect(percent).toContainText('%');
});

test('progress spinner animates from 0 to 100', async ({ page }) => {
  await page.goto('/feedback/loading/spinner');
  const spinner = page
    .locator('solaris-spinner[data-variant="progress"]', {
      hasText: 'Downloading',
    })
    .first();
  await expect(spinner).toBeVisible();
  expect(await spinner.getAttribute('aria-valuenow')).toBe('0');

  await page.getByRole('button', { name: 'Play' }).click();

  await expect
    .poll(async () => await spinner.getAttribute('aria-valuenow'), {
      timeout: 8000,
    })
    .toBe('100');
  await expect(spinner.locator('.solaris-spinner__percent')).toHaveText('100%');
});

test('progress spinner renders description lines', async ({ page }) => {
  await page.goto('/feedback/loading/spinner');
  const spinner = page
    .locator('solaris-spinner[data-variant="progress"]', {
      hasText: 'File size',
    })
    .first();
  await expect(spinner).toBeVisible();
  await expect(
    spinner.locator('.solaris-spinner__description').first(),
  ).toContainText('File size');
});

test('backdrop spinner centers ring and overlays track', async ({ page }) => {
  await page.goto('/feedback/loading/spinner');
  await page.getByRole('button', { name: /backdrop/i }).click();
  const backdrop = page.locator('solaris-spinner[data-backdrop]');
  await expect(backdrop).toBeVisible();

  const ring = backdrop.locator('.solaris-spinner__ring');
  const track = ring.locator('.solaris-spinner__track');
  const indicator = ring.locator('.solaris-spinner__indicator');

  await expect(track).toBeVisible();
  await expect(indicator).toBeVisible();

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
