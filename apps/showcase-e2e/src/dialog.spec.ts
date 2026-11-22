import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

import { DialogPageObject } from './pages/dialog.po';

test.describe('Dialog', () => {
  let dialog: DialogPageObject;

  test.beforeEach(async ({ page }) => {
    await page.goto('/overlay/dialog');
    await expect(page.locator('h1')).toBeVisible();
    dialog = new DialogPageObject(page);
  });

  test('opens basic dialog and closes via Cancel', async () => {
    await dialog.openInSection('examples', 'Open dialog');
    await dialog.assertTitle('Dialog Title');

    await dialog.closeViaButton('Cancel');
    await dialog.assertNotVisible();
  });

  test('opens basic dialog and closes via Confirm', async () => {
    await dialog.openInSection('examples', 'Open dialog');
    await dialog.closeViaButton('Confirm');
    await dialog.assertNotVisible();
  });

  test('opens and closes via Escape', async () => {
    await dialog.openInSection('examples', 'Open dialog');
    await dialog.closeViaEscape();
    await dialog.assertNotVisible();
  });

  test('opens confirmation dialog', async ({ page }) => {
    await page.getByRole('tab', { name: 'Confirmation' }).click();
    await dialog.openInSection('examples', 'Open dialog');
    await dialog.assertTitle('Discard changes?');
    await dialog.closeViaButton('Discard');
    await dialog.assertNotVisible();
  });

  test('opens danger alert dialog', async ({ page }) => {
    await page.getByRole('tab', { name: 'Danger' }).click();
    await dialog.openInSection('examples', 'Open dialog');
    await expect(dialog.panel()).toHaveAttribute('role', 'alertdialog');
    await dialog.assertTitle('Delete account');
    await dialog.closeViaButton('Delete');
    await dialog.assertNotVisible();
  });

  test('renders actions with different aligns', async ({ page }) => {
    const cases: Array<[string, string]> = [
      ['Align start', 'start'],
      ['Align center', 'center'],
      ['Align end', 'end'],
      ['Space between', 'space-between'],
    ];
    for (const [tab, align] of cases) {
      await page.getByRole('tab', { name: tab }).click();
      await expect(
        page.locator('#actions solaris-tab-panel[data-active="true"]'),
      ).toBeVisible();
      await dialog.openInSection('actions', 'Open actions dialog');
      await expect(dialog.actions()).toHaveAttribute('data-align', align);
      await dialog.closeViaEscape();
    }
  });

  test('renders header variant attribute', async ({ page }) => {
    await page.getByRole('tab', { name: 'Danger' }).click();
    await dialog.openInSection('examples', 'Open dialog');
    await expect(dialog.header()).toHaveAttribute('data-variant', 'danger');
    await dialog.closeViaEscape();
  });

  test('closes via container close button', async () => {
    await dialog.openInSection('examples', 'Open dialog');
    await expect(dialog.closeButton()).toBeVisible();
    const iconBox = await dialog.closeButton().locator('svg').boundingBox();
    expect(iconBox?.width).toBeGreaterThan(12);
    expect(iconBox?.height).toBeGreaterThan(12);
    await dialog.closeButton().click();
    await dialog.assertNotVisible();
  });

  test('moves initial focus to the first action', async () => {
    await dialog.openInSection('examples', 'Open dialog');
    await expect(
      dialog.panel().getByRole('button', { name: 'Cancel' }),
    ).toBeFocused();
    await dialog.closeViaEscape();
  });

  test('anchors dialog to bottom-left placement', async ({ page }) => {
    await page.getByRole('tab', { name: 'Placement bottom-left' }).click();
    await expect(
      page.locator('#placement solaris-tab-panel[data-active="true"]'),
    ).toBeVisible();
    await dialog.openInSection('placement', 'Open placement dialog');
    await expect(dialog.container()).toHaveAttribute(
      'data-placement',
      'bottom-left',
    );
    await dialog.closeViaEscape();
  });

  test('renders dialog without separators when disabled', async ({ page }) => {
    await page.getByRole('tab', { name: 'No separators' }).click();
    await dialog.openInSection('behavior', 'Open dialog');
    await expect(dialog.header()).not.toHaveAttribute('data-separator', '');
    await expect(dialog.actions()).not.toHaveAttribute('data-separator', '');
    await dialog.closeViaEscape();
  });

  test('keeps header pinned with elevation while scrolling long content', async ({
    page,
  }) => {
    await page.getByRole('tab', { name: 'Scrollable' }).click();
    await dialog.openInSection('component', 'Open dialog');
    await dialog.assertTitle('Terms and conditions');
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

  test('keeps footer pinned with elevation while content remains below', async ({
    page,
  }) => {
    await page.getByRole('tab', { name: 'Scrollable' }).click();
    await dialog.openInSection('component', 'Open dialog');
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

  test('renders chrome header and actions for component dialog', async ({
    page,
  }) => {
    await page.getByRole('tab', { name: 'With chrome' }).click();
    await dialog.openInSection('component', 'Open dialog');
    await dialog.assertTitle('Component with chrome');
    await expect(dialog.header()).toBeVisible();
    await expect(dialog.actions()).toBeVisible();
    await dialog.closeViaButton('Confirm');
    await dialog.assertNotVisible();
  });

  test('docks bottom sheet with data-sheet', async () => {
    await dialog.openInSection('sheet', 'Open bottom sheet');
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
    await dialog.openInSection('nested', 'Open outer dialog');
    await dialog.assertTitle('Project settings');

    await page.getByRole('button', { name: 'Open nested dialog' }).click();
    await expect(dialog.panel()).toHaveCount(2);

    await dialog.closeViaEscape();
    await expect(dialog.panel()).toHaveCount(1);
    await dialog.assertTitle('Project settings');

    await dialog.closeViaEscape();
    await dialog.assertNotVisible();
  });

  test.describe('section navigation', () => {
    test.beforeEach(async () => {
      await dialog.openInSection('flow', 'Open sectioned dialog');
    });

    test('shows the side nav and switches sections on desktop', async () => {
      await expect(dialog.navSide()).toBeVisible();
      await dialog.nav().getByRole('button', { name: 'Publish' }).click();
      await expect(
        dialog.panel().getByRole('heading', { name: 'Publish' }),
      ).toBeVisible();
    });

    test('moves focus with arrow keys and activates with Enter', async ({
      page,
    }) => {
      await dialog
        .nav()
        .getByRole('button', { name: 'Create audiobook' })
        .focus();
      await page.keyboard.press('ArrowDown');
      await expect(
        dialog.nav().getByRole('button', { name: 'Publish' }),
      ).toBeFocused();
      // Focus moved without activating: still on the upload step.
      await expect(
        dialog.panel().getByRole('heading', { name: 'Step 1: Upload' }),
      ).toBeVisible();
      await page.keyboard.press('Enter');
      await expect(
        dialog.panel().getByRole('heading', { name: 'Publish' }),
      ).toBeVisible();
    });

    test('keeps the nav footer border aligned with the wizard footer', async () => {
      const [navBox, wizardBox] = await Promise.all([
        dialog.navFooter().boundingBox(),
        dialog.wizardFooter().boundingBox(),
      ]);
      expect(Math.abs((navBox?.y ?? 0) - (wizardBox?.y ?? 0))).toBeLessThan(2);
    });

    test('collapses the side nav into a select on small viewports', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 360, height: 800 });
      await expect(dialog.navSide()).toBeHidden();
      await expect(dialog.navSelect()).toBeVisible();
      // The mobile trigger keeps the active section icon.
      await expect(
        dialog
          .navSelect()
          .locator('.solaris-form-field__affix--prefix solaris-icon svg'),
      ).toBeVisible();

      await dialog.navSelect().locator('.solaris-select__trigger').click();
      await page.locator('solaris-option', { hasText: 'Publish' }).click();
      await expect(
        dialog.panel().getByRole('heading', { name: 'Publish' }),
      ).toBeVisible();
      await dialog.closeViaEscape();
      await dialog.assertNotVisible();
    });
  });

  test.describe('high contrast', () => {
    test('renders the sectioned dialog with high-contrast tokens', async ({
      page,
    }) => {
      await page
        .locator('app-theme-toggle')
        .getByLabel('High contrast')
        .first()
        .click();
      await expect
        .poll(
          async () =>
            page.evaluate(() => document.documentElement.dataset['theme']),
          { timeout: 5000 },
        )
        .toMatch(/high-contrast/);
      await dialog.openInSection('flow', 'Open sectioned dialog');
      await expect(dialog.nav()).toBeVisible();
      await expect(
        dialog.nav().getByRole('button', { name: 'Create audiobook' }),
      ).toHaveAttribute('aria-current', 'true');
    });
  });

  test.describe('accessibility', () => {
    test('sectioned dialog has no detectable violations (light)', async ({
      page,
    }) => {
      await dialog.openInSection('flow', 'Open sectioned dialog');
      const light = await new AxeBuilder({ page })
        .include('.solaris-dialog-panel')
        .analyze();
      expect(light.violations).toEqual([]);
      await dialog.closeViaEscape();
    });

    test('sectioned dialog has no detectable violations (dark)', async ({
      page,
    }) => {
      await page
        .locator('app-theme-toggle')
        .getByLabel('Dark theme')
        .first()
        .click();
      await dialog.openInSection('flow', 'Open sectioned dialog');
      const dark = await new AxeBuilder({ page })
        .include('.solaris-dialog-panel')
        .analyze();
      expect(dark.violations).toEqual([]);
      await dialog.closeViaEscape();
    });
  });
});
