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

    expect(await datePickers.count()).toBeGreaterThanOrEqual(5);
    await expect(page.locator('solaris-date-range-picker')).toHaveCount(2);

    const states = page.locator(
      'app-docs-section[anchor="states"] solaris-date-picker',
    );
    await expect(states).toHaveCount(3);
    await expect(states.nth(0).locator('input')).toBeDisabled();
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
    const rangePicker = page.locator('solaris-date-range-picker').nth(1);

    await rangePicker.locator('.solaris-date-range-picker__trigger').click();

    const panel = page.getByRole('dialog');
    const todayPreset = panel.getByRole('button', { name: /^(Today|Hoje)$/ });
    await todayPreset.scrollIntoViewIfNeeded({ timeout: 10000 });
    await todayPreset.click({ timeout: 10000 });

    await expect(
      panel.getByRole('button', { name: /^(Today|Hoje)$/ }),
    ).toHaveAttribute('data-active', '');
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
});
