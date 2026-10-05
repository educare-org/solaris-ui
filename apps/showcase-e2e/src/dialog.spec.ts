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

  test('renders actions with different aligns', async ({ page }) => {
    await page.getByRole('tab', { name: 'Align start' }).click();
    await dialog.open('Open actions dialog');
    await expect(dialog.actions()).toHaveAttribute('data-align', 'start');
    await dialog.closeViaEscape();

    await page.getByRole('tab', { name: 'Align center' }).click();
    await dialog.open('Open actions dialog');
    await expect(dialog.actions()).toHaveAttribute('data-align', 'center');
    await dialog.closeViaEscape();

    await page.getByRole('tab', { name: 'Space between' }).click();
    await dialog.open('Open actions dialog');
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
    const iconBox = await dialog.closeButton().locator('svg').boundingBox();
    expect(iconBox?.width).toBeGreaterThan(12);
    expect(iconBox?.height).toBeGreaterThan(12);
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

  test('anchors dialog to bottom-left placement', async ({ page }) => {
    await page.getByRole('tab', { name: 'Placement bottom-left' }).click();
    await dialog.open('Open placement dialog');
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

  test('keeps header pinned with elevation while scrolling long content', async () => {
    await dialog.open('Open scrollable dialog');
    await expect(dialog.header()).toBeVisible();
    await expect(dialog.header()).not.toHaveAttribute('data-scrolled', '');

    const offsetBefore = await dialog.headerOffsetFromPanelTop();
    await dialog.body().evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });

    await expect(dialog.header()).toHaveAttribute('data-scrolled', '');
    const offsetAfter = await dialog.headerOffsetFromPanelTop();
    expect(Math.abs(offsetAfter - offsetBefore)).toBeLessThan(2);
    await expect(dialog.header()).toBeVisible();
    await expect(dialog.closeButton()).toBeVisible();
    await dialog.closeViaEscape();
    await dialog.assertNotVisible();
  });

  test('keeps footer pinned with elevation while content remains below', async () => {
    await dialog.open('Open scrollable dialog');
    await expect(dialog.footer()).toBeVisible();

    await dialog.body().evaluate((el) => {
      el.scrollTop = el.scrollHeight / 2;
    });

    await expect(dialog.footer()).toHaveAttribute('data-scrolled', '');
    await expect(dialog.footer()).toBeVisible();
    await expect(dialog.header()).toHaveAttribute('data-scrolled', '');

    await dialog.body().evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });

    await expect(dialog.footer()).not.toHaveAttribute('data-scrolled', '');
    await expect(dialog.footer()).toBeVisible();
    await dialog.closeViaEscape();
    await dialog.assertNotVisible();
  });

  test('renders chrome header and actions for component dialog', async () => {
    await dialog.open('Open with header/footer');
    await dialog.assertTitle('Component with chrome');
    await expect(dialog.header()).toBeVisible();
    await expect(dialog.actions()).toBeVisible();
    await dialog.closeViaButton('Confirm');
    await dialog.assertNotVisible();
  });

  test('docks bottom sheet with data-sheet', async () => {
    await dialog.open('Open bottom sheet');
    await expect(dialog.container()).toHaveAttribute('data-sheet', '');
    await expect(dialog.container()).toHaveAttribute(
      'data-placement',
      'bottom',
    );
    await dialog.closeViaEscape();
    await dialog.assertNotVisible();
  });

  test('stacks nested dialogs and Escape closes only the topmost', async ({
    page,
  }) => {
    await dialog.open('Open outer dialog');
    await dialog.assertTitle('Project settings');

    await page.getByRole('button', { name: 'Open nested dialog' }).click();
    await expect(dialog.panel()).toHaveCount(2);

    await dialog.closeViaEscape();
    await expect(dialog.panel()).toHaveCount(1);
    await dialog.assertTitle('Project settings');

    await dialog.closeViaEscape();
    await dialog.assertNotVisible();
  });
});
