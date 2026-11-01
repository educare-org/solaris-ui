import { test, expect } from '@playwright/test';

test.describe('RangeSlider', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forms/range-slider');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('renders two thumbs with ordered values', async ({ page }) => {
    const slider = page.locator(
      'solaris-range-slider:has(.solaris-range-slider__min)',
    );
    const thumbs = slider.locator('[role="slider"]');
    await expect(thumbs).toHaveCount(2);
    await expect(thumbs.nth(0)).toHaveAttribute('aria-valuenow', '25');
    await expect(thumbs.nth(1)).toHaveAttribute('aria-valuenow', '75');
  });

  test('moves each thumb independently with the keyboard', async ({ page }) => {
    const thumbs = page.locator(
      'solaris-range-slider:has(.solaris-range-slider__min) [role="slider"]',
    );
    await thumbs.nth(1).focus();
    await page.keyboard.press('ArrowLeft');
    await expect(thumbs.nth(1)).toHaveAttribute('aria-valuenow', '74');
    await expect(thumbs.nth(0)).toHaveAttribute('aria-valuenow', '25');
    await page.keyboard.press('Home');
    await expect(thumbs.nth(1)).toHaveAttribute('aria-valuenow', '25');
  });

  test('drags the nearest thumb on the track', async ({ page }) => {
    const slider = page.locator(
      'solaris-range-slider:has(.solaris-range-slider__min)',
    );
    const track = slider.locator('.solaris-range-slider__track');
    const thumbs = slider.locator('[role="slider"]');
    // Why: the demo lives in the Types section below the fold; raw mouse
    // events need viewport coords, so the track is scrolled into view first
    // (keyboard tests self-scroll via focus()).
    await slider.scrollIntoViewIfNeeded();
    // Why: the pointer target is derived from the live in-page rect
    // milliseconds before each gesture, so Playwright-box vs getBoundingClientRect
    // skew across engines cannot offset the ratio; only sub-pixel clientX
    // rounding remains, which step-1 snapping absorbs.
    const point = (ratio: number): Promise<{ x: number; y: number }> =>
      track.evaluate((el, r) => {
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left + rect.width * r,
          y: rect.top + rect.height / 2,
        };
      }, ratio);
    const from = await point(0.9);
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    const to = await point(0.6);
    await page.mouse.move(to.x, to.y, { steps: 5 });
    await page.mouse.up();
    // Why: real-pointer clientX crosses engine rounding (integer dispatch in
    // some drivers), so the exact unit is unit-test territory (mocked rects);
    // e2e proves the path: nearest-thumb selection, live move, commit.
    const landed = await thumbs.nth(1).getAttribute('aria-valuenow');
    expect(['59', '60', '61']).toContain(landed);
    await expect(thumbs.nth(0)).toHaveAttribute('aria-valuenow', '25');
  });

  test('keeps the page usable at 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    const slider = page
      .locator('solaris-range-slider:has(.solaris-range-slider__min)')
      .first();
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
      .locator('solaris-range-slider:has(.solaris-range-slider__min)')
      .locator('.solaris-range-slider__fill');
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
    const demo = page.locator(
      'solaris-range-slider:has(.solaris-range-slider__min)',
    );
    await expect(demo).toHaveCount(1);
    await expect(demo.locator('.solaris-range-slider__min')).toHaveText('0%');
    await expect(demo.locator('.solaris-range-slider__max')).toHaveText('100%');
    await expect(demo.locator('.solaris-range-slider__min')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    await expect(demo.locator('.solaris-range-slider__max')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });
});
