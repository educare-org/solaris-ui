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
  SolarisDateRangePickerComponent,
  provideSolarisTesting,
} from '@educarehq/solaris-ui';

@Component({
  selector: 'solaris-ssr-date-range-clearable-empty-host',
  standalone: true,
  imports: [SolarisDateRangePickerComponent, ReactiveFormsModule],
  template: `<solaris-date-range-picker
    label="Period"
    [clearable]="true"
    [formControl]="control"
  ></solaris-date-range-picker>`,
})
class SsrDateRangeClearableEmptyHostComponent {
  readonly control = new FormControl(null);
}

@Component({
  selector: 'solaris-ssr-date-range-clearable-filled-host',
  standalone: true,
  imports: [SolarisDateRangePickerComponent, ReactiveFormsModule],
  template: `<solaris-date-range-picker
    label="Period"
    [clearable]="true"
    [formControl]="control"
  ></solaris-date-range-picker>`,
})
class SsrDateRangeClearableFilledHostComponent {
  readonly control = new FormControl({
    start: '2025-01-12',
    end: '2025-01-16',
  });
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
  return html.includes('solaris-date-range-picker__clear');
}

function isClearButtonHidden(html: string): boolean {
  const match = html.match(
    /<button[^>]*solaris-date-range-picker__clear[^>]*>/,
  );
  return match !== null && /\bhidden\b/.test(match[0]);
}

describe('SolarisDateRangePicker SSR (clear-button hydration)', () => {
  it('always renders the clear button and hides it for empty values', async () => {
    const html = await renderHost(
      SsrDateRangeClearableEmptyHostComponent,
      'solaris-ssr-date-range-clearable-empty-host',
    );
    expect(hasClearButton(html)).toBe(true);
    expect(isClearButtonHidden(html)).toBe(true);
  });

  it('renders the clear button visible for prefilled values without changing the node structure', async () => {
    const html = await renderHost(
      SsrDateRangeClearableFilledHostComponent,
      'solaris-ssr-date-range-clearable-filled-host',
    );
    expect(hasClearButton(html)).toBe(true);
    expect(isClearButtonHidden(html)).toBe(false);
  });

  it('keeps identical container structure for empty and prefilled values', async () => {
    const emptyHtml = await renderHost(
      SsrDateRangeClearableEmptyHostComponent,
      'solaris-ssr-date-range-clearable-empty-host',
    );
    const filledHtml = await renderHost(
      SsrDateRangeClearableFilledHostComponent,
      'solaris-ssr-date-range-clearable-filled-host',
    );
    expect(countContainers(filledHtml)).toBe(countContainers(emptyHtml));
  });
});
