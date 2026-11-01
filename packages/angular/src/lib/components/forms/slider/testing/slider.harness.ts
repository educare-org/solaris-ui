import { ComponentHarness, TestKey } from '@angular/cdk/testing';

export class SolarisSliderHarness extends ComponentHarness {
  static readonly hostSelector = 'solaris-slider';

  private readonly thumb = this.locatorFor('[role="slider"]');

  async getValue(): Promise<number | null> {
    const now = await (await this.thumb()).getAttribute('aria-valuenow');
    return now === null ? null : Number(now);
  }

  async getValueText(): Promise<string | null> {
    return (await this.thumb()).getAttribute('aria-valuetext');
  }

  async getOrientation(): Promise<string | null> {
    return (await this.thumb()).getAttribute('aria-orientation');
  }

  async getSize(): Promise<string | null> {
    return (await this.host()).getAttribute('data-size');
  }

  async getColor(): Promise<string | null> {
    return (await this.host()).getAttribute('data-color');
  }

  async isDisabled(): Promise<boolean> {
    return (await (await this.host()).getAttribute('data-disabled')) !== null;
  }

  async isDragging(): Promise<boolean> {
    return (await (await this.host()).getAttribute('data-dragging')) !== null;
  }

  async getMinLabel(): Promise<string | null> {
    const label = await this.locatorForOptional('.solaris-slider__min')();
    return label ? label.text() : null;
  }

  async getMaxLabel(): Promise<string | null> {
    const label = await this.locatorForOptional('.solaris-slider__max')();
    return label ? label.text() : null;
  }

  async getTickCount(): Promise<number> {
    return (await this.locatorForAll('.solaris-slider__tick')()).length;
  }

  async getDistributionBarCount(): Promise<number> {
    return (await this.locatorForAll('.solaris-slider__bar')()).length;
  }

  async focus(): Promise<void> {
    await (await this.thumb()).focus();
  }

  async blur(): Promise<void> {
    await (await this.thumb()).blur();
  }

  async sendKey(key: TestKey): Promise<void> {
    await (await this.thumb()).sendKeys(key);
  }
}
