import { expect, test } from '@playwright/test';

test.describe('Chart shell', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-display/chart-shell');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('renders hero, legend and canvas with an accessible summary', async ({
    page,
  }) => {
    const shell = page.locator('solaris-chart-shell').first();
    await expect(shell.locator('.solaris-chart-shell__hero-value')).toHaveText(
      '12,450',
    );
    await expect(
      shell.locator('.solaris-chart-shell__legend-item'),
    ).toHaveCount(3);
    const canvas = shell.locator('.solaris-chart-shell__canvas');
    await expect(canvas).toHaveAttribute('role', 'img');
    await expect(canvas.getAttribute('aria-label')).resolves.toContain(
      'Task Automation',
    );
  });

  test('toggles legend series with mouse and keyboard', async ({ page }) => {
    const shell = page.locator('solaris-chart-shell').first();
    const first = shell.locator('.solaris-chart-shell__legend-item').first();
    await expect(first).toHaveAttribute('aria-pressed', 'true');
    await first.click();
    await expect(page.getByTestId('event-log')).toHaveText('toggle:automation');
    await first.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('event-log')).toHaveText('toggle:automation');
  });

  test('changes period through the segmented filter', async ({ page }) => {
    const shell = page.locator('solaris-chart-shell').first();
    await shell.locator('solaris-segmented-item', { hasText: '1M' }).click();
    await expect(page.getByTestId('event-log')).toHaveText('period:1M');
  });

  test('switches views through the select', async ({ page }) => {
    const shell = page.locator('solaris-chart-shell').first();
    await shell.locator('.solaris-chart-shell__view-select').click();
    await page.getByRole('option', { name: 'Bar' }).click();
    await expect(shell).toHaveAttribute('data-view', 'bar');
    await expect(page.getByTestId('event-log')).toHaveText('view:bar');
  });

  test('emits actions from the menu', async ({ page }) => {
    const shell = page.locator('solaris-chart-shell').first();
    await shell.locator('[solaris-dropdown-menu-trigger]').click();
    await page.getByRole('menuitem', { name: /Export/ }).click();
    await expect(page.getByTestId('event-log')).toHaveText('action:export');
  });

  test('stacks legend below canvas at 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    const shell = page.locator('solaris-chart-shell').first();
    await expect(shell.locator('.solaris-chart-shell__legend')).toBeVisible();
    await expect(shell.locator('.solaris-chart-shell__canvas')).toBeVisible();
  });
});
