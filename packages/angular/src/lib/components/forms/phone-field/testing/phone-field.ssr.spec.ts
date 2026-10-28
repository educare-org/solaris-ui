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
  SolarisPhoneFieldComponent,
  provideSolarisTesting,
} from '@educarehq/solaris-ui';

@Component({
  selector: 'solaris-ssr-phone-clearable-empty-host',
  standalone: true,
  imports: [SolarisPhoneFieldComponent, ReactiveFormsModule],
  template: `<solaris-phone-field
    label="Phone"
    [clearable]="true"
    [formControl]="control"
  ></solaris-phone-field>`,
})
class SsrPhoneClearableEmptyHostComponent {
  readonly control = new FormControl<string>('');
}

@Component({
  selector: 'solaris-ssr-phone-clearable-filled-host',
  standalone: true,
  imports: [SolarisPhoneFieldComponent, ReactiveFormsModule],
  template: `<solaris-phone-field
    label="Phone"
    [clearable]="true"
    [formControl]="control"
  ></solaris-phone-field>`,
})
class SsrPhoneClearableFilledHostComponent {
  readonly control = new FormControl<string>('11999999999');
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
  return html.includes('solaris-phone-field__clear');
}

function isClearButtonHidden(html: string): boolean {
  const match = html.match(/<button[^>]*solaris-phone-field__clear[^>]*>/);
  return match !== null && /\bhidden\b/.test(match[0]);
}

describe('SolarisPhoneField SSR (clear-button hydration)', () => {
  it('always renders the clear button and hides it for empty values', async () => {
    const html = await renderHost(
      SsrPhoneClearableEmptyHostComponent,
      'solaris-ssr-phone-clearable-empty-host',
    );
    expect(hasClearButton(html)).toBe(true);
    expect(isClearButtonHidden(html)).toBe(true);
  });

  it('renders the clear button visible for prefilled values without changing the node structure', async () => {
    const html = await renderHost(
      SsrPhoneClearableFilledHostComponent,
      'solaris-ssr-phone-clearable-filled-host',
    );
    expect(hasClearButton(html)).toBe(true);
    expect(isClearButtonHidden(html)).toBe(false);
  });

  it('keeps identical container structure for empty and prefilled values', async () => {
    const emptyHtml = await renderHost(
      SsrPhoneClearableEmptyHostComponent,
      'solaris-ssr-phone-clearable-empty-host',
    );
    const filledHtml = await renderHost(
      SsrPhoneClearableFilledHostComponent,
      'solaris-ssr-phone-clearable-filled-host',
    );
    expect(countContainers(filledHtml)).toBe(countContainers(emptyHtml));
  });
});
