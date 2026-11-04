import { test, expect } from '@playwright/test';

test.describe('Slider', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forms/slider');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('renders the slider role with keyboard support', async ({ page }) => {
    const thumb = page.locator('solaris-slider [role="slider"]').first();
    await expect(thumb).toBeVisible();
    await expect(thumb).toHaveAttribute('aria-valuenow', '50');
    await thumb.focus();
    await page.keyboard.press('ArrowRight');
    await expect(thumb).toHaveAttribute('aria-valuenow', '51');
    await page.keyboard.press('Home');
    await expect(thumb).toHaveAttribute('aria-valuenow', '0');
    await page.keyboard.press('End');
    await expect(thumb).toHaveAttribute('aria-valuenow', '100');
  });

  test('moves the value with a track drag', async ({ page }) => {
    const slider = page.locator('solaris-slider').first();
    const track = slider.locator('.solaris-slider__track');
    const thumb = slider.locator('[role="slider"]');
    // Why: async code highlighting reflows the page after load and shifts the
    // flex track; dragging only starts once its box stops moving.
    let lastBox = '';
    await expect
      .poll(
        async () => {
          const bounds = await track.boundingBox();
          const key = bounds
            ? `${bounds.x.toFixed(1)}x${bounds.width.toFixed(1)}`
            : '';
          const stable = lastBox !== '' && lastBox === key;
          lastBox = key;
          return stable;
        },
        { timeout: 10000 },
      )
      .toBe(true);
    const box = await track.boundingBox();
    expect(box).not.toBeNull();
    const y = box!.y + box!.height / 2;
    await page.mouse.move(box!.x + box!.width * 0.2, y);
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width * 0.8, y, { steps: 5 });
    await page.mouse.up();
    await expect(thumb).toHaveAttribute('aria-valuenow', '80');
  });

  test('keeps the page usable at 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    const slider = page.locator('solaris-slider').first();
    await expect(slider).toBeVisible();
    const bounds = await slider.boundingBox();
    const viewport = page.viewportSize();
    expect(bounds).not.toBeNull();
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport!.width);
  });

  test('renders the fill in dark and high-contrast themes', async ({
    page,
  }) => {
    const fill = page
      .locator('solaris-slider')
      .first()
      .locator('.solaris-slider__fill');
    for (const theme of ['dark', 'high-contrast']) {
      await page.evaluate((value) => {
        document.documentElement.dataset['theme'] = value;
      }, theme);
      await expect(fill).toBeVisible();
      const color = await fill.evaluate(
        (el) => getComputedStyle(el).backgroundColor,
      );
      expect(color).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('renders static min/max scale labels', async ({ page }) => {
    const demo = page.locator('solaris-slider:has(.solaris-slider__min)');
    await expect(demo).toHaveCount(1);
    await expect(demo.locator('.solaris-slider__min')).toHaveText('0%');
    await expect(demo.locator('.solaris-slider__max')).toHaveText('100%');
    await expect(demo.locator('.solaris-slider__min')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    await expect(demo.locator('.solaris-slider__max')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });
});
