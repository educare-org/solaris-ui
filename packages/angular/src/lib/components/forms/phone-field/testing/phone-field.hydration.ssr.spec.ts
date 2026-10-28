// @vitest-environment jsdom
import '@angular/compiler';
import { Component, type Type } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  SolarisFormSuffixActionDirective,
  SolarisFormSuffixDirective,
  SolarisPhoneFieldComponent,
} from '@educarehq/solaris-ui';
import {
  cleanupHydrationScenario,
  assertHydrationClean,
  queryAffix,
  ssrAndHydrate,
  type HydrationScenarioResult,
} from '../../../../testing/hydration/hydration-harness';

const BASE_IMPORTS = [
  SolarisPhoneFieldComponent,
  FormsModule,
  ReactiveFormsModule,
  SolarisFormSuffixDirective,
  SolarisFormSuffixActionDirective,
] as Type<unknown>[];

async function runScenario(
  name: string,
  template: string,
): Promise<HydrationScenarioResult> {
  const tag = `solaris-phone-matrix-${name}`;
  @Component({
    selector: tag,
    standalone: true,
    imports: BASE_IMPORTS,
    template,
  })
  class MatrixHost {
    readonly control = new FormControl<string>('');
    phone = '';
  }
  const result = await ssrAndHydrate(MatrixHost as Type<unknown>, tag);
  assertHydrationClean(result, name);
  return result;
}

describe('SolarisPhoneField hydration matrix', () => {
  it('bare label', async () => {
    const result = await runScenario(
      'bare',
      `<solaris-phone-field label="Phone" />`,
    );
    expect(document.querySelector('input[type="tel"]')).toBeTruthy();
    cleanupHydrationScenario(result);
  });

  it('clearable empty hides the clear button in the suffix affix', async () => {
    const result = await runScenario(
      'empty',
      `<solaris-phone-field label="Phone" [clearable]="true" [formControl]="control" />`,
    );
    const clear = document.querySelector('.solaris-phone-field__clear');
    expect(clear).toBeTruthy();
    expect(clear?.hasAttribute('hidden')).toBe(true);
    expect(queryAffix('suffix')?.contains(clear)).toBe(true);
    cleanupHydrationScenario(result);
  });

  it('country selector renders in the prefix affix', async () => {
    const result = await runScenario(
      'country',
      `<solaris-phone-field label="Phone" />`,
    );
    expect(
      queryAffix('prefix')?.querySelector('.solaris-phone-field__country'),
    ).toBeTruthy();
    cleanupHydrationScenario(result);
  });

  it('suffix icon input renders in the suffix affix', async () => {
    const result = await runScenario(
      'suffix-icon',
      `<solaris-phone-field label="Phone" suffix="info" />`,
    );
    expect(
      queryAffix('suffix')?.querySelector('[solaris-form-suffix]'),
    ).toBeTruthy();
    cleanupHydrationScenario(result);
  });

  it('projected suffix-action lands in the suffix affix', async () => {
    const result = await runScenario(
      'action',
      `<solaris-phone-field label="Phone"><button type="button" solaris-form-suffix-action>Call</button></solaris-phone-field>`,
    );
    expect(
      queryAffix('suffix')?.querySelector('[solaris-form-suffix-action]')
        ?.textContent,
    ).toContain('Call');
    cleanupHydrationScenario(result);
  });

  it('input after hydration propagates (listener survival)', async () => {
    const tag = 'solaris-phone-matrix-replay';
    @Component({
      selector: tag,
      standalone: true,
      imports: BASE_IMPORTS,
      template: `<solaris-phone-field
        label="Phone"
        [clearable]="true"
        [(ngModel)]="phone"
      />`,
    })
    class ReplayHost {
      phone = '';
    }
    const result = await ssrAndHydrate(ReplayHost, tag, {
      replayInput: { selector: 'input[type="tel"]', value: '+16502530000' },
    });
    assertHydrationClean(result, 'replay');
    const instance = (
      result.appRef as unknown as { components: { instance: ReplayHost }[] }
    ).components[0].instance;
    expect(instance.phone).toBe('+16502530000');
    cleanupHydrationScenario(result);
  });

  it('disabled / readonly / loading states', async () => {
    for (const [name, attrs] of [
      ['disabled', '[disabled]="true"'],
      ['readonly', '[readonly]="true"'],
      ['loading', '[loading]="true"'],
    ] as const) {
      const result = await runScenario(
        `state-${name}`,
        `<solaris-phone-field label="Phone" ${attrs} />`,
      );
      cleanupHydrationScenario(result);
    }
  });
});
