import type { Page, Locator } from '@playwright/test';

export class TabsPageObject {
  constructor(private readonly page: Page) {}

  tablist(sectionSelector: string): Locator {
    return this.page.locator(sectionSelector).locator('[role="tablist"]');
  }

  tabs(sectionSelector: string): Locator {
    return this.tablist(sectionSelector).locator('[role="tab"]');
  }

  panels(sectionSelector: string): Locator {
    return this.page.locator(sectionSelector).locator('solaris-tab-panel');
  }

  async clickTab(sectionSelector: string, index: number): Promise<void> {
    await this.tabs(sectionSelector).nth(index).click();
  }

  async assertTabSelected(sectionSelector: string, index: number): Promise<void> {
    await this.tabs(sectionSelector).nth(index).waitFor({ state: 'visible' });
  }
}
