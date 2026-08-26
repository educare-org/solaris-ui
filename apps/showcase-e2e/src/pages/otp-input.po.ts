import type { Page, Locator } from '@playwright/test';

export class OtpInputPageObject {
  constructor(private readonly page: Page) {}

  field(index = 0): Locator {
    return this.page.locator('solaris-otp-input').nth(index);
  }

  boxes(index = 0): Locator {
    return this.field(index).locator('.solaris-otp-input__box');
  }

  box(index = 0, boxIndex = 0): Locator {
    return this.boxes(index).nth(boxIndex);
  }
}
