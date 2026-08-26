import { test, expect } from '@playwright/test';
import { OtpInputPageObject } from './pages/otp-input.po';

test.describe('OTP Input', () => {
  let otp: OtpInputPageObject;

  test.beforeEach(async ({ page }) => {
    await page.goto('/forms/otp-input');
    await expect(page.locator('h1')).toBeVisible();
    otp = new OtpInputPageObject(page);
  });

  test('renders the configured number of boxes', async () => {
    await expect(otp.boxes()).toHaveCount(6);
  });

  test('fills a box and advances focus as the user types', async () => {
    await otp.box(0, 0).fill('1');
    await expect(otp.box(0, 0)).toHaveValue('1');
    await expect(otp.box(0, 1)).toBeFocused();
  });

  test('supports masked display', async () => {
    await otp.box(3, 0).fill('5');
    await expect(otp.box(3, 0)).toHaveValue('•');
  });

  test('emits completed when the code reaches maxLength', async () => {
    for (let i = 0; i < 6; i++) {
      await otp.box(6, i).fill(String(i + 1));
    }
    await expect(otp.page.getByText('Code completed!')).toBeVisible();
  });
});
