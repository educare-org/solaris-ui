import { expect, test } from '@playwright/test';

test.describe('Chart shell', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-display/charts/shell');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('renders hero, legend and canvas with an accessible summary', async ({
    page,
  }) => {
    const shell = page.locator('solaris-chart-shell').first();
    await expect(shell.locator('.solaris-chart-shell__hero-value')).toHaveText(
      '2,3 mil',
    );
    await expect(
      shell.locator('.solaris-chart-shell__legend-item'),
    ).toHaveCount(3);
    const canvas = shell.locator('.solaris-chart-shell__canvas');
    await expect(canvas).toHaveAttribute('role', 'img');
    await expect(canvas.getAttribute('aria-label')).resolves.toMatch(/automa/i);
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
    await shell.locator('solaris-segmented-item', { hasText: /1 m/i }).click();
    await expect(page.getByTestId('event-log')).toHaveText('period:month');
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

  test('opens fullscreen in a dialog with focus trap and closes via Escape', async ({
    page,
  }) => {
    const shell = page.locator('solaris-chart-shell').first();
    await shell
      .locator('.solaris-chart-shell__toolbar button[solaris-icon-button]')
      .first()
      .click();
    const panel = page.locator('.solaris-dialog-panel');
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute('role', 'dialog');
    await expect(panel).toHaveAttribute('aria-modal', 'true');
    await expect(page.getByTestId('event-log')).toHaveText('action:fullscreen');
    await expect(
      panel.locator('.chart-shell-fullscreen-dialog__table'),
    ).toBeVisible();
    await expect
      .poll(async () =>
        page.evaluate(() => {
          const dialog = document.querySelector('.solaris-dialog-panel');
          return dialog ? dialog.contains(document.activeElement) : false;
        }),
      )
      .toBe(true);
    await page.keyboard.press('Escape');
    await expect(panel).toHaveCount(0);
  });

  test('selects line dots with the keyboard', async ({ page }) => {
    const line = page.locator('solaris-line-chart').first();
    const firstDot = line.locator('circle[data-dot]').first();
    await expect
      .poll(
        async () => {
          await page.evaluate(() =>
            (document.activeElement as HTMLElement | null)?.blur?.(),
          );
          await firstDot.focus();
          return line.locator('.solaris-line-chart__tooltip').count();
        },
        { timeout: 15000 },
      )
      .toBe(1);
    await expect(line.locator('.solaris-line-chart__tooltip')).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('event-log')).toHaveText(
      'point:automation:0',
    );
  });

  test('moves between line dots with arrow keys', async ({ page }) => {
    const line = page.locator('solaris-line-chart').first();
    const dots = line.locator('circle[data-dot]');
    await dots.first().focus();
    await page.keyboard.press('ArrowRight');
    await expect(dots.nth(1)).toHaveAttribute('tabindex', '0');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('event-log')).toHaveText(
      'point:automation:1',
    );
  });

  test('projects the bar chart when the bar view is selected', async ({
    page,
  }) => {
    const shell = page.locator('solaris-chart-shell').first();
    await shell.locator('.solaris-chart-shell__view-select').click();
    await page.getByRole('option', { name: 'Bar' }).click();
    const bar = shell.locator('solaris-bar-chart');
    await expect(bar).toBeVisible();
    const firstBar = bar.locator('[data-bar]').first();
    await firstBar.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('event-log')).toHaveText(
      'point:automation:0',
    );
  });

  test('projects the pie chart when the pie view is selected', async ({
    page,
  }) => {
    const shell = page.locator('solaris-chart-shell').first();
    await shell.locator('.solaris-chart-shell__view-select').click();
    await page.getByRole('option', { name: 'Pie' }).click();
    const pie = shell.locator('solaris-pie-chart');
    await expect(pie).toBeVisible();
    await expect(shell).toHaveAttribute('data-view', 'pie');
    const firstSlice = pie.locator('[data-slice]').first();
    await firstSlice.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('event-log')).toHaveText('slice:automation');
  });

  test('switches projected views through tabs', async ({ page }) => {
    const section = page.locator('app-docs-section[anchor="views"]');
    await section.getByRole('tab', { name: 'Bar' }).click();
    await expect(section.locator('solaris-chart-shell')).toHaveAttribute(
      'data-view',
      'bar',
    );
    await expect(
      section.locator('solaris-chart-shell solaris-bar-chart'),
    ).toBeVisible();
  });

  test('switches shell states through tabs and retries from error', async ({
    page,
  }) => {
    const section = page.locator('app-docs-section[anchor="states"]');
    await section.getByRole('tab', { name: 'Loading' }).click();
    await expect(
      section.locator('.solaris-chart-shell__loading'),
    ).toBeVisible();
    await section.getByRole('tab', { name: 'Error' }).click();
    await section.locator('.solaris-chart-shell__error button').click();
    await expect(section.getByTestId('state-event-log')).toHaveText('retry');
  });

  test('removes toggled series from the list display', async ({ page }) => {
    const section = page.locator('app-docs-section[anchor="display"]');
    await section.getByRole('tab', { name: 'List' }).click();
    const rows = section.locator('.chart-shell-showcase__list-row');
    await expect(rows).toHaveCount(3);
    await section.locator('.solaris-chart-shell__legend-item').first().click();
    await expect(rows).toHaveCount(2);
  });

  test('sequences the line transition without leaving overlays', async ({
    page,
  }) => {
    const shell = page.locator('solaris-chart-shell').first();
    await shell.locator('solaris-segmented-item', { hasText: /1 m/i }).click();
    await expect(page.getByTestId('event-log')).toHaveText('period:month');
    await expect(
      shell.locator('svg.solaris-line-chart__svg').first(),
    ).toBeVisible();
    await expect(
      shell.locator('.solaris-line-chart__transition-overlay'),
    ).toHaveCount(0);
  });

  test('animates list rows in two phases before removal', async ({ page }) => {
    const section = page.locator('app-docs-section[anchor="display"]');
    await section.getByRole('tab', { name: 'List' }).click();
    await expect(section.locator('.chart-shell-showcase__list')).toBeVisible();
    await expect(
      section.locator('.chart-shell-showcase__list-row'),
    ).toHaveCount(3);
    await section.locator('.solaris-chart-shell__legend-item').first().click();
    await page.waitForSelector('.chart-shell-showcase__list-row.is-leaving', {
      timeout: 2000,
    });
    await expect(
      section.locator('.chart-shell-showcase__list-row'),
    ).toHaveCount(2);
  });

  test('fades incoming content when switching display modes', async ({
    page,
  }) => {
    const section = page.locator('app-docs-section[anchor="display"]');
    await section.getByRole('tab', { name: 'List' }).click();
    const list = section.locator('.chart-shell-showcase__list');
    await expect(list).toBeVisible();
    await expect(
      list.evaluate((node) => getComputedStyle(node).animationName),
    ).resolves.toContain('chart-shell-display-enter');
    await section.getByRole('tab', { name: 'Timeline' }).click();
    await expect(section.locator('solaris-line-chart')).toBeVisible();
  });

  test('redirects the legacy chart-shell path to charts/shell', async ({
    page,
  }) => {
    await page.goto('/data-display/chart-shell');
    await expect(page).toHaveURL(/\/data-display\/charts\/shell$/);
  });

  test('stacks legend below canvas at 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    const shell = page.locator('solaris-chart-shell').first();
    await expect(shell.locator('.solaris-chart-shell__legend')).toBeVisible();
    await expect(shell.locator('.solaris-chart-shell__canvas')).toBeVisible();
  });
});
