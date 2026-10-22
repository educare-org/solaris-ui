import { expect, test } from '@playwright/test';

test.describe('Line chart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-display/charts/line-chart');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('renders a canvas with an accessible summary', async ({ page }) => {
    const canvas = page.locator('solaris-line-chart svg').first();
    await expect(canvas).toHaveAttribute('role', 'img');
    await expect(canvas.getAttribute('aria-label')).resolves.toMatch(
      /automation|automação/i,
    );
  });

  test('selects line dots with the keyboard', async ({ page }) => {
    const line = page.locator('solaris-line-chart').first();
    const firstDot = line.locator('circle[data-dot]').first();
    await firstDot.focus();
    await expect(line.locator('.solaris-line-chart__tooltip')).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('line-event-log')).toHaveText(
      'point:automation:0',
    );
  });
});
