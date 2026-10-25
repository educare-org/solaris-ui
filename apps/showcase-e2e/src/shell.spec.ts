import { expect, test } from '@playwright/test';

test.describe('Calendar shell', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/scheduling/shell');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('navigates with previous, next, and today', async ({ page }) => {
    const shell = page.locator('solaris-calendar');
    const title = shell.locator('.solaris-calendar__title');
    const before = await title.textContent();
    await shell.locator('.solaris-calendar__next').click();
    await expect(title).not.toHaveText(before ?? '');
    await shell.locator('.solaris-calendar__prev').click();
    await expect(title).toHaveText(before ?? '');
    await shell.locator('.solaris-calendar__today').click();
    await expect(title).not.toHaveText('');
  });

  test('switches views including custom days', async ({ page }) => {
    const shell = page.locator('solaris-calendar');
    const views = shell.locator(
      'solaris-select.solaris-calendar__views-select',
    );
    await views.getByRole('combobox').click();
    await page.getByRole('option', { name: /Semana|Week/ }).click();
    await expect(shell).toHaveAttribute('data-view', 'week');
    await expect(page.getByTestId('event-log')).toHaveText('view:week');
    await views.getByRole('combobox').click();
    await page.getByRole('option', { name: /Personalizado|Custom/ }).click();
    const custom = shell.locator(
      'solaris-select.solaris-calendar__custom-days',
    );
    await custom.getByRole('combobox').click();
    await page.getByRole('option', { name: '3', exact: true }).click();
    await expect(page.getByTestId('event-log')).toHaveText('view:custom');
  });

  test('drills through the mini-month', async ({ page }) => {
    const shell = page.locator('solaris-calendar');
    await shell
      .locator('.solaris-calendar__mini-day[data-date="2026-10-20"]')
      .click();
    await expect(page.getByTestId('event-log')).toHaveText('day:2026-10-20');
  });

  test('falls back to schedule at 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    const shell = page.locator('solaris-calendar');
    await expect(shell).toHaveAttribute('data-view', 'schedule');
    await expect(
      shell.locator('.solaris-calendar-schedule-view__list'),
    ).toBeVisible();
  });

  test('supports keyboard shortcuts for views, navigation, and today', async ({
    page,
  }) => {
    const shell = page.locator('solaris-calendar');
    const title = shell.locator('.solaris-calendar__title');
    await page.locator('h1').click();

    await page.keyboard.press('2');
    await expect(shell).toHaveAttribute('data-view', 'week');
    await expect(page.getByTestId('event-log')).toHaveText('view:week');

    await page.keyboard.press('1');
    await expect(shell).toHaveAttribute('data-view', 'day');

    await page.keyboard.press('3');
    await expect(shell).toHaveAttribute('data-view', 'month');

    await page.keyboard.press('4');
    await expect(shell).toHaveAttribute('data-view', 'year');

    await page.keyboard.press('5');
    await expect(shell).toHaveAttribute('data-view', 'schedule');

    await page.keyboard.press('3');
    await expect(shell).toHaveAttribute('data-view', 'month');
    const before = await title.textContent();
    await page.keyboard.press(']');
    await expect(title).not.toHaveText(before ?? '');
    await page.keyboard.press('[');
    await expect(title).toHaveText(before ?? '');

    await page.keyboard.press(']');
    await page.keyboard.press('t');
    await expect(title).not.toHaveText('');
  });

  test('opens the create dialog on N and keeps the focus trap intact', async ({
    page,
  }) => {
    await page.locator('h1').click();
    await page.keyboard.press('n');
    const panel = page.locator('.solaris-dialog-panel');
    await expect(panel).toBeVisible();
    const title = panel.locator('input[type="text"]').first();
    await title.click();
    await expect(title).toBeFocused();
    for (let index = 0; index < 10; index += 1) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => {
        const active = document.activeElement;
        if (!active) return false;
        return Boolean(active.closest('.solaris-dialog-panel'));
      });
      expect(focused).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
  });

  test('ignores shortcuts while typing in the editor title input', async ({
    page,
  }) => {
    const shell = page.locator('solaris-calendar');
    await page.locator('h1').click();
    await page.keyboard.press('n');
    const panel = page.locator('.solaris-dialog-panel');
    await expect(panel).toBeVisible();
    const title = panel.locator('input[type="text"]').first();
    await title.click();
    await title.fill('n');
    await expect(shell).toHaveAttribute('data-view', 'month');
    await expect(page.getByTestId('event-log')).not.toHaveText('view:week');
    await expect(panel).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
  });
});
