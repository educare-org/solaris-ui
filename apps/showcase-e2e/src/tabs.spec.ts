import { test, expect } from '@playwright/test';
import { TabsPageObject } from './pages/tabs.po';

test.describe('Tabs', () => {
  let tabs: TabsPageObject;

  test.beforeEach(async ({ page }) => {
    await page.goto('/tabs');
    await expect(page.locator('h1')).toBeVisible();
    tabs = new TabsPageObject(page);
  });

  test('activates tab on click', async () => {
    const allTabs = tabs.tabs('app-basic-tabs-example');
    const count = await allTabs.count();
    expect(count).toBeGreaterThanOrEqual(2);

    await allTabs.nth(1).click();
    await expect(allTabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(allTabs.nth(0)).toHaveAttribute('aria-selected', 'false');
  });

  test('switches panel content', async () => {
    const section = 'app-tabs-with-panels-example';
    const panels = tabs.panels(section);

    await tabs.clickTab(section, 1);
    await expect(panels.nth(0)).toHaveAttribute('hidden', '');
    await expect(panels.nth(1)).not.toHaveAttribute('hidden');
  });
});
