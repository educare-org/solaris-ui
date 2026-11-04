import { TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestKey } from '@angular/cdk/testing';

import { SolarisRangeSliderComponent } from '../component/range-slider.component';
import { SolarisRangeSliderHarness } from './range-slider.harness';

import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';

@Component({
  selector: 'solaris-range-slider-harness-host',
  standalone: true,
  imports: [SolarisRangeSliderComponent],
  template: `<solaris-range-slider label="Price" [values]="[20, 80]" />`,
})
class HarnessHost {}

@Component({
  selector: 'solaris-range-slider-min-max-harness-host',
  standalone: true,
  imports: [SolarisRangeSliderComponent],
  template: `<solaris-range-slider
    label="Price"
    [values]="[20, 80]"
    [showMinMax]="true"
  />`,
})
class MinMaxHarnessHost {}

@Component({
  selector: 'solaris-range-slider-scale-harness-host',
  standalone: true,
  imports: [SolarisRangeSliderComponent],
  template: `<solaris-range-slider
    label="Frequency range"
    [min]="1"
    [max]="1000"
    [values]="[10, 100]"
    [scale]="{ kind: 'log', base: 10 }"
    [showTicks]="true"
    [tickValues]="[1, 10, 100, 1000]"
    [distribution]="[2, 5, 9]"
    [zones]="[{ from: 0, to: 33, color: 'success' }]"
  />`,
})
class ScaleHarnessHost {}

describe('SolarisRangeSliderHarness', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideSolarisTesting()],
    }).compileComponents();
  });

  it('drives the component through its public harness API', async () => {
    const fixture = TestBed.createComponent(HarnessHost);
    fixture.detectChanges();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(SolarisRangeSliderHarness);

    expect(await harness.getThumbCount()).toBe(2);
    expect(await harness.getValues()).toEqual([20, 80]);
    expect(await harness.getOrientation()).toBe('horizontal');
    expect(await harness.isDisabled()).toBe(false);
    expect(await harness.isDragging()).toBe(false);

    await harness.focusThumb(1);
    await harness.sendKey(1, TestKey.LEFT_ARROW);
    fixture.detectChanges();
    expect(await harness.getValues()).toEqual([20, 79]);
  });

  it('reads the static scale bounds through the harness', async () => {
    const hidden = TestBed.createComponent(HarnessHost);
    hidden.detectChanges();
    const hiddenHarness = await TestbedHarnessEnvironment.loader(
      hidden,
    ).getHarness(SolarisRangeSliderHarness);
    expect(await hiddenHarness.getMinLabel()).toBeNull();
    expect(await hiddenHarness.getMaxLabel()).toBeNull();

    const fixture = TestBed.createComponent(MinMaxHarnessHost);
    fixture.detectChanges();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(SolarisRangeSliderHarness);
    expect(await harness.getMinLabel()).toContain('0');
    expect(await harness.getMaxLabel()).toContain('100');
  });

  it('reads scale ticks, distribution bars and first-thumb color through the harness', async () => {
    const fixture = TestBed.createComponent(ScaleHarnessHost);
    fixture.detectChanges();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(SolarisRangeSliderHarness);
    expect(await harness.getValues()).toEqual([10, 100]);
    expect(await harness.getTickCount()).toBe(4);
    expect(await harness.getDistributionBarCount()).toBe(3);
    expect(await harness.getColor()).toBe('success');
  });
});
