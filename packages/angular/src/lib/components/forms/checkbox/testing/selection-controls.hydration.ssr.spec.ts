// @vitest-environment jsdom
import '@angular/compiler';
import { Component, type Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  SolarisCheckboxComponent,
  SolarisFormFieldComponent,
  SolarisFormPrefixDirective,
  SolarisFormSuffixDirective,
  SolarisInputDirective,
  SolarisRadioComponent,
  SolarisSwitchComponent,
  SolarisTextareaDirective,
} from '@educarehq/solaris-ui';
import {
  cleanupHydrationScenario,
  assertHydrationClean,
  ssrAndHydrate,
} from '../../../../testing/hydration/hydration-harness';

async function runScenario(
  name: string,
  host: Type<unknown>,
  tag: string,
): Promise<void> {
  const result = await ssrAndHydrate(host, tag);
  assertHydrationClean(result, name);
  cleanupHydrationScenario(result);
}

describe('Selection controls hydration matrix', () => {
  it('checkbox unchecked / checked / disabled', async () => {
    for (const [name, attrs] of [
      ['unchecked', ''],
      ['checked', '[checked]="true"'],
      ['disabled', '[disabled]="true"'],
    ] as const) {
      const tag = `solaris-checkbox-matrix-${name}`;
      @Component({
        selector: tag,
        standalone: true,
        imports: [SolarisCheckboxComponent, FormsModule],
        template: `<solaris-checkbox label="Accept" ${attrs} />`,
      })
      class CheckboxHost {}
      await runScenario(`checkbox-${name}`, CheckboxHost, tag);
    }
  });

  it('radio unchecked / checked / disabled', async () => {
    for (const [name, attrs] of [
      ['unchecked', ''],
      ['checked', '[checked]="true"'],
      ['disabled', '[disabled]="true"'],
    ] as const) {
      const tag = `solaris-radio-matrix-${name}`;
      @Component({
        selector: tag,
        standalone: true,
        imports: [SolarisRadioComponent, FormsModule],
        template: `<solaris-radio
          label="Option"
          name="choice"
          value="a"
          ${attrs}
        />`,
      })
      class RadioHost {}
      await runScenario(`radio-${name}`, RadioHost, tag);
    }
  });

  it('switch off / on / disabled', async () => {
    for (const [name, attrs] of [
      ['off', ''],
      ['on', '[checked]="true"'],
      ['disabled', '[disabled]="true"'],
    ] as const) {
      const tag = `solaris-switch-matrix-${name}`;
      @Component({
        selector: tag,
        standalone: true,
        imports: [SolarisSwitchComponent, FormsModule],
        template: `<solaris-switch label="Alerts" ${attrs} />`,
      })
      class SwitchHost {}
      await runScenario(`switch-${name}`, SwitchHost, tag);
    }
  });
});

describe('Native directives hydration matrix', () => {
  it('solaris-input with projected affixes, counter and states', async () => {
    for (const [name, template] of [
      [
        'basic',
        `<solaris-form-field label="Name"><input solaris-input type="text" /></solaris-form-field>`,
      ],
      [
        'affix',
        `<solaris-form-field label="Amount"><span solaris-form-prefix>$</span><input solaris-input type="text" inputmode="decimal" /><span solaris-form-suffix>USD</span></solaris-form-field>`,
      ],
      [
        'counter',
        `<solaris-form-field label="Bio"><textarea solaris-textarea rows="3" maxlength="120"></textarea></solaris-form-field>`,
      ],
      [
        'disabled',
        `<solaris-form-field label="Name"><input solaris-input type="text" disabled /></solaris-form-field>`,
      ],
    ] as const) {
      const tag = `solaris-native-matrix-${name}`;
      @Component({
        selector: tag,
        standalone: true,
        imports: [
          SolarisFormFieldComponent,
          SolarisFormPrefixDirective,
          SolarisFormSuffixDirective,
          SolarisInputDirective,
          SolarisTextareaDirective,
        ],
        template,
      })
      class NativeHost {}
      await runScenario(`native-${name}`, NativeHost, tag);
    }
  });
});
