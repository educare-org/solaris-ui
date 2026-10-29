import { ComponentHarness } from '@angular/cdk/testing';

export class SolarisMediaCarouselHarness extends ComponentHarness {
  static readonly hostSelector = 'solaris-media-carousel';

  private readonly prevButton = this.locatorFor(
    '.solaris-media-carousel__arrow--prev',
  );
  private readonly nextButton = this.locatorFor(
    '.solaris-media-carousel__arrow--next',
  );
  private readonly dots = this.locatorForAll('.solaris-media-carousel__dot');

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
      '.solaris-media-carousel__slide[data-active]',
    )();
    return active.getAttribute('aria-label');
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
