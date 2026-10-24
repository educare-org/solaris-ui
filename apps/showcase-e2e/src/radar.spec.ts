import { expect, test } from '@playwright/test';

test.describe('Radar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-display/charts/radar');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('selects vertices with the keyboard', async ({ page }) => {
    const radar = page.locator('solaris-radar').first();
    const firstVertex = radar.locator('[data-vertex]').first();
    await firstVertex.focus();
    const tooltip = radar.locator('.solaris-radar__tooltip');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveAttribute('data-side', 'top');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('radar-event-log')).toHaveText(
      'radar-vertex:class-a:0',
    );
  });

  test('toggles series through the integrated legend', async ({ page }) => {
    const radar = page.locator('solaris-radar').first();
    await expect(radar.locator('[data-series]')).toHaveCount(2);
    await radar.locator('[data-legend="class-b"]').click();
    await expect(radar.locator('[data-legend="class-b"]')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    await expect(radar.locator('[data-series]')).toHaveCount(1);
  });
});
