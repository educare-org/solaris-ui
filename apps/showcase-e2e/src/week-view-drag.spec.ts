import { expect, test, type Locator, type Page } from '@playwright/test';

test.describe('Week view drag', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/scheduling/week-view');
    await expect(page.locator('h1')).toBeVisible();
  });

  function dragSection(page: Page): Locator {
    return page.locator('solaris-preview-code', {
      has: page.getByTestId('drag-log'),
    });
  }

  function slot(scope: Locator, date: string, hour: number): Locator {
    return scope.locator(
      `.solaris-calendar-week-view__slotcell[data-date="${date}"][data-hour="${hour}"]`,
    );
  }

  async function dragSlots(
    page: Page,
    scope: Locator,
    fromDate: string,
    fromHour: number,
    toDate: string,
    toHour: number,
  ): Promise<void> {
    const source = slot(scope, fromDate, fromHour);
    const target = slot(scope, toDate, toHour);
    await source.scrollIntoViewIfNeeded();
    const fromBox = await source.boundingBox();
    const toBox = await target.boundingBox();
    if (fromBox === null || toBox === null) throw new Error('missing slots');
    await page.mouse.move(
      fromBox.x + fromBox.width / 2,
      fromBox.y + fromBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      toBox.x + toBox.width / 2,
      toBox.y + toBox.height / 2,
      { steps: 12 },
    );
    await page.mouse.up();
  }

  test('proposes a create with the mouse', async ({ page }) => {
    const scope = dragSection(page);
    await dragSlots(page, scope, '2026-10-16', 9, '2026-10-16', 11);
    await expect(page.getByTestId('drag-log')).toHaveText(/create:/);
  });

  test('emulates touch pointers without mutating', async ({ page }) => {
    const scope = dragSection(page);
    await slot(scope, '2026-10-16', 9).scrollIntoViewIfNeeded();
    await scope.evaluate((preview) => {
      const source = preview.querySelector(
        '.solaris-calendar-week-view__slotcell[data-date="2026-10-16"][data-hour="9"]',
      );
      const target = preview.querySelector(
        '.solaris-calendar-week-view__slotcell[data-date="2026-10-16"][data-hour="11"]',
      );
      if (!(source instanceof HTMLElement)) throw new Error('missing source');
      if (!(target instanceof HTMLElement)) throw new Error('missing target');
      const from = source.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const base = {
        bubbles: true,
        cancelable: true,
        composed: true,
        isPrimary: true,
        pointerId: 9,
        pointerType: 'touch',
        button: 0,
      } as const;
      source.dispatchEvent(
        new PointerEvent('pointerdown', {
          ...base,
          clientX: from.x + from.width / 2,
          clientY: from.y + from.height / 2,
        }),
      );
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          ...base,
          clientX: to.x + to.width / 2,
          clientY: to.y + to.height / 2,
        }),
      );
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          ...base,
          clientX: to.x + to.width / 2,
          clientY: to.y + to.height / 2,
        }),
      );
    });
    await expect(page.getByTestId('drag-log')).toHaveText(/create:/);
  });

  test('creates with keyboard equivalents', async ({ page }) => {
    const scope = dragSection(page);
    const grid = scope.locator('.solaris-calendar-week-view__grid');
    await grid.focus();
    await page.keyboard.press('Shift+ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('drag-log')).toHaveText(/create:/);
  });

  test('keeps the consumer array frozen', async ({ page }) => {
    const scope = dragSection(page);
    const kinds = await scope.evaluate(
      (preview) =>
        preview.querySelectorAll(
          '.solaris-calendar-week-view__block[data-occurrence]',
        ).length,
    );
    expect(kinds).toBeGreaterThan(0);
    await dragSlots(page, scope, '2026-10-16', 9, '2026-10-16', 10);
    await expect(page.getByTestId('drag-log')).toHaveText(/create:/);
    const after = await scope.evaluate(
      (preview) =>
        preview.querySelectorAll(
          '.solaris-calendar-week-view__block[data-occurrence]',
        ).length,
    );
    expect(after).toBe(kinds);
  });

  test('drag-creates at 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    const scope = dragSection(page);
    await dragSlots(page, scope, '2026-10-16', 9, '2026-10-16', 11);
    await expect(page.getByTestId('drag-log')).toHaveText(/create:/);
  });
});
