import { ComponentHarness } from '@angular/cdk/testing';

export class SolarisPaginationHarness extends ComponentHarness {
  static readonly hostSelector = 'solaris-pagination';

  private readonly range = this.locatorFor('.solaris-pagination__range');

  async getRangeLabel(): Promise<string | null> {
    try {
      const range = await this.range();
      return range.text();
    } catch {
      return null;
    }
  }

  async goToFirst(): Promise<void> {
    await (
      await this.locatorFor(
        '.solaris-pagination__button[aria-label="First page"]',
      )()
    ).click();
  }

  async goToPrevious(): Promise<void> {
    await (
      await this.locatorFor(
        '.solaris-pagination__button[aria-label="Previous page"]',
      )()
    ).click();
  }

  async goToNext(): Promise<void> {
    await (
      await this.locatorFor(
        '.solaris-pagination__button[aria-label="Next page"]',
      )()
    ).click();
  }

  async goToLast(): Promise<void> {
    await (
      await this.locatorFor(
        '.solaris-pagination__button[aria-label="Last page"]',
      )()
    ).click();
  }

  async isNextDisabled(): Promise<boolean> {
    const button = await this.locatorFor(
      '.solaris-pagination__button[aria-label="Next page"]',
    )();
    return (await button.getAttribute('disabled')) !== null;
  }
}
