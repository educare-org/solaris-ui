import { expect, test } from '@playwright/test';

test.describe('Schedule view', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/scheduling/schedule-view');
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForLoadState('networkidle');
  });

  test('paginates the window and keeps day clicks on the anchor', async ({
    page,
  }) => {
    const examples = page.locator('#examples');
    const range = examples.locator('.solaris-calendar-schedule-view__range');
    const before = await range.textContent();
    await examples
      .locator('.solaris-calendar-schedule-view__nav')
      .nth(1)
      .click();
    await expect(range).not.toHaveText(before ?? '');
    await examples
      .locator('.solaris-calendar-schedule-view__dayhead')
      .first()
      .click();
    await expect(page.getByTestId('event-log')).toHaveText(/day:2026-10-2/);
    await examples
      .locator('.solaris-calendar-schedule-view__nav')
      .first()
      .click();
    await expect(range).toHaveText(before ?? '');
  });

  test('bounds a thousand events to the visible window', async ({ page }) => {
    const examples = page.locator('#examples');
    await examples.getByRole('tab', { name: /1000/ }).click();
    const groups = examples.locator('.solaris-calendar-schedule-view__day');
    await expect.poll(async () => groups.count()).toBeLessThanOrEqual(7);
    const rendered = await examples
      .locator('.solaris-calendar-schedule-view__item[data-kind="event"]')
      .count();
    expect(rendered).toBeGreaterThan(0);
    expect(rendered).toBeLessThan(1000);
    await examples
      .locator('.solaris-calendar-schedule-view__nav')
      .nth(1)
      .click();
    await expect.poll(async () => groups.count()).toBeLessThanOrEqual(7);
  });

  test('navigates groups with arrows and selects with Enter', async ({
    page,
  }) => {
    const examples = page.locator('#examples');
    const list = examples.locator('[role="list"]');
    await list.focus();
    await expect(list).toHaveAttribute('aria-activedescendant', /2026-10-15/);
    await page.keyboard.press('ArrowDown');
    await expect(list).not.toHaveAttribute(
      'aria-activedescendant',
      /2026-10-15/,
    );
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('event-log')).toHaveText(/day:2026-10-/);
  });

  test('toggles tasks inline and never scrolls horizontally at 360px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.evaluate(() => document.fonts.ready);
    const examples = page.locator('#examples');
    await examples
      .locator('.solaris-calendar-schedule-view__item[data-kind="task"]')
      .first()
      .click();
    await expect(page.getByTestId('event-log')).toHaveText('task:report');
    const agenda = examples.locator('.solaris-calendar-schedule-view__list');
    const overflow = await agenda.evaluate((element) => ({
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
  });
});
