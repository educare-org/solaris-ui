// @vitest-environment jsdom
import '@angular/compiler';
import { Component, type Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SolarisSliderComponent } from '@educarehq/solaris-ui';
import {
  cleanupHydrationScenario,
  assertHydrationClean,
  ssrAndHydrate,
  type HydrationScenarioResult,
} from '../../../../testing/hydration/hydration-harness';

function host(
  tag: string,
  template: string,
  imports: Type<unknown>[] = [SolarisSliderComponent, FormsModule],
): { host: Type<unknown>; tag: string } {
  @Component({ selector: tag, standalone: true, imports, template })
  class MatrixHost {
    value = 50;
  }
  return { host: MatrixHost, tag };
}

async function runScenario(
  name: string,
  template: string,
): Promise<HydrationScenarioResult> {
  const tag = `solaris-slider-matrix-${name}`;
  const { host: hostType } = host(tag, template);
  const result = await ssrAndHydrate(hostType, tag);
  assertHydrationClean(result, name);
  return result;
}

describe('SolarisSlider hydration matrix', () => {
  it('bare label hydrates without mismatches', async () => {
    const result = await runScenario(
      'bare',
      `<solaris-slider label="Volume" />`,
    );
    expect(document.querySelector('[role="slider"]')).toBeTruthy();
    cleanupHydrationScenario(result);
  });

  it('valued slider hydrates with matching aria-valuenow', async () => {
    const result = await runScenario(
      'valued',
      `<solaris-slider label="Volume" [(value)]="value" />`,
    );
    expect(
      document.querySelector('[role="slider"]')?.getAttribute('aria-valuenow'),
    ).toBe('50');
    cleanupHydrationScenario(result);
  });

  it('disabled / readonly / invalid states hydrate without mismatches', async () => {
    for (const [name, attrs] of [
      ['disabled', '[disabled]="true"'],
      ['readonly', '[readonly]="true"'],
      ['invalid', '[invalid]="true"'],
    ] as const) {
      const result = await runScenario(
        `state-${name}`,
        `<solaris-slider label="Volume" ${attrs} />`,
      );
      cleanupHydrationScenario(result);
    }
  });

  it('vertical orientation hydrates without mismatches', async () => {
    const result = await runScenario(
      'vertical',
      `<solaris-slider label="Balance" orientation="vertical" [(value)]="value" />`,
    );
    expect(
      document
        .querySelector('[role="slider"]')
        ?.getAttribute('aria-orientation'),
    ).toBe('vertical');
    cleanupHydrationScenario(result);
  });

  it('ticks and tooltip hydrate without mismatches', async () => {
    const result = await runScenario(
      'ticks-tooltip',
      `<solaris-slider label="Brightness" valueDisplay="tooltip" [showTicks]="true" [tickStep]="25" [(value)]="value" />`,
    );
    expect(document.querySelectorAll('.solaris-slider__tick').length).toBe(5);
    expect(document.querySelector('.solaris-slider__tooltip')).toBeTruthy();
    cleanupHydrationScenario(result);
  });

  it('keyboard after hydration updates the value (listener survival)', async () => {
    const tag = 'solaris-slider-matrix-keys';
    @Component({
      selector: tag,
      standalone: true,
      imports: [SolarisSliderComponent, FormsModule],
      template: `<solaris-slider label="Volume" [(value)]="value" />`,
    })
    class KeysHost {
      value = 50;
    }
    const result = await ssrAndHydrate(KeysHost, tag);
    assertHydrationClean(result, 'keys');
    const thumb = document.querySelector('[role="slider"]') as HTMLElement;
    // Why: events must be created via the harness document's own realm
    // (document.createEvent, as the harness does); constructor globals can
    // belong to the server pass and are rejected by dispatchEvent.
    const keydown = document.createEvent('Event');
    keydown.initEvent('keydown', true, true);
    (keydown as unknown as Record<string, unknown>)['key'] = 'ArrowRight';
    thumb.dispatchEvent(keydown);
    result.appRef?.tick();
    expect(thumb.getAttribute('aria-valuenow')).toBe('51');
    cleanupHydrationScenario(result);
  });
});
