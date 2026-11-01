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
  SolarisSliderComponent,
  provideSolarisTesting,
} from '@educarehq/solaris-ui';

@Component({
  selector: 'solaris-ssr-slider-default-host',
  standalone: true,
  imports: [SolarisSliderComponent, ReactiveFormsModule],
  template: `<solaris-slider
    label="Volume"
    [formControl]="control"
  ></solaris-slider>`,
})
class SsrSliderDefaultHostComponent {
  readonly control = new FormControl<number>(50);
}

@Component({
  selector: 'solaris-ssr-slider-valued-host',
  standalone: true,
  imports: [SolarisSliderComponent, ReactiveFormsModule],
  template: `<solaris-slider
    label="Volume"
    [formControl]="control"
    valueDisplay="tooltip"
    [showTicks]="true"
    [tickStep]="25"
  ></solaris-slider>`,
})
class SsrSliderValuedHostComponent {
  readonly control = new FormControl<number>(75);
}

@Component({
  selector: 'solaris-ssr-slider-valued-25-host',
  standalone: true,
  imports: [SolarisSliderComponent, ReactiveFormsModule],
  template: `<solaris-slider
    label="Volume"
    [formControl]="control"
    valueDisplay="tooltip"
    [showTicks]="true"
    [tickStep]="25"
  ></solaris-slider>`,
})
class SsrSliderValued25HostComponent {
  readonly control = new FormControl<number>(25);
}

@Component({
  selector: 'solaris-ssr-slider-min-max-host',
  standalone: true,
  imports: [SolarisSliderComponent, ReactiveFormsModule],
  template: `<solaris-slider
    label="Volume"
    [formControl]="control"
    [showMinMax]="true"
  ></solaris-slider>`,
})
class SsrSliderMinMaxHostComponent {
  readonly control = new FormControl<number>(50);
}

@Component({
  selector: 'solaris-ssr-slider-vertical-host',
  standalone: true,
  imports: [SolarisSliderComponent, ReactiveFormsModule],
  template: `<solaris-slider
    label="Balance"
    orientation="vertical"
    [formControl]="control"
    [disabled]="true"
  ></solaris-slider>`,
})
class SsrSliderVerticalHostComponent {
  readonly control = new FormControl<number>(30);
}

@Component({
  selector: 'solaris-ssr-slider-scale-host',
  standalone: true,
  imports: [SolarisSliderComponent, ReactiveFormsModule],
  template: `<solaris-slider
    label="Frequency"
    [formControl]="control"
    [min]="1"
    [max]="1000"
    [scale]="{ kind: 'log', base: 10 }"
    [showTicks]="true"
    [tickValues]="[1, 10, 100, 1000]"
    [distribution]="[2, 5, 9]"
  ></solaris-slider>`,
})
class SsrSliderScaleHostComponent {
  readonly control = new FormControl<number>(10);
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

function countContainers(html: string): number {
  return html.match(/<!--container-->/g)?.length ?? 0;
}

describe('SolarisSlider SSR', () => {
  it('renders the slider role with server value', async () => {
    const html = await renderHost(
      SsrSliderDefaultHostComponent,
      'solaris-ssr-slider-default-host',
    );
    expect(html).toContain('role="slider"');
    expect(html).toContain('aria-valuenow="50"');
    expect(html).toContain('Volume');
  });

  it('renders tooltip and ticks for the valued variant', async () => {
    const html = await renderHost(
      SsrSliderValuedHostComponent,
      'solaris-ssr-slider-valued-host',
    );
    expect(html).toContain('aria-valuenow="75"');
    expect(html).toContain('solaris-slider__tooltip');
    expect(html).toContain('solaris-slider__tick');
  });

  it('renders vertical disabled state without errors', async () => {
    const html = await renderHost(
      SsrSliderVerticalHostComponent,
      'solaris-ssr-slider-vertical-host',
    );
    expect(html).toContain('aria-valuenow="30"');
    expect(html).toContain('data-orientation="vertical"');
    expect(html).toContain('data-disabled');
  });

  it('renders the static scale bounds without DOM access', async () => {
    const html = await renderHost(
      SsrSliderMinMaxHostComponent,
      'solaris-ssr-slider-min-max-host',
    );
    expect(html).toContain('solaris-slider__min');
    expect(html).toContain('solaris-slider__max');
    expect(html).toContain('aria-hidden="true"');
  });

  it('renders log scale ticks and distribution without DOM access', async () => {
    const html = await renderHost(
      SsrSliderScaleHostComponent,
      'solaris-ssr-slider-scale-host',
    );
    expect(html).toContain('aria-valuenow="10"');
    expect(html).toContain('solaris-slider__bar');
    expect(html).toContain('solaris-slider__tick');
  });

  it('keeps identical container structure across value states', async () => {
    const html75 = await renderHost(
      SsrSliderValuedHostComponent,
      'solaris-ssr-slider-valued-host',
    );
    const html25 = await renderHost(
      SsrSliderValued25HostComponent,
      'solaris-ssr-slider-valued-25-host',
    );
    expect(html25).toContain('aria-valuenow="25"');
    expect(countContainers(html25)).toBe(countContainers(html75));
  });
});
