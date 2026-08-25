import { test, expect } from '@playwright/test';
import { PhoneFieldPageObject } from './pages/phone-field.po';

test.describe('Phone Field', () => {
  let phoneField: PhoneFieldPageObject;

  test.beforeEach(async ({ page }) => {
    await page.goto('/forms/phone-field');
    await expect(page.locator('h1')).toBeVisible();
    phoneField = new PhoneFieldPageObject(page);
  });

  test('shows the fixed dial-code for the default country', async () => {
    await expect(phoneField.input()).toHaveAttribute('type', 'tel');
    await expect(phoneField.dialCode()).toHaveText('+55');
  });

  test('formats the number as the user types', async () => {
    await phoneField.input().fill('11999998888');
    await expect(phoneField.input()).toHaveValue('(11) 99999-8888');
  });

  test('opens the country selector and updates the dial-code on selection', async () => {
    await phoneField.openCountrySelector();
    await expect(phoneField.listbox()).toBeVisible();

    const firstCode = (await phoneField.optionCode(0).textContent())?.trim();
    expect(firstCode).toBeTruthy();

    await phoneField.selectCountry(0);
    await expect(phoneField.listbox()).toHaveCount(0);
    await expect(phoneField.dialCode()).toHaveText(firstCode!);
  });

  test('filters countries by search', async () => {
    await phoneField.openCountrySelector();
    await expect(phoneField.listbox()).toBeVisible();

    await phoneField.searchInput().fill('Portugal');
    await expect(phoneField.options()).toHaveCount(1);
    await expect(phoneField.options().nth(0)).toContainText('Portugal');
  });
});
