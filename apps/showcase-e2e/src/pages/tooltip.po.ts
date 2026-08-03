import type { Page, Locator } from '@playwright/test';

export class TooltipPageObject {
  constructor(private readonly page: Page) {}

  panel(): Locator {
    return this.page.locator('.solaris-tooltip-panel').first();
  }

  hoverTrigger(index = 0): Locator {
    return this.page.locator('[solarisTooltip]').nth(index);
  }

  clickTrigger(index = 0): Locator {
    return this.page.locator('[solarisTooltipTrigger="click"]').nth(index);
  }

  async showViaHover(index = 0): Promise<void> {
    await this.hoverTrigger(index).scrollIntoViewIfNeeded();
    await this.hoverTrigger(index).hover();
    await this.page.waitForTimeout(500);
  }

  async showViaClick(index = 0): Promise<void> {
    await this.clickTrigger(index).scrollIntoViewIfNeeded();
    await this.clickTrigger(index).click();
    await this.page.waitForTimeout(300);
  }

  async assertVisible(): Promise<void> {
    await this.panel().waitFor({ state: 'visible', timeout: 5000 });
  }
}
