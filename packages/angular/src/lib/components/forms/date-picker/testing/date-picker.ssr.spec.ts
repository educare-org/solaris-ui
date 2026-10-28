// @vitest-environment node
import '@angular/compiler';
import { Component, type Type } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  bootstrapApplication,
  type BootstrapContext,
} from '@angular/platform-browser';
import { provideClientHydration } from '@angular/platform-browser';
import {
  provideServerRendering,
  renderApplication,
} from '@angular/platform-server';
import {
  SolarisDatePickerComponent,
  provideSolarisTesting,
} from '@educarehq/solaris-ui';

@Component({
  selector: 'solaris-ssr-date-picker-clearable-empty-host',
  standalone: true,
  imports: [SolarisDatePickerComponent, ReactiveFormsModule],
  template: `<solaris-date-picker
    label="Date"
    [clearable]="true"
    [formControl]="control"
  ></solaris-date-picker>`,
})
class SsrDatePickerClearableEmptyHostComponent {
  readonly control = new FormControl<string | null>(null);
}

@Component({
  selector: 'solaris-ssr-date-picker-clearable-filled-host',
  standalone: true,
  imports: [SolarisDatePickerComponent, ReactiveFormsModule],
  template: `<solaris-date-picker
    label="Date"
    [clearable]="true"
    [formControl]="control"
  ></solaris-date-picker>`,
})
class SsrDatePickerClearableFilledHostComponent {
  readonly control = new FormControl<string | null>('2025-01-16');
}

async function renderHost(host: Type<unknown>, tag: string): Promise<string> {
  return renderApplication(
    (context: BootstrapContext) =>
      bootstrapApplication(
        host,
        {
          providers: [
            provideClientHydration(),
            provideServerRendering(),
            provideSolarisTesting(),
          ],
        },
        context,
      ),
    {
      document: `<html><head></head><body><${tag}></${tag}></body></html>`,
      url: '/',
    },
  );
}

function countContainers(html: string): number {
  return html.match(/<!--container-->/g)?.length ?? 0;
}

function hasClearButton(html: string): boolean {
  return html.includes('solaris-date-picker__clear"');
}

describe('SolarisDatePicker SSR (clear-button hydration)', () => {
  it('omits the value-driven clear button from SSR for empty values', async () => {
    const html = await renderHost(
      SsrDatePickerClearableEmptyHostComponent,
      'solaris-ssr-date-picker-clearable-empty-host',
    );
    expect(hasClearButton(html)).toBe(false);
  });

  it('omits the value-driven clear button from SSR for prefilled values', async () => {
    const html = await renderHost(
      SsrDatePickerClearableFilledHostComponent,
      'solaris-ssr-date-picker-clearable-filled-host',
    );
    expect(hasClearButton(html)).toBe(false);
  });

  it('keeps identical container structure for empty and prefilled values', async () => {
    const emptyHtml = await renderHost(
      SsrDatePickerClearableEmptyHostComponent,
      'solaris-ssr-date-picker-clearable-empty-host',
    );
    const filledHtml = await renderHost(
      SsrDatePickerClearableFilledHostComponent,
      'solaris-ssr-date-picker-clearable-filled-host',
    );
    expect(countContainers(filledHtml)).toBe(countContainers(emptyHtml));
  });
});
