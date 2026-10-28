// @vitest-environment jsdom
import '@angular/compiler';
import { Component, type Type } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  SolarisFormSuffixActionDirective,
  SolarisPasswordFieldComponent,
} from '@educarehq/solaris-ui';
import {
  cleanupHydrationScenario,
  assertHydrationClean,
  queryAffix,
  ssrAndHydrate,
  type HydrationScenarioResult,
} from '../../../../testing/hydration/hydration-harness';

const BASE_IMPORTS = [
  SolarisPasswordFieldComponent,
  FormsModule,
  ReactiveFormsModule,
  SolarisFormSuffixActionDirective,
] as Type<unknown>[];

async function runScenario(
  name: string,
  template: string,
): Promise<HydrationScenarioResult> {
  const tag = `solaris-password-matrix-${name}`;
  @Component({
    selector: tag,
    standalone: true,
    imports: BASE_IMPORTS,
    template,
  })
  class MatrixHost {
    readonly control = new FormControl<string>('');
  }
  const result = await ssrAndHydrate(MatrixHost as Type<unknown>, tag);
  assertHydrationClean(result, name);
  return result;
}

describe('SolarisPasswordField hydration matrix', () => {
  it('bare label with default toggle', async () => {
    const result = await runScenario(
      'bare',
      `<solaris-password-field label="Password" />`,
    );
    expect(
      queryAffix('suffix')?.querySelector('.solaris-password-field__toggle'),
    ).toBeTruthy();
    cleanupHydrationScenario(result);
  });

  it('toggle hidden when showToggle is false', async () => {
    const tag = 'solaris-password-matrix-no-toggle';
    @Component({
      selector: tag,
      standalone: true,
      imports: BASE_IMPORTS,
      template: `<solaris-password-field
        label="Password"
        [showToggle]="false"
      />`,
    })
    class NoToggleHost {}
    const result = await ssrAndHydrate(NoToggleHost, tag);
    assertHydrationClean(result, 'no-toggle');
    expect(
      document.querySelector('.solaris-password-field__toggle'),
    ).toBeNull();
    cleanupHydrationScenario(result);
  });

  it('toggle click flips the input type after hydration', async () => {
    const tag = 'solaris-password-matrix-interact';
    @Component({
      selector: tag,
      standalone: true,
      imports: BASE_IMPORTS,
      template: `<solaris-password-field label="Password" />`,
    })
    class InteractHost {}
    const result = await ssrAndHydrate(InteractHost, tag);
    assertHydrationClean(result, 'interact');
    const input = document.querySelector<HTMLInputElement>(
      '.solaris-form-field__control input',
    );
    expect(input?.getAttribute('type')).toBe('password');
    (
      document.querySelector(
        '.solaris-password-field__toggle',
      ) as HTMLButtonElement
    )?.click();
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(input?.getAttribute('type')).toBe('text');
    cleanupHydrationScenario(result);
  });

  it('icon inputs render in the affixes', async () => {
    const result = await runScenario(
      'icons',
      `<solaris-password-field label="Password" prefix="lock" suffix="info" />`,
    );
    expect(
      queryAffix('prefix')?.querySelector('[solaris-form-prefix]'),
    ).toBeTruthy();
    expect(
      queryAffix('suffix')?.querySelector('[solaris-form-suffix]'),
    ).toBeTruthy();
    cleanupHydrationScenario(result);
  });

  it('strength block hydrates with a value', async () => {
    const tag = 'solaris-password-matrix-strength';
    @Component({
      selector: tag,
      standalone: true,
      imports: BASE_IMPORTS,
      template: `<solaris-password-field
        label="Password"
        [showStrength]="true"
        [formControl]="control"
      />`,
    })
    class StrengthHost {
      readonly control = new FormControl<string>('s3cret-pw!');
    }
    const result = await ssrAndHydrate(StrengthHost, tag);
    assertHydrationClean(result, 'strength');
    expect(
      document.querySelector('.solaris-password-field__strength'),
    ).toBeTruthy();
    cleanupHydrationScenario(result);
  });

  it('disabled / loading states', async () => {
    for (const [name, attrs] of [
      ['disabled', '[disabled]="true"'],
      ['loading', '[loading]="true"'],
    ] as const) {
      const result = await runScenario(
        `state-${name}`,
        `<solaris-password-field label="Password" ${attrs} />`,
      );
      cleanupHydrationScenario(result);
    }
  });
});
