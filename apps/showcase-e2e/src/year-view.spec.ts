import { expect, test } from '@playwright/test';

test.describe('Year view', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/scheduling/year-view');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('drills year to month to day', async ({ page }) => {
    const examples = page.locator('#examples');
    const drill = page.locator('#drill');
    await page.locator('#locales').getByRole('tab', { name: 'en-US' }).click();
    await examples
      .locator(
        '.solaris-calendar-year-view__month[data-month="9"] [data-date="2026-10-20"]',
      )
      .click();
    await expect(page.getByTestId('event-log')).toHaveText('day:2026-10-20');
    await expect(drill.locator('[role="grid"]')).toHaveAttribute(
      'aria-label',
      /October 2026/,
    );
    const monthDay = drill.locator('[id$="-day-2026-10-20"]');
    await expect(monthDay).toBeVisible();
    await monthDay.click();
    await expect(page.getByTestId('event-log')).toHaveText('day:2026-10-20');
  });

  test('navigates days with arrows and drills with Enter', async ({ page }) => {
    const examples = page.locator('#examples');
    const grid = examples.locator('[role="grid"]');
    await grid.focus();
    await expect(grid).toHaveAttribute('aria-activedescendant', /2026-10-15/);
    await page.keyboard.press('ArrowRight');
    await expect(grid).toHaveAttribute('aria-activedescendant', /2026-10-16/);
    await page.keyboard.press('ArrowDown');
    await expect(grid).toHaveAttribute('aria-activedescendant', /2026-10-23/);
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('event-log')).toHaveText('day:2026-10-23');
  });

  test('renders twelve months without horizontal overflow at 360px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    const examples = page.locator('#examples');
    await expect(
      examples.locator('.solaris-calendar-year-view__month'),
    ).toHaveCount(12);
    const grid = examples.locator('.solaris-calendar-year-view__grid');
    const overflow = await grid.evaluate((element) => ({
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
    await examples
      .locator(
        '.solaris-calendar-year-view__month[data-month="9"] [data-date="2026-10-20"]',
      )
      .click();
    await expect(page.getByTestId('event-log')).toHaveText('day:2026-10-20');
  });
});
