// @vitest-environment jsdom
import '@angular/compiler';
import { Component, type Type } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  SolarisFileUploadComponent,
  SolarisFormSuffixActionDirective,
  SolarisOtpInputComponent,
} from '@educarehq/solaris-ui';
import {
  cleanupHydrationScenario,
  assertHydrationClean,
  queryAffix,
  ssrAndHydrate,
} from '../../../../testing/hydration/hydration-harness';

describe('SolarisOtpInput hydration matrix', () => {
  it('empty / filled keep node structure', async () => {
    for (const [name, value] of [
      ['empty', ''],
      ['filled', '123456'],
    ] as const) {
      const tag = `solaris-otp-matrix-${name}`;
      @Component({
        selector: tag,
        standalone: true,
        imports: [SolarisOtpInputComponent, FormsModule, ReactiveFormsModule],
        template: `<solaris-otp-input label="Code" [formControl]="control" />`,
      })
      class ValueHost {
        readonly control = new FormControl<string>(value);
      }
      const result = await ssrAndHydrate(ValueHost, tag);
      assertHydrationClean(result, name);
      expect(
        document.querySelectorAll('.solaris-otp-input__box').length,
      ).toBeGreaterThan(0);
      cleanupHydrationScenario(result);
    }
  });

  it('projected suffix-action lands in the suffix affix', async () => {
    const tag = 'solaris-otp-matrix-action';
    @Component({
      selector: tag,
      standalone: true,
      imports: [
        SolarisOtpInputComponent,
        FormsModule,
        ReactiveFormsModule,
        SolarisFormSuffixActionDirective,
      ],
      template: `<solaris-otp-input label="Code">
        <button type="button" solaris-form-suffix-action>Resend</button>
      </solaris-otp-input>`,
    })
    class ActionHost {}
    const result = await ssrAndHydrate(ActionHost, tag);
    assertHydrationClean(result, 'action');
    expect(queryAffix('suffix')?.textContent).toContain('Resend');
    cleanupHydrationScenario(result);
  });

  it('disabled state', async () => {
    const tag = 'solaris-otp-matrix-disabled';
    @Component({
      selector: tag,
      standalone: true,
      imports: [SolarisOtpInputComponent, FormsModule, ReactiveFormsModule],
      template: `<solaris-otp-input label="Code" [disabled]="true" />`,
    })
    class DisabledHost {}
    const result = await ssrAndHydrate(DisabledHost, tag);
    assertHydrationClean(result, 'disabled');
    cleanupHydrationScenario(result);
  });
});

describe('SolarisFileUpload hydration matrix', () => {
  it('dropzone variant hydrates', async () => {
    const tag = 'solaris-upload-matrix-dropzone';
    @Component({
      selector: tag,
      standalone: true,
      imports: [SolarisFileUploadComponent],
      template: `<solaris-file-upload label="Document" />`,
    })
    class DropzoneHost {}
    const result = await ssrAndHydrate(DropzoneHost, tag);
    assertHydrationClean(result, 'dropzone');
    expect(
      document.querySelector('.solaris-file-upload__dropzone'),
    ).toBeTruthy();
    cleanupHydrationScenario(result);
  });

  it('url variant hydrates the secondary form-field with action button', async () => {
    const tag = 'solaris-upload-matrix-url';
    @Component({
      selector: tag,
      standalone: true,
      imports: [SolarisFileUploadComponent],
      template: `<solaris-file-upload label="Document" [allowUrl]="true" />`,
    })
    class UrlHost {}
    const result = await ssrAndHydrate(UrlHost, tag);
    assertHydrationClean(result, 'url');
    const actionButtons = Array.from(
      document.querySelectorAll(
        '.solaris-form-field__affix--suffix [solaris-form-suffix-action]',
      ),
    );
    expect(actionButtons.length).toBe(1);
    expect(actionButtons[0]?.textContent).toContain('Add');
    cleanupHydrationScenario(result);
  });

  it('disabled state', async () => {
    const tag = 'solaris-upload-matrix-disabled';
    @Component({
      selector: tag,
      standalone: true,
      imports: [SolarisFileUploadComponent],
      template: `<solaris-file-upload label="Document" [disabled]="true" />`,
    })
    class DisabledHost {}
    const result = await ssrAndHydrate(DisabledHost, tag);
    assertHydrationClean(result, 'disabled');
    cleanupHydrationScenario(result);
  });
});
