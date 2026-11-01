import { ComponentHarness, TestKey } from '@angular/cdk/testing';

export class SolarisRangeSliderHarness extends ComponentHarness {
  static readonly hostSelector = 'solaris-range-slider';

  private readonly thumbs = this.locatorForAll('[role="slider"]');

  async getThumbCount(): Promise<number> {
    return (await this.thumbs()).length;
  }

  async getValues(): Promise<number[]> {
    const thumbs = await this.thumbs();
    const raw = await Promise.all(
      thumbs.map((thumb) => thumb.getAttribute('aria-valuenow')),
    );
    return raw.map((value) => (value === null ? NaN : Number(value)));
  }

  async getValueTexts(): Promise<(string | null)[]> {
    const thumbs = await this.thumbs();
    return Promise.all(
      thumbs.map((thumb) => thumb.getAttribute('aria-valuetext')),
    );
  }

  async getOrientation(): Promise<string | null> {
    const thumbs = await this.thumbs();
    return thumbs.length > 0
      ? thumbs[0].getAttribute('aria-orientation')
      : null;
  }

  async isDisabled(): Promise<boolean> {
    return (await (await this.host()).getAttribute('data-disabled')) !== null;
  }

  async isDragging(): Promise<boolean> {
    return (await (await this.host()).getAttribute('data-dragging')) !== null;
  }

  async getMinLabel(): Promise<string | null> {
    const label = await this.locatorForOptional('.solaris-range-slider__min')();
    return label ? label.text() : null;
  }

  async getMaxLabel(): Promise<string | null> {
    const label = await this.locatorForOptional('.solaris-range-slider__max')();
    return label ? label.text() : null;
  }

  async focusThumb(index: number): Promise<void> {
    await (await this.thumbs())[index]?.focus();
  }

  async sendKey(index: number, key: TestKey): Promise<void> {
    await (await this.thumbs())[index]?.sendKeys(key);
  }
}
