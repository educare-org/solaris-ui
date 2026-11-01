// @vitest-environment node
import '@angular/compiler';
import { Component, type Type } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  bootstrapApplication,
  type BootstrapContext,
} from '@angular/platform-browser';
import { provideClientHydration } from '@angular/platform-browser';
import {
  provideServerRendering,
  renderApplication,
} from '@angular/platform-server';
import {
  SolarisRangeSliderComponent,
  provideSolarisTesting,
} from '@educarehq/solaris-ui';

@Component({
  selector: 'solaris-ssr-range-default-host',
  standalone: true,
  imports: [SolarisRangeSliderComponent, ReactiveFormsModule],
  template: `<solaris-range-slider
    label="Price"
    [formControl]="control"
  ></solaris-range-slider>`,
})
class SsrRangeDefaultHostComponent {
  readonly control = new FormControl<number[]>([25, 75]);
}

@Component({
  selector: 'solaris-ssr-range-three-host',
  standalone: true,
  imports: [SolarisRangeSliderComponent, ReactiveFormsModule],
  template: `<solaris-range-slider
    label="Segments"
    [formControl]="control"
    valueDisplay="tooltip"
    [showTicks]="true"
    [tickStep]="25"
  ></solaris-range-slider>`,
})
class SsrRangeThreeHostComponent {
  readonly control = new FormControl<number[]>([10, 50, 90]);
}

@Component({
  selector: 'solaris-ssr-range-three-80-host',
  standalone: true,
  imports: [SolarisRangeSliderComponent, ReactiveFormsModule],
  template: `<solaris-range-slider
    label="Segments"
    [formControl]="control"
    valueDisplay="tooltip"
    [showTicks]="true"
    [tickStep]="25"
  ></solaris-range-slider>`,
})
class SsrRangeThree80HostComponent {
  readonly control = new FormControl<number[]>([10, 50, 80]);
}

@Component({
  selector: 'solaris-ssr-range-min-max-host',
  standalone: true,
  imports: [SolarisRangeSliderComponent, ReactiveFormsModule],
  template: `<solaris-range-slider
    label="Price"
    [formControl]="control"
    [showMinMax]="true"
  ></solaris-range-slider>`,
})
class SsrRangeMinMaxHostComponent {
  readonly control = new FormControl<number[]>([25, 75]);
}

@Component({
  selector: 'solaris-ssr-range-scale-host',
  standalone: true,
  imports: [SolarisRangeSliderComponent, ReactiveFormsModule],
  template: `<solaris-range-slider
    label="Frequency range"
    [formControl]="control"
    [min]="1"
    [max]="1000"
    [scale]="{ kind: 'log', base: 10 }"
    [showTicks]="true"
    [tickValues]="[1, 10, 100, 1000]"
    [distribution]="[2, 5, 9]"
  ></solaris-range-slider>`,
})
class SsrRangeScaleHostComponent {
  readonly control = new FormControl<number[]>([10, 100]);
}

async function renderHost(host: Type<unknown>, tag: string): Promise<string> {
  return renderApplication(
    (context: BootstrapContext) =>
      bootstrapApplication(
        host,
        {
          providers: [
            provideClientHydration(),
            provideServerRendering(),
            provideSolarisTesting(),
          ],
        },
        context,
      ),
    {
      document: `<html><head></head><body><${tag}></${tag}></body></html>`,
      url: '/',
    },
  );
}

function countThumbs(html: string): number {
  return html.match(/role="slider"/g)?.length ?? 0;
}

function countContainers(html: string): number {
  return html.match(/<!--container-->/g)?.length ?? 0;
}

describe('SolarisRangeSlider SSR', () => {
  it('renders two slider roles with server values', async () => {
    const html = await renderHost(
      SsrRangeDefaultHostComponent,
      'solaris-ssr-range-default-host',
    );
    expect(countThumbs(html)).toBe(2);
    expect(html).toContain('aria-valuenow="25"');
    expect(html).toContain('aria-valuenow="75"');
  });

  it('renders three thumbs with tooltips and ticks', async () => {
    const html = await renderHost(
      SsrRangeThreeHostComponent,
      'solaris-ssr-range-three-host',
    );
    expect(countThumbs(html)).toBe(3);
    expect(html).toContain('solaris-range-slider__tooltip');
    expect(html).toContain('solaris-range-slider__tick');
  });

  it('renders the static scale bounds without DOM access', async () => {
    const html = await renderHost(
      SsrRangeMinMaxHostComponent,
      'solaris-ssr-range-min-max-host',
    );
    expect(html).toContain('solaris-range-slider__min');
    expect(html).toContain('solaris-range-slider__max');
    expect(html).toContain('aria-hidden="true"');
  });

  it('renders log scale ticks and distribution without DOM access', async () => {
    const html = await renderHost(
      SsrRangeScaleHostComponent,
      'solaris-ssr-range-scale-host',
    );
    expect(html).toContain('aria-valuenow="10"');
    expect(html).toContain('aria-valuenow="100"');
    expect(html).toContain('solaris-range-slider__bar');
    expect(html).toContain('solaris-range-slider__tick');
  });

  it('keeps identical container structure across value states', async () => {
    const html90 = await renderHost(
      SsrRangeThreeHostComponent,
      'solaris-ssr-range-three-host',
    );
    const html80 = await renderHost(
      SsrRangeThree80HostComponent,
      'solaris-ssr-range-three-80-host',
    );
    expect(html80).toContain('aria-valuenow="80"');
    expect(countContainers(html80)).toBe(countContainers(html90));
  });
});
