import { expect, test } from '@playwright/test';

test.describe('Month view', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/scheduling/month-view');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('navigates days with arrows and selects with Enter', async ({
    page,
  }) => {
    const examples = page.locator('#examples');
    const grid = examples.locator('[role="grid"]');
    await grid.focus();
    await expect(grid).toHaveAttribute('aria-activedescendant', /2026-10-15/);
    await page.keyboard.press('ArrowRight');
    await expect(grid).toHaveAttribute('aria-activedescendant', /2026-10-16/);
    await page.keyboard.press('ArrowDown');
    await expect(grid).toHaveAttribute('aria-activedescendant', /2026-10-23/);
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('event-log')).toHaveText('day:2026-10-23');
  });

  test('opens events from chips', async ({ page }) => {
    const examples = page.locator('#examples');
    const chip = examples
      .locator('[data-date="2026-10-29"]')
      .getByRole('button', { name: /Team standup/ })
      .first();
    await chip.scrollIntoViewIfNeeded({ timeout: 10000 });
    await chip.click({ timeout: 10000 });
    await expect(page.getByTestId('event-log')).toHaveText(
      'event:standup@2026-10-29T09:00:00-03:00',
    );
  });

  test('keeps the overflow popover in the viewport at 360px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    const examples = page.locator('#examples');
    const more = examples
      .getByRole('button', {
        name: /more items on|itens a mais|eventos más/,
      })
      .first();
    await more.scrollIntoViewIfNeeded({ timeout: 10000 });
    await more.click({ timeout: 10000 });
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const bounds = await dialog.boundingBox();
    const viewport = page.viewportSize();
    if (bounds === null || viewport === null) {
      throw new Error('missing popover geometry');
    }
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width);
    await expect(page.getByTestId('event-log')).toHaveText('more:2026-10-15');
  });
});
