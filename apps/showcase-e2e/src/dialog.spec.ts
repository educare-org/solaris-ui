import { test, expect } from '@playwright/test';

test.describe('Dialog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dialog');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('opens basic dialog and closes via Cancel', async ({ page }) => {
    await page.getByRole('button', { name: 'Open basic dialog' }).click();
    const panel = page.locator('.solaris-dialog-panel');
    await expect(panel).toBeVisible();
    await expect(panel.locator('h2')).toHaveText('Dialog Title');

    await panel.getByRole('button', { name: 'Cancel' }).click();
    await expect(panel).not.toBeVisible();
  });

  test('opens basic dialog and closes via Confirm', async ({ page }) => {
    await page.getByRole('button', { name: 'Open basic dialog' }).click();
    const panel = page.locator('.solaris-dialog-panel');
    await expect(panel).toBeVisible();

    await panel.getByRole('button', { name: 'Confirm' }).click();
    await expect(panel).not.toBeVisible();
  });

  test('opens and closes via Escape', async ({ page }) => {
    await page.getByRole('button', { name: 'Open basic dialog' }).click();
    const panel = page.locator('.solaris-dialog-panel');
    await expect(panel).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(panel).not.toBeVisible();
  });

  test('opens confirmation dialog', async ({ page }) => {
    await page.getByRole('button', { name: 'Open confirmation dialog' }).click();
    const panel = page.locator('.solaris-dialog-panel');
    await expect(panel).toBeVisible();

    await panel.getByRole('button', { name: 'Discard' }).click();
    await expect(panel).not.toBeVisible();
  });

  test('opens danger alert dialog', async ({ page }) => {
    await page.getByRole('button', { name: 'Open danger/alert dialog' }).click();
    const panel = page.locator('.solaris-dialog-panel');
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute('role', 'alertdialog');

    await panel.getByRole('button', { name: 'Delete' }).click();
    await expect(panel).not.toBeVisible();
  });

  test('renders actions with different aligns', async ({ page }) => {
    await page.getByRole('button', { name: 'Align start' }).click();
    await expect(page.locator('solaris-dialog-actions')).toHaveAttribute('data-align', 'start');
    await page.keyboard.press('Escape');

    await page.getByRole('button', { name: 'Align center' }).click();
    await expect(page.locator('solaris-dialog-actions')).toHaveAttribute('data-align', 'center');
    await page.keyboard.press('Escape');

    await page.getByRole('button', { name: 'Space between' }).click();
    await expect(page.locator('solaris-dialog-actions')).toHaveAttribute('data-align', 'space-between');
    await page.keyboard.press('Escape');
  });

  test('renders header variant attribute', async ({ page }) => {
    await page.getByRole('button', { name: 'Open danger/alert dialog' }).click();
    const panel = page.locator('.solaris-dialog-panel');
    await expect(panel).toBeVisible();
    await expect(panel.locator('solaris-dialog-header')).toHaveAttribute('data-variant', 'danger');
    await page.keyboard.press('Escape');
  });

  test('renders with outline appearance', async ({ page }) => {
    await page.getByRole('button', { name: 'Outline' }).click();
    await expect(page.locator('solaris-dialog-container')).toHaveAttribute('data-appearance', 'outline');
    await page.keyboard.press('Escape');
  });

  test('opens component dialog', async ({ page }) => {
    await page.getByRole('button', { name: 'Open component dialog' }).click();
    const panel = page.locator('.solaris-dialog-panel');
    await expect(panel).toBeVisible();
    const btns = panel.locator('button');
    await expect(btns).not.toHaveCount(0);
  });
});
