// @vitest-environment jsdom
import '@angular/compiler';
import { Component, type Type } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  SolarisDatePickerComponent,
  SolarisDateRangePickerComponent,
  SolarisFormSuffixActionDirective,
} from '@educarehq/solaris-ui';
import {
  cleanupHydrationScenario,
  assertHydrationClean,
  queryAffix,
  ssrAndHydrate,
} from '../../../../testing/hydration/hydration-harness';

const DATE_IMPORTS = [
  SolarisDatePickerComponent,
  FormsModule,
  ReactiveFormsModule,
  SolarisFormSuffixActionDirective,
] as Type<unknown>[];

const RANGE_IMPORTS = [
  SolarisDateRangePickerComponent,
  FormsModule,
  ReactiveFormsModule,
  SolarisFormSuffixActionDirective,
] as Type<unknown>[];

describe('SolarisDatePicker hydration matrix', () => {
  it('bare label with calendar trigger in the suffix affix', async () => {
    const tag = 'solaris-date-matrix-bare';
    @Component({
      selector: tag,
      standalone: true,
      imports: DATE_IMPORTS,
      template: `<solaris-date-picker label="Date" />`,
    })
    class BareHost {}
    const result = await ssrAndHydrate(BareHost, tag);
    assertHydrationClean(result, 'bare');
    expect(
      queryAffix('suffix')?.querySelector(
        '.solaris-date-picker__calendar-trigger',
      ),
    ).toBeTruthy();
    cleanupHydrationScenario(result);
  });

  it('clearable empty / filled keep node structure', async () => {
    for (const [name, value] of [
      ['empty', null],
      ['filled', '2025-01-16'],
    ] as const) {
      const tag = `solaris-date-matrix-${name}`;
      @Component({
        selector: tag,
        standalone: true,
        imports: DATE_IMPORTS,
        template: `<solaris-date-picker
          label="Date"
          [clearable]="true"
          [formControl]="control"
        />`,
      })
      class ValueHost {
        readonly control = new FormControl<string | null>(value);
      }
      const result = await ssrAndHydrate(ValueHost, tag);
      assertHydrationClean(result, name);
      const clear = document.querySelector('.solaris-date-picker__clear');
      expect(clear).toBeTruthy();
      expect(clear?.hasAttribute('hidden')).toBe(name === 'empty');
      cleanupHydrationScenario(result);
    }
  });

  it('projected suffix-action and icon inputs', async () => {
    const tag = 'solaris-date-matrix-projected';
    @Component({
      selector: tag,
      standalone: true,
      imports: DATE_IMPORTS,
      template: `<solaris-date-picker
        label="Date"
        prefix="calendar"
        suffix="info"
      >
        <button type="button" solaris-form-suffix-action>Today</button>
      </solaris-date-picker>`,
    })
    class ProjectedHost {}
    const result = await ssrAndHydrate(ProjectedHost, tag);
    assertHydrationClean(result, 'projected');
    expect(
      queryAffix('suffix')?.querySelector('[solaris-form-suffix-action]')
        ?.textContent,
    ).toContain('Today');
    cleanupHydrationScenario(result);
  });

  it('disabled / readonly states', async () => {
    for (const [name, attrs] of [
      ['disabled', '[disabled]="true"'],
      ['readonly', '[readonly]="true"'],
    ] as const) {
      const tag = `solaris-date-matrix-${name}`;
      @Component({
        selector: tag,
        standalone: true,
        imports: DATE_IMPORTS,
        template: `<solaris-date-picker label="Date" ${attrs} />`,
      })
      class StateHost {}
      const result = await ssrAndHydrate(StateHost, tag);
      assertHydrationClean(result, name);
      cleanupHydrationScenario(result);
    }
  });
});

describe('SolarisDateRangePicker hydration matrix', () => {
  it('bare label with triggers in the suffix affix', async () => {
    const tag = 'solaris-range-matrix-bare';
    @Component({
      selector: tag,
      standalone: true,
      imports: RANGE_IMPORTS,
      template: `<solaris-date-range-picker label="Range" />`,
    })
    class BareHost {}
    const result = await ssrAndHydrate(BareHost, tag);
    assertHydrationClean(result, 'bare');
    expect(
      queryAffix('suffix')?.querySelector(
        '.solaris-date-range-picker__calendar-trigger',
      ),
    ).toBeTruthy();
    cleanupHydrationScenario(result);
  });

  it('inline branch hydrates without the form-field wrapper', async () => {
    const tag = 'solaris-range-matrix-inline';
    @Component({
      selector: tag,
      standalone: true,
      imports: RANGE_IMPORTS,
      template: `<solaris-date-range-picker label="Range" [inline]="true" />`,
    })
    class InlineHost {}
    const result = await ssrAndHydrate(InlineHost, tag);
    assertHydrationClean(result, 'inline');
    expect(document.querySelector('solaris-form-field')).toBeNull();
    cleanupHydrationScenario(result);
  });

  it('clearable empty / filled keep node structure', async () => {
    for (const [name, value] of [
      ['empty', null],
      ['filled', { start: '2025-01-01', end: '2025-01-31' }],
    ] as const) {
      const tag = `solaris-range-matrix-${name}`;
      @Component({
        selector: tag,
        standalone: true,
        imports: RANGE_IMPORTS,
        template: `<solaris-date-range-picker
          label="Range"
          [clearable]="true"
          [formControl]="control"
        />`,
      })
      class ValueHost {
        readonly control = new FormControl(value);
      }
      const result = await ssrAndHydrate(ValueHost, tag);
      assertHydrationClean(result, name);
      cleanupHydrationScenario(result);
    }
  });
});
