// @vitest-environment jsdom
import '@angular/compiler';
import { Component, type Type } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  SolarisFormFieldComponent,
  SolarisFormPrefixDirective,
  SolarisFormSuffixActionDirective,
  SolarisFormSuffixDirective,
} from '@educarehq/solaris-ui';
import {
  cleanupHydrationScenario,
  assertHydrationClean,
  queryAffix,
  ssrAndHydrate,
} from '../../../../testing/hydration/hydration-harness';

async function runScenario(
  name: string,
  template: string,
  hostExtra?: { control?: FormControl<string | null> },
): Promise<void> {
  const tag = `solaris-form-field-matrix-${name}`;
  @Component({
    selector: tag,
    standalone: true,
    imports: [
      SolarisFormFieldComponent,
      SolarisFormPrefixDirective,
      SolarisFormSuffixDirective,
      SolarisFormSuffixActionDirective,
      FormsModule,
      ReactiveFormsModule,
    ],
    template,
  })
  class MatrixHost {
    readonly control = hostExtra?.control ?? new FormControl<string | null>('');
  }
  const result = await ssrAndHydrate(MatrixHost as Type<unknown>, tag);
  assertHydrationClean(result, name);
  cleanupHydrationScenario(result);
}

describe('SolarisFormField hydration matrix (direct use)', () => {
  it('input only', async () => {
    await runScenario(
      'input',
      `<solaris-form-field label="Name"><input type="text" /></solaris-form-field>`,
    );
  });

  it('projected prefix / suffix / suffix-action land in the affixes', async () => {
    const tag = 'solaris-form-field-matrix-placement';
    @Component({
      selector: tag,
      standalone: true,
      imports: [
        SolarisFormFieldComponent,
        SolarisFormPrefixDirective,
        SolarisFormSuffixDirective,
        SolarisFormSuffixActionDirective,
      ],
      template: `<solaris-form-field label="Value">
        <span solaris-form-prefix>$</span>
        <input type="text" />
        <span solaris-form-suffix>USD</span>
        <button type="button" solaris-form-suffix-action>Go</button>
      </solaris-form-field>`,
    })
    class PlacementHost {}
    const result = await ssrAndHydrate(PlacementHost, tag);
    assertHydrationClean(result, 'placement');
    expect(queryAffix('prefix')?.textContent).toContain('$');
    expect(queryAffix('suffix')?.textContent).toContain('USD');
    expect(
      queryAffix('suffix')?.querySelector('[solaris-form-suffix-action]'),
    ).toBeTruthy();
    expect(
      document.querySelector('.solaris-form-field__control input'),
    ).toBeTruthy();
    cleanupHydrationScenario(result);
  });

  it('prefix / suffix icon inputs render in the affixes', async () => {
    const tag = 'solaris-form-field-matrix-inputs';
    @Component({
      selector: tag,
      standalone: true,
      imports: [SolarisFormFieldComponent],
      template: `<solaris-form-field
        label="Search"
        prefix="search"
        suffix="info"
        ><input type="text"
      /></solaris-form-field>`,
    })
    class InputsHost {}
    const result = await ssrAndHydrate(InputsHost, tag);
    assertHydrationClean(result, 'icon-inputs');
    expect(
      queryAffix('prefix')?.querySelector('[solaris-form-prefix]'),
    ).toBeTruthy();
    expect(
      queryAffix('suffix')?.querySelector('[solaris-form-suffix]'),
    ).toBeTruthy();
    cleanupHydrationScenario(result);
  });

  it('loading / disabled / error states', async () => {
    for (const [name, attrs] of [
      ['loading', '[loading]="true"'],
      ['disabled', '[disabled]="true"'],
      ['error', 'error="Bad value" [invalid]="true"'],
      ['hint', 'hint="Helpful hint"'],
    ] as const) {
      await runScenario(
        `state-${name}`,
        `<solaris-form-field label="Value" ${attrs}><input type="text" /></solaris-form-field>`,
      );
    }
  });
});
