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
    const trigger = this.hoverTrigger(index);
    await trigger.scrollIntoViewIfNeeded({ timeout: 10000 });
    await trigger.hover({ timeout: 10000 });
  }

  async showViaClick(index = 0): Promise<void> {
    const trigger = this.clickTrigger(index);
    await trigger.scrollIntoViewIfNeeded({ timeout: 10000 });
    await trigger.click({ timeout: 10000 });
  }

  async assertVisible(): Promise<void> {
    await this.panel().waitFor({ state: 'visible', timeout: 10000 });
  }
}
