import type { Page, Locator } from '@playwright/test';

export class DropdownMenuPageObject {
  constructor(private readonly page: Page) {}

  trigger(index = 0): Locator {
    return this.page.locator('[solaris-dropdown-menu-trigger]').nth(index);
  }

  menu(): Locator {
    return this.page.locator('.solaris-dropdown-menu__wrapper');
  }

  async open(index = 0): Promise<void> {
    await this.trigger(index).click();
    await this.menu().waitFor({ state: 'visible' });
  }

  async selectItem(name: string): Promise<void> {
    await this.page.getByRole('menuitem', { name }).click();
  }
}
