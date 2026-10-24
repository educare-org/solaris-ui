import { expect, test } from '@playwright/test';

test.describe('Heatmap', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-display/charts/heatmap');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('selects cells with the keyboard', async ({ page }) => {
    const heatmap = page.locator('solaris-heatmap').first();
    const firstCell = heatmap.locator('[data-cell]').first();
    await firstCell.focus();
    const tooltip = heatmap.locator('.solaris-heatmap__tooltip');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveAttribute('data-side', 'right');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('heat-event-log')).toHaveText(
      'heat-cell:mon:0',
    );
  });

  test('moves across the grid with arrow keys', async ({ page }) => {
    const heatmap = page.locator('solaris-heatmap').first();
    const firstCell = heatmap.locator('[data-cell]').first();
    await firstCell.focus();
    await page.keyboard.press('ArrowRight');
    await expect(heatmap.locator('[data-cell="mon:1"]')).toHaveAttribute(
      'tabindex',
      '0',
    );
  });
});
