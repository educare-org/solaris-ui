import type { Page, Locator } from '@playwright/test';

export class DropdownMenuPageObject {
  constructor(private readonly page: Page) {}

  trigger(index = 0): Locator {
    return this.page
      .locator(
        'app-docs-section[anchor="examples"] [solaris-dropdown-menu-trigger]',
      )
      .nth(index);
  }

  menu(): Locator {
    return this.page.locator('.solaris-dropdown-menu__wrapper');
  }

  async open(index = 0): Promise<void> {
    await this.trigger(index).scrollIntoViewIfNeeded({ timeout: 10000 });
    await this.trigger(index).click({ timeout: 10000 });
    await this.menu().waitFor({ state: 'visible', timeout: 10000 });
  }

  async selectItem(name: string): Promise<void> {
    const item = this.page.getByRole('menuitem', { name });
    await item.waitFor({ state: 'visible', timeout: 10000 });
    await item.click({ timeout: 10000 });
  }
}
