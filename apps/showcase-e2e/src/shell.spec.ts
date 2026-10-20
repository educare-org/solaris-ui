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

  test('drills through the mini-month and shows the timezone control', async ({
    page,
  }) => {
    const shell = page.locator('solaris-calendar');
    await expect(
      shell.locator('solaris-select.solaris-calendar__tz-select'),
    ).toContainText(/Fuso horário|Time zone/);
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
});
