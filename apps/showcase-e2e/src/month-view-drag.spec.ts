import { expect, test, type Locator, type Page } from '@playwright/test';

test.describe('Month view drag', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/scheduling/month-view');
    await expect(page.locator('h1')).toBeVisible();
  });

  function dragSection(page: Page): Locator {
    return page.locator('solaris-preview-code', {
      has: page.getByTestId('drag-log'),
    });
  }

  function cell(scope: Locator, date: string): Locator {
    return scope.locator(
      `.solaris-calendar-month-view__cell[data-date="${date}"]`,
    );
  }

  async function dragDates(
    page: Page,
    scope: Locator,
    from: string,
    to: string,
  ): Promise<void> {
    const source = cell(scope, from);
    const target = cell(scope, to);
    await source.scrollIntoViewIfNeeded();
    const fromBox = await source.boundingBox();
    const toBox = await target.boundingBox();
    if (fromBox === null || toBox === null) throw new Error('missing cells');
    await page.mouse.move(
      fromBox.x + fromBox.width / 2,
      fromBox.y + fromBox.height - 8,
    );
    await page.mouse.down();
    await page.mouse.move(
      toBox.x + toBox.width / 2,
      toBox.y + toBox.height - 8,
      { steps: 12 },
    );
    await page.mouse.up();
  }

  test('proposes a create with the mouse', async ({ page }) => {
    const scope = dragSection(page);
    await dragDates(page, scope, '2026-10-16', '2026-10-18');
    await expect(page.getByTestId('drag-log')).toHaveText(
      /create:2026-10-16.*2026-10-18/,
    );
  });

  test('emulates touch pointers without mutating', async ({ page }) => {
    const scope = dragSection(page);
    await cell(scope, '2026-10-16').scrollIntoViewIfNeeded();
    await scope.evaluate((preview) => {
      const source = preview.querySelector(
        '.solaris-calendar-month-view__cell[data-date="2026-10-16"]',
      );
      const target = preview.querySelector(
        '.solaris-calendar-month-view__cell[data-date="2026-10-17"]',
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
        pointerId: 7,
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
    await expect(page.getByTestId('drag-log')).toHaveText(
      /create:2026-10-16.*2026-10-17/,
    );
  });

  test('creates with keyboard equivalents', async ({ page }) => {
    const scope = dragSection(page);
    const grid = scope.locator('.solaris-calendar-month-view__grid');
    await grid.focus();
    await page.keyboard.press('Shift+ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('drag-log')).toHaveText(/create:/);
  });

  test('keeps the consumer array frozen', async ({ page }) => {
    const scope = dragSection(page);
    const kinds = await scope.evaluate(
      (preview) =>
        preview.querySelectorAll(
          '.solaris-calendar-month-view__chip[data-kind="event"]',
        ).length,
    );
    expect(kinds).toBeGreaterThan(0);
    await dragDates(page, scope, '2026-10-16', '2026-10-17');
    await expect(page.getByTestId('drag-log')).toHaveText(/create:/);
    const after = await scope.evaluate(
      (preview) =>
        preview.querySelectorAll(
          '.solaris-calendar-month-view__chip[data-kind="event"]',
        ).length,
    );
    expect(after).toBe(kinds);
  });

  test('drag-creates at 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    const scope = dragSection(page);
    await dragDates(page, scope, '2026-10-16', '2026-10-17');
    await expect(page.getByTestId('drag-log')).toHaveText(/create:/);
  });
});
