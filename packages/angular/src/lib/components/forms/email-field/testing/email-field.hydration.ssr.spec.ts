// @vitest-environment jsdom
import '@angular/compiler';
import { Component, type Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  SolarisEmailFieldComponent,
  SolarisFormPrefixDirective,
  SolarisFormSuffixActionDirective,
  SolarisFormSuffixDirective,
} from '@educarehq/solaris-ui';
import {
  cleanupHydrationScenario,
  assertHydrationClean,
  queryAffix,
  ssrAndHydrate,
  type HydrationScenarioResult,
} from '../../../../testing/hydration/hydration-harness';

function host(
  tag: string,
  template: string,
  imports: Type<unknown>[] = [
    SolarisEmailFieldComponent,
    FormsModule,
    SolarisFormPrefixDirective,
    SolarisFormSuffixDirective,
    SolarisFormSuffixActionDirective,
  ],
): { host: Type<unknown>; tag: string } {
  @Component({ selector: tag, standalone: true, imports, template })
  class MatrixHost {
    email = '';
  }
  return { host: MatrixHost, tag };
}

function hostInstance(result: HydrationScenarioResult): { email: string } {
  const components = (
    result.appRef as unknown as { components: { instance: unknown }[] }
  )?.components;
  return components?.[0]?.instance as { email: string };
}

async function runScenario(
  name: string,
  template: string,
): Promise<HydrationScenarioResult> {
  const tag = `solaris-email-matrix-${name}`;
  const { host: hostType } = host(tag, template);
  const result = await ssrAndHydrate(hostType, tag);
  assertHydrationClean(result, name);
  return result;
}

describe('SolarisEmailField hydration matrix', () => {
  it('bare label hydrates without mismatches', async () => {
    const result = await runScenario(
      'bare',
      `<solaris-email-field label="E-mail" />`,
    );
    expect(document.querySelector('input[type="email"]')).toBeTruthy();
    cleanupHydrationScenario(result);
  });

  it('empty ngModel hydrates with hidden clear button in the suffix affix', async () => {
    const result = await runScenario(
      'empty',
      `<solaris-email-field label="E-mail" name="email" [clearable]="true" [(ngModel)]="email" />`,
    );
    const clear = document.querySelector('.solaris-email-field__clear');
    expect(clear).toBeTruthy();
    expect(clear?.hasAttribute('hidden')).toBe(true);
    expect(queryAffix('suffix')?.contains(clear)).toBe(true);
    cleanupHydrationScenario(result);
  });

  it('consumer layout (ngModel + suffix-action CTA) hydrates with exact placement', async () => {
    const result = await runScenario(
      'consumer',
      `<solaris-email-field label="E-mail" name="email" [clearable]="true" [(ngModel)]="email">
        <button type="button" solaris-form-suffix-action [disabled]="!email">Continuar</button>
      </solaris-email-field>`,
    );
    const suffixAffix = queryAffix('suffix');
    const cta = suffixAffix?.querySelector('[solaris-form-suffix-action]');
    const clear = suffixAffix?.querySelector('.solaris-email-field__clear');
    expect(cta?.textContent).toContain('Continuar');
    expect(clear).toBeTruthy();
    expect(
      document.querySelector(
        '.solaris-form-field__control input[type="email"]',
      ),
    ).toBeTruthy();
    cleanupHydrationScenario(result);
  });

  it('prefilled value hydrates with visible clear button', async () => {
    const tag = 'solaris-email-matrix-filled';
    @Component({
      selector: tag,
      standalone: true,
      imports: [SolarisEmailFieldComponent, FormsModule],
      template: `<solaris-email-field
        label="E-mail"
        [clearable]="true"
        [(ngModel)]="email"
      />`,
    })
    class FilledHost {
      email = 'user@example.com';
    }
    const result = await ssrAndHydrate(FilledHost, tag);
    assertHydrationClean(result, 'filled');
    const clear = document.querySelector('.solaris-email-field__clear');
    expect(clear?.hasAttribute('hidden')).toBe(false);
    expect(
      (document.querySelector('input[type="email"]') as HTMLInputElement)
        ?.value,
    ).toBe('user@example.com');
    cleanupHydrationScenario(result);
  });

  it('input after hydration propagates to ngModel (listener survival)', async () => {
    const tag = 'solaris-email-matrix-replay';
    @Component({
      selector: tag,
      standalone: true,
      imports: [
        SolarisEmailFieldComponent,
        FormsModule,
        SolarisFormSuffixActionDirective,
      ],
      template: `<solaris-email-field
        label="E-mail"
        name="email"
        [clearable]="true"
        [(ngModel)]="email"
      >
        <button type="button" solaris-form-suffix-action [disabled]="!email">
          Continuar
        </button>
      </solaris-email-field>`,
    })
    class ReplayHost {
      email = '';
    }
    const result = await ssrAndHydrate(ReplayHost, tag, {
      replayInput: {
        selector: 'input[type="email"]',
        value: 'replayed@example.com',
      },
    });
    assertHydrationClean(result, 'replay');
    expect(hostInstance(result).email).toBe('replayed@example.com');
    expect(
      document
        .querySelector('.solaris-email-field__clear')
        ?.hasAttribute('hidden'),
    ).toBe(false);
    cleanupHydrationScenario(result);
  });

  it('disabled / readonly / loading states hydrate without mismatches', async () => {
    for (const [name, attrs] of [
      ['disabled', '[disabled]="true"'],
      ['readonly', '[readonly]="true"'],
      ['loading', '[loading]="true"'],
    ] as const) {
      const result = await runScenario(
        `state-${name}`,
        `<solaris-email-field label="E-mail" ${attrs} />`,
      );
      cleanupHydrationScenario(result);
    }
  });

  it('error state hydrates without mismatches', async () => {
    const result = await runScenario(
      'error',
      `<solaris-email-field label="E-mail" error="Invalid email." [invalid]="true" />`,
    );
    expect(document.querySelector('.solaris-form-field__error')).toBeTruthy();
    cleanupHydrationScenario(result);
  });

  it('prefix / suffix icon inputs render in the affixes', async () => {
    const result = await runScenario(
      'icons',
      `<solaris-email-field label="E-mail" prefix="mail" suffix="info" />`,
    );
    expect(
      queryAffix('prefix')?.querySelector('[solaris-form-prefix]'),
    ).toBeTruthy();
    expect(
      queryAffix('suffix')?.querySelector('[solaris-form-suffix]'),
    ).toBeTruthy();
    cleanupHydrationScenario(result);
  });

  it('projected prefix / suffix render once (no double icon)', async () => {
    const result = await runScenario(
      'projected',
      `<solaris-email-field label="E-mail" prefix="mail" suffix="info">
        <span solaris-form-prefix>$</span>
        <span solaris-form-suffix>@x.com</span>
      </solaris-email-field>`,
    );
    expect(
      queryAffix('prefix')?.querySelectorAll('[solaris-form-prefix]').length,
    ).toBe(1);
    const suffixIcons = Array.from(
      queryAffix('suffix')?.querySelectorAll('[solaris-form-suffix]') ?? [],
    ).filter((node) => !node.classList.contains('solaris-email-field__clear'));
    expect(suffixIcons.length).toBe(1);
    expect(queryAffix('prefix')?.textContent).toContain('$');
    expect(queryAffix('suffix')?.textContent).toContain('@x.com');
    cleanupHydrationScenario(result);
  });
});
