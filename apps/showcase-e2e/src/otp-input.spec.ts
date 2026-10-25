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
});
