// @vitest-environment jsdom
import '@angular/compiler';
import { Component, type Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SolarisRangeSliderComponent } from '@educarehq/solaris-ui';
import {
  cleanupHydrationScenario,
  assertHydrationClean,
  ssrAndHydrate,
  type HydrationScenarioResult,
} from '../../../../testing/hydration/hydration-harness';

function host(
  tag: string,
  template: string,
  imports: Type<unknown>[] = [SolarisRangeSliderComponent, FormsModule],
): { host: Type<unknown>; tag: string } {
  @Component({ selector: tag, standalone: true, imports, template })
  class MatrixHost {
    values = [25, 75];
  }
  return { host: MatrixHost, tag };
}

async function runScenario(
  name: string,
  template: string,
): Promise<HydrationScenarioResult> {
  const tag = `solaris-range-matrix-${name}`;
  const { host: hostType } = host(tag, template);
  const result = await ssrAndHydrate(hostType, tag);
  assertHydrationClean(result, name);
  return result;
}

function thumbValues(): (string | null)[] {
  return Array.from(document.querySelectorAll('[role="slider"]')).map((thumb) =>
    thumb.getAttribute('aria-valuenow'),
  );
}

describe('SolarisRangeSlider hydration matrix', () => {
  it('bare range hydrates with two thumbs', async () => {
    const result = await runScenario(
      'bare',
      `<solaris-range-slider label="Price" />`,
    );
    expect(thumbValues()).toEqual(['25', '75']);
    cleanupHydrationScenario(result);
  });

  it('bound values hydrate in order', async () => {
    const result = await runScenario(
      'valued',
      `<solaris-range-slider label="Price" [(values)]="values" />`,
    );
    expect(thumbValues()).toEqual(['25', '75']);
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
        `<solaris-range-slider label="Price" ${attrs} />`,
      );
      cleanupHydrationScenario(result);
    }
  });

  it('three thumbs with ticks hydrate without mismatches', async () => {
    const result = await runScenario(
      'three',
      `<solaris-range-slider label="Segments" [values]="[10, 50, 90]" [showTicks]="true" [tickStep]="10" />`,
    );
    expect(thumbValues()).toEqual(['10', '50', '90']);
    expect(
      document.querySelectorAll('.solaris-range-slider__tick').length,
    ).toBe(11);
    cleanupHydrationScenario(result);
  });

  it('keyboard on the second thumb after hydration moves only it (listener survival)', async () => {
    const tag = 'solaris-range-matrix-keys';
    @Component({
      selector: tag,
      standalone: true,
      imports: [SolarisRangeSliderComponent, FormsModule],
      template: `<solaris-range-slider label="Price" [(values)]="values" />`,
    })
    class KeysHost {
      values = [25, 75];
    }
    const result = await ssrAndHydrate(KeysHost, tag);
    assertHydrationClean(result, 'keys');
    const thumbs = Array.from(
      document.querySelectorAll('[role="slider"]'),
    ) as HTMLElement[];
    // Why: events must be created via the harness document's own realm
    // (document.createEvent, as the harness does); constructor globals can
    // belong to the server pass and are rejected by dispatchEvent.
    const keydown = document.createEvent('Event');
    keydown.initEvent('keydown', true, true);
    (keydown as unknown as Record<string, unknown>)['key'] = 'ArrowLeft';
    thumbs[1].dispatchEvent(keydown);
    result.appRef?.tick();
    expect(thumbValues()).toEqual(['25', '74']);
    cleanupHydrationScenario(result);
  });
});
