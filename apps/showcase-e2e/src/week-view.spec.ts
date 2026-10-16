import { expect, test } from '@playwright/test';

test.describe('Week view', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/scheduling/week-view');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('navigates slots with arrows and selects with Enter', async ({
    page,
  }) => {
    const examples = page.locator('#examples');
    const grid = examples.locator('[role="grid"]');
    await grid.focus();
    await expect(grid).toHaveAttribute(
      'aria-activedescendant',
      /2026-10-15-09/,
    );
    await page.keyboard.press('ArrowRight');
    await expect(grid).toHaveAttribute(
      'aria-activedescendant',
      /2026-10-16-09/,
    );
    await page.keyboard.press('ArrowDown');
    await expect(grid).toHaveAttribute(
      'aria-activedescendant',
      /2026-10-16-10/,
    );
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('event-log')).toHaveText(
      'slot:2026-10-16@10:00',
    );
  });

  test('opens events from blocks', async ({ page }) => {
    const examples = page.locator('#examples');
    await examples
      .getByRole('button', { name: /Team standup/ })
      .first()
      .click();
    await expect(page.getByTestId('event-log')).toHaveText(
      'event:standup@2026-10-15T09:00:00-03:00',
    );
  });

  test('toggles the all-day row', async ({ page }) => {
    const examples = page.locator('#examples');
    await expect(
      examples.locator('.solaris-calendar-week-view__allday'),
    ).toBeVisible();
    await examples.getByRole('tab', { name: 'Off' }).click();
    await expect(
      examples.locator('.solaris-calendar-week-view__allday'),
    ).toHaveCount(0);
    await examples.getByRole('tab', { name: 'On' }).click();
    await expect(
      examples.locator('.solaris-calendar-week-view__allday'),
    ).toBeVisible();
  });

  test('scrolls horizontally with a fixed gutter at 360px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    const examples = page.locator('#examples');
    const scroller = examples.locator('.solaris-calendar-week-view__scroll');
    const scrollable = await scroller.evaluate((element) => ({
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
    }));
    expect(scrollable.scrollWidth).toBeGreaterThan(scrollable.clientWidth);
    const gutter = examples
      .locator('.solaris-calendar-week-view__gutter')
      .first();
    await expect(gutter).toBeVisible();
    await examples
      .getByRole('button', { name: /Team standup/ })
      .first()
      .click();
    await expect(page.getByTestId('event-log')).toHaveText(
      'event:standup@2026-10-15T09:00:00-03:00',
    );
  });
});
