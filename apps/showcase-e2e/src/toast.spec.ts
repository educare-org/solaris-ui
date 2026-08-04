import { test, expect } from '@playwright/test';
import { ToastPageObject } from './pages/toast.po';

test.describe('Toast', () => {
  let toast: ToastPageObject;

  test.beforeEach(async ({ page }) => {
    await page.goto('/feedback/toast');
    await expect(page.locator('h1')).toBeVisible();
    toast = new ToastPageObject(page);
  });

  test('shows toast on trigger click', async () => {
    await toast.show('Neutral');
    await toast.assertVisible();
  });

  test('dismisses all toasts', async () => {
    await toast.show('Neutral');
    await toast.assertVisible();

    await toast.dismissAll();
    await toast.assertNotVisible();
  });
});
