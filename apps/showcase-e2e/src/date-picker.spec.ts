import { expect, test } from '@playwright/test';

test.describe('Date picker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forms/date-picker');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('renders examples for constraints and field states', async ({
    page,
  }) => {
    const datePickers = page.locator('solaris-date-picker');

    await expect(datePickers).toHaveCount(5);
    await expect(page.locator('solaris-date-range-picker')).toHaveCount(2);
    await expect(datePickers.nth(3).locator('input')).toHaveAttribute(
      'readonly',
      '',
    );
    await expect(datePickers.nth(4).locator('input')).toBeDisabled();
  });

  test('keeps a compact calendar suffix within the field height', async ({
    page,
  }) => {
    const compactPicker = page.locator('solaris-date-picker').nth(1);
    const control = compactPicker.locator(
      '.solaris-form-field__control-wrapper',
    );
    const suffix = compactPicker.locator('[solaris-icon-button]');
    const dimensions = await control.evaluate((element) => {
      const styles = getComputedStyle(element);
      const bounds = element.getBoundingClientRect();
      const suffixBounds = element
        .querySelector('[solaris-icon-button]')!
        .getBoundingClientRect();

      return {
        height: bounds.height,
        minHeight: parseFloat(styles.minHeight),
        suffixHeight: suffixBounds.height,
        suffixWidth: suffixBounds.width,
      };
    });

    await expect(suffix).toBeVisible();
    expect(dimensions.height).toBe(dimensions.minHeight);
    expect(dimensions.suffixHeight).toBeLessThanOrEqual(dimensions.height);
    expect(dimensions.suffixWidth).toBe(dimensions.suffixHeight);
  });

  test('uses a compact mobile panel for date ranges', async ({ page }) => {
    await page.setViewportSize({ width: 512, height: 812 });
    const rangePicker = page.locator('solaris-date-range-picker').first();

    await rangePicker.locator('.solaris-date-range-picker__trigger').click();

    const panel = page.getByRole('dialog');
    const container = panel.locator('xpath=..');
    await expect(container).toHaveCSS('width', '280px');
    const panelBounds = await panel.boundingBox();
    const containerBounds = await container.boundingBox();
    const viewport = page.viewportSize();
    const presetStrip = panel.locator('.solaris-date-range-picker__presets');
    const activePreset = panel.locator(
      '.solaris-date-range-picker__preset[data-active]',
    );

    expect(panelBounds).not.toBeNull();
    expect(containerBounds).not.toBeNull();
    expect(viewport).not.toBeNull();
    expect(panelBounds!.x).toBeGreaterThanOrEqual(0);
    expect(panelBounds!.x + panelBounds!.width).toBeLessThanOrEqual(
      viewport!.width,
    );
    expect(panelBounds!.width).toBeLessThanOrEqual(280);
    expect(containerBounds!.width).toBeLessThanOrEqual(280);
    await expect(panel.locator('solaris-date-calendar').first()).toBeVisible();
    await expect(panel.locator('solaris-date-calendar').last()).toBeHidden();
    expect(
      await presetStrip.evaluate((element) =>
        Boolean(
          element.scrollWidth > element.clientWidth &&
            getComputedStyle(element).overflowX === 'auto',
        ),
      ),
    ).toBe(true);
    await expect(activePreset).toHaveCount(1);
    expect(
      await activePreset.evaluate(
        (element) => getComputedStyle(element, '::after').bottom,
      ),
    ).toBe('0px');
  });

  test('applies the relative today preset to the range picker', async ({
    page,
  }) => {
    const today = await page.evaluate(() => {
      const date = new Date();
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(
        new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())),
      );
    });
    const rangePicker = page.locator('solaris-date-range-picker').first();

    await rangePicker.locator('.solaris-date-range-picker__trigger').click();

    const panel = page.getByRole('dialog');
    await panel.getByRole('button', { name: 'Hoje' }).click();

    await expect(panel.getByRole('button', { name: 'Hoje' })).toHaveAttribute(
      'data-active',
      '',
    );
    await expect(
      panel.locator('.solaris-date-range-picker__inputs input').nth(0),
    ).toHaveValue(today);
    await expect(
      panel.locator('.solaris-date-range-picker__inputs input').nth(1),
    ).toHaveValue(today);

    await panel.getByRole('button', { name: 'Apply' }).click();

    await expect(
      rangePicker.locator('.solaris-date-range-picker__trigger'),
    ).toHaveText(`${today} - ${today}`);
    await expect(panel).toBeHidden();
  });

  test('shows the complete previous week in the relative preset', async ({
    page,
  }) => {
    const previousWeek = await page.evaluate(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const start = new Date(weekStart);
      start.setDate(weekStart.getDate() - 7);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      const format = (date: Date): string =>
        new Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          timeZone: 'UTC',
        }).format(
          new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
          ),
        );

      return { start: format(start), end: format(end) };
    });
    const rangePicker = page.locator('solaris-date-range-picker').first();

    await rangePicker.locator('.solaris-date-range-picker__trigger').click();

    const panel = page.getByRole('dialog');
    await panel.getByRole('button', { name: 'Semana passada' }).click();

    await expect(
      panel.getByRole('button', { name: 'Semana passada' }),
    ).toHaveAttribute('data-active', '');
    await expect(
      panel.locator('.solaris-date-range-picker__inputs input').nth(0),
    ).toHaveValue(previousWeek.start);
    await expect(
      panel.locator('.solaris-date-range-picker__inputs input').nth(1),
    ).toHaveValue(previousWeek.end);

    await panel.getByRole('button', { name: 'Apply' }).click();
    await rangePicker.locator('.solaris-date-range-picker__trigger').click();

    await expect(
      panel.getByRole('button', { name: 'Semana passada' }),
    ).toHaveAttribute('data-active', '');
  });
});
