// @vitest-environment jsdom
import '@angular/compiler';
import { Component, type Type } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  SolarisFormSuffixActionDirective,
  SolarisMultiSelectComponent,
  SolarisOptionComponent,
  SolarisSelectComponent,
} from '@educarehq/solaris-ui';
import {
  cleanupHydrationScenario,
  assertHydrationClean,
  queryAffix,
  ssrAndHydrate,
} from '../../../../testing/hydration/hydration-harness';

const SELECT_IMPORTS = [
  SolarisSelectComponent,
  SolarisOptionComponent,
  FormsModule,
  ReactiveFormsModule,
  SolarisFormSuffixActionDirective,
] as Type<unknown>[];

const MULTI_IMPORTS = [
  SolarisMultiSelectComponent,
  SolarisOptionComponent,
  FormsModule,
  ReactiveFormsModule,
  SolarisFormSuffixActionDirective,
] as Type<unknown>[];

describe('SolarisSelect hydration matrix', () => {
  it('clearable empty / filled keep node structure', async () => {
    for (const [name, value] of [
      ['empty', null],
      ['filled', 'a'],
    ] as const) {
      const tag = `solaris-select-matrix-${name}`;
      @Component({
        selector: tag,
        standalone: true,
        imports: SELECT_IMPORTS,
        template: `<solaris-select
          label="Choice"
          [clearable]="true"
          [formControl]="control"
          ><solaris-option value="a">Option A</solaris-option
          ><solaris-option value="b">Option B</solaris-option></solaris-select
        >`,
      })
      class ValueHost {
        readonly control = new FormControl<string | null>(value);
      }
      const result = await ssrAndHydrate(ValueHost, tag);
      assertHydrationClean(result, name);
      const clear = document.querySelector('.solaris-select__clear');
      expect(clear?.hasAttribute('hidden')).toBe(name === 'empty');
      cleanupHydrationScenario(result);
    }
  });

  it('icon inputs and projected action land in the suffix affix', async () => {
    const tag = 'solaris-select-matrix-affix';
    @Component({
      selector: tag,
      standalone: true,
      imports: SELECT_IMPORTS,
      template: `<solaris-select label="Choice" prefix="search" suffix="info">
        <button type="button" solaris-form-suffix-action>All</button
        ><solaris-option value="a">Option A</solaris-option
        ><solaris-option value="b">Option B</solaris-option>
      </solaris-select>`,
    })
    class AffixHost {}
    const result = await ssrAndHydrate(AffixHost, tag);
    assertHydrationClean(result, 'affix');
    expect(
      queryAffix('prefix')?.querySelector('[solaris-form-prefix]'),
    ).toBeTruthy();
    expect(queryAffix('suffix')?.textContent).toContain('All');
    cleanupHydrationScenario(result);
  });

  it('disabled / loading states', async () => {
    for (const [name, attrs] of [
      ['disabled', '[disabled]="true"'],
      ['loading', '[loading]="true"'],
    ] as const) {
      const tag = `solaris-select-matrix-${name}`;
      @Component({
        selector: tag,
        standalone: true,
        imports: SELECT_IMPORTS,
        template: `<solaris-select label="Choice" ${attrs}
          ><solaris-option value="a">Option A</solaris-option
          ><solaris-option value="b">Option B</solaris-option></solaris-select
        >`,
      })
      class StateHost {}
      const result = await ssrAndHydrate(StateHost, tag);
      assertHydrationClean(result, name);
      cleanupHydrationScenario(result);
    }
  });
});

describe('SolarisMultiSelect hydration matrix', () => {
  it('clearable empty / filled keep node structure', async () => {
    for (const [name, value] of [
      ['empty', []],
      ['filled', ['a']],
    ] as const) {
      const tag = `solaris-multi-matrix-${name}`;
      @Component({
        selector: tag,
        standalone: true,
        imports: MULTI_IMPORTS,
        template: `<solaris-multi-select label="Choices" [formControl]="control"
          ><solaris-option value="a">Option A</solaris-option
          ><solaris-option value="b"
            >Option B</solaris-option
          ></solaris-multi-select
        >`,
      })
      class ValueHost {
        readonly control = new FormControl<string[]>([...value]);
      }
      const result = await ssrAndHydrate(ValueHost, tag);
      assertHydrationClean(result, name);
      cleanupHydrationScenario(result);
    }
  });

  it('icon inputs land in the affixes', async () => {
    const tag = 'solaris-multi-matrix-affix';
    @Component({
      selector: tag,
      standalone: true,
      imports: MULTI_IMPORTS,
      template: `<solaris-multi-select
        label="Choices"
        prefix="search"
        suffix="info"
        ><solaris-option value="a">Option A</solaris-option
        ><solaris-option value="b"
          >Option B</solaris-option
        ></solaris-multi-select
      >`,
    })
    class AffixHost {}
    const result = await ssrAndHydrate(AffixHost, tag);
    assertHydrationClean(result, 'affix');
    expect(
      queryAffix('prefix')?.querySelector('[solaris-form-prefix]'),
    ).toBeTruthy();
    expect(
      queryAffix('suffix')?.querySelector('[solaris-form-suffix]'),
    ).toBeTruthy();
    cleanupHydrationScenario(result);
  });
});
