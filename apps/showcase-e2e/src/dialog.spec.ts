import { test, expect } from '@playwright/test';
import { DialogPageObject } from './pages/dialog.po';

test.describe('Dialog', () => {
  let dialog: DialogPageObject;

  test.beforeEach(async ({ page }) => {
    await page.goto('/overlay/dialog');
    await expect(page.locator('h1')).toBeVisible();
    dialog = new DialogPageObject(page);
  });

  test('opens basic dialog and closes via Cancel', async () => {
    await dialog.open('Open basic dialog');
    await dialog.assertTitle('Dialog Title');

    await dialog.closeViaButton('Cancel');
    await dialog.assertNotVisible();
  });

  test('opens basic dialog and closes via Confirm', async () => {
    await dialog.open('Open basic dialog');
    await dialog.closeViaButton('Confirm');
    await dialog.assertNotVisible();
  });

  test('opens and closes via Escape', async () => {
    await dialog.open('Open basic dialog');
    await dialog.closeViaEscape();
    await dialog.assertNotVisible();
  });

  test('opens confirmation dialog', async () => {
    await dialog.open('Open confirmation dialog');
    await dialog.closeViaButton('Discard');
    await dialog.assertNotVisible();
  });

  test('opens danger alert dialog', async () => {
    await dialog.open('Open danger/alert dialog');
    await expect(dialog.panel()).toHaveAttribute('role', 'alertdialog');
    await dialog.closeViaButton('Delete');
    await dialog.assertNotVisible();
  });

  test('renders actions with different aligns', async () => {
    await dialog.open('Align start');
    await expect(dialog.actions()).toHaveAttribute('data-align', 'start');
    await dialog.closeViaEscape();

    await dialog.open('Align center');
    await expect(dialog.actions()).toHaveAttribute('data-align', 'center');
    await dialog.closeViaEscape();

    await dialog.open('Space between');
    await expect(dialog.actions()).toHaveAttribute(
      'data-align',
      'space-between',
    );
    await dialog.closeViaEscape();
  });

  test('renders header variant attribute', async () => {
    await dialog.open('Open danger/alert dialog');
    await expect(dialog.header()).toHaveAttribute('data-variant', 'danger');
    await dialog.closeViaEscape();
  });

  test('closes via container close button', async () => {
    await dialog.open('Open basic dialog');
    await expect(dialog.closeButton()).toBeVisible();
    await dialog.closeButton().click();
    await dialog.assertNotVisible();
  });

  test('moves initial focus to the first action', async () => {
    await dialog.open('Open basic dialog');
    await expect(
      dialog.panel().getByRole('button', { name: 'Cancel' }),
    ).toBeFocused();
    await dialog.closeViaEscape();
  });

  test('anchors dialog to bottom-left placement', async () => {
    await dialog.open('Placement bottom-left');
    await expect(dialog.container()).toHaveAttribute(
      'data-placement',
      'bottom-left',
    );
    await dialog.closeViaEscape();
  });

  test('renders dialog without separators when disabled', async () => {
    await dialog.open('No separators');
    await expect(dialog.header()).not.toHaveAttribute('data-separator', '');
    await expect(dialog.actions()).not.toHaveAttribute('data-separator', '');
    await dialog.closeViaEscape();
  });
});
