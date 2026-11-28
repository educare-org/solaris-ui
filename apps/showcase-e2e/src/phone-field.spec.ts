import { test, expect } from '@playwright/test';
import { PhoneFieldPageObject } from './pages/phone-field.po';

test.describe('Phone Field', () => {
  let phoneField: PhoneFieldPageObject;

  test.beforeEach(async ({ page }) => {
    await page.goto('/forms/phone-field');
    await expect(page.locator('h1')).toBeVisible();
    phoneField = new PhoneFieldPageObject(page);
  });

  test('shows the default calling code in the input placeholder', async () => {
    await expect(phoneField.input()).toHaveAttribute('type', 'tel');
    await expect(phoneField.input()).toHaveAttribute('placeholder', /\+55/);
  });

  test('formats the number with the calling code as the user types', async () => {
    await phoneField.input().fill('11999998888');
    await expect(phoneField.input()).toHaveValue('+55 (11) 99999-8888');
  });

  test('opens the country selector and rewrites the input prefix on selection', async () => {
    await phoneField.openCountrySelector();
    await expect(phoneField.listbox()).toBeVisible();

    const firstCode = (await phoneField.optionCode(0).textContent())?.trim();
    expect(firstCode).toBeTruthy();

    await phoneField.selectCountry(0);
    await expect(phoneField.listbox()).toHaveCount(0);
    // The calling code lives in the editable input now (no fixed dial-code
    // element): typing a national number picks up the selected prefix.
    await phoneField.input().fill('701234567');
    const escaped = (firstCode as string).replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&',
    );
    await expect(phoneField.input()).toHaveValue(new RegExp(`^${escaped}`));
  });

  test('filters countries by search', async () => {
    await phoneField.openCountrySelector();
    await expect(phoneField.listbox()).toBeVisible();

    await phoneField.searchInput().fill('Portugal');
    await expect(phoneField.options()).toHaveCount(1);
    await expect(phoneField.options().nth(0)).toContainText('Portugal');
  });
});
