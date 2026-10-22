import { expect, test } from '@playwright/test';

test.describe('Bar chart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-display/charts/bar-chart');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('selects bars with the keyboard', async ({ page }) => {
    const bar = page.locator('solaris-bar-chart').first();
    const firstBar = bar.locator('[data-bar]').first();
    await firstBar.focus();
    await expect(bar.locator('.solaris-bar-chart__tooltip')).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('bar-event-log')).toHaveText(
      'bar-point:automation:0',
    );
  });

  test('switches the bar layout to stacked-100', async ({ page }) => {
    const bar = page.locator('solaris-bar-chart').first();
    await page.getByRole('tab').nth(2).click();
    await expect(bar).toHaveAttribute('data-layout', 'stacked-100');
    await expect(
      bar.locator('.solaris-bar-chart__tick', { hasText: '%' }).first(),
    ).toBeVisible();
  });
});
