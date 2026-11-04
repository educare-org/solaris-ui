import { ComponentHarness } from '@angular/cdk/testing';

export class SolarisContentCarouselHarness extends ComponentHarness {
  static readonly hostSelector = 'solaris-content-carousel';

  private readonly prevButton = this.locatorFor(
    '.solaris-content-carousel__arrow--prev',
  );
  private readonly nextButton = this.locatorFor(
    '.solaris-content-carousel__arrow--next',
  );
  private readonly dots = this.locatorForAll('.solaris-content-carousel__dot');

  async goToPrevious(): Promise<void> {
    await (await this.prevButton()).click();
  }

  async goToNext(): Promise<void> {
    await (await this.nextButton()).click();
  }

  async goToSlide(index: number): Promise<void> {
    const buttons = await this.dots();
    await buttons[index]?.click();
  }

  async getSlideCount(): Promise<number> {
    return (await this.dots()).length;
  }

  async getActiveSlideLabel(): Promise<string | null> {
    const active = await this.locatorFor(
      '.solaris-content-carousel__slide[data-active]',
    )();
    return active.getAttribute('aria-label');
  }

  async getDividerSide(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-divider');
  }

  async isPreviousDisabled(): Promise<boolean> {
    const button = await this.prevButton();
    return (await button.getAttribute('aria-disabled')) !== null;
  }

  async isNextDisabled(): Promise<boolean> {
    const button = await this.nextButton();
    return (await button.getAttribute('aria-disabled')) !== null;
  }
}
