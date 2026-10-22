import { expect, test } from '@playwright/test';

test.describe('Pie chart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-display/charts/pie-chart');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('selects slices with the keyboard and opens the drill-down', async ({
    page,
  }) => {
    const pie = page.locator('solaris-pie-chart').first();
    const firstSlice = pie.locator('[data-slice]').first();
    await firstSlice.focus();
    await expect(pie.locator('.solaris-pie-chart__tooltip')).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('pie-event-log')).toHaveText(
      'pie-slice:fundamental',
    );
    await expect(page.getByTestId('pie-drill-detail')).toBeVisible();
  });

  test('switches the pie variant to gauge with a target tick', async ({
    page,
  }) => {
    const pie = page.locator('solaris-pie-chart').first();
    await page.getByRole('tab', { name: 'Gauge' }).click();
    await expect(pie).toHaveAttribute('data-variant', 'gauge');
    await expect(pie.locator('.solaris-pie-chart__gauge-target')).toBeVisible();
  });
});
