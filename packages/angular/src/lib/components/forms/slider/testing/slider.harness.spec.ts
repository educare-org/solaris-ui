import { TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestKey } from '@angular/cdk/testing';

import { SolarisSliderComponent } from '../component/slider.component';
import { SolarisSliderHarness } from './slider.harness';

import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';

@Component({
  selector: 'solaris-slider-harness-host',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider
    label="Volume"
    [value]="40"
    size="lg"
    color="success"
  />`,
})
class HarnessHost {}

@Component({
  selector: 'solaris-slider-min-max-harness-host',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider
    label="Volume"
    [value]="40"
    [showMinMax]="true"
  />`,
})
class MinMaxHarnessHost {}

describe('SolarisSliderHarness', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideSolarisTesting()],
    }).compileComponents();
  });

  it('drives the component through its public harness API', async () => {
    const fixture = TestBed.createComponent(HarnessHost);
    fixture.detectChanges();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(SolarisSliderHarness);

    expect(await harness.getValue()).toBe(40);
    expect(await harness.getValueText()).toContain('40');
    expect(await harness.getOrientation()).toBe('horizontal');
    expect(await harness.getSize()).toBe('lg');
    expect(await harness.getColor()).toBe('success');
    expect(await harness.isDisabled()).toBe(false);
    expect(await harness.isDragging()).toBe(false);

    await harness.focus();
    await harness.sendKey(TestKey.RIGHT_ARROW);
    fixture.detectChanges();
    expect(await harness.getValue()).toBe(41);
    await harness.blur();
  });

  it('reads the static scale bounds through the harness', async () => {
    const hidden = TestBed.createComponent(HarnessHost);
    hidden.detectChanges();
    const hiddenHarness =
      await TestbedHarnessEnvironment.loader(hidden).getHarness(
        SolarisSliderHarness,
      );
    expect(await hiddenHarness.getMinLabel()).toBeNull();
    expect(await hiddenHarness.getMaxLabel()).toBeNull();

    const fixture = TestBed.createComponent(MinMaxHarnessHost);
    fixture.detectChanges();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(SolarisSliderHarness);
    expect(await harness.getMinLabel()).toContain('0');
    expect(await harness.getMaxLabel()).toContain('100');
  });
});
