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
  SolarisEmailFieldComponent,
  provideSolarisTesting,
} from '@educarehq/solaris-ui';

@Component({
  selector: 'solaris-ssr-email-clearable-empty-host',
  standalone: true,
  imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
  template: `<solaris-email-field
    label="E-mail"
    [clearable]="true"
    [formControl]="control"
  ></solaris-email-field>`,
})
class SsrEmailClearableEmptyHostComponent {
  readonly control = new FormControl<string>('');
}

@Component({
  selector: 'solaris-ssr-email-clearable-filled-host',
  standalone: true,
  imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
  template: `<solaris-email-field
    label="E-mail"
    [clearable]="true"
    [formControl]="control"
  ></solaris-email-field>`,
})
class SsrEmailClearableFilledHostComponent {
  readonly control = new FormControl<string>('user@example.com');
}

@Component({
  selector: 'solaris-ssr-email-clearable-null-host',
  standalone: true,
  imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
  template: `<solaris-email-field
    label="E-mail"
    [clearable]="true"
    [formControl]="control"
  ></solaris-email-field>`,
})
class SsrEmailClearableNullHostComponent {
  readonly control = new FormControl<string | null>(null);
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
  return html.includes('solaris-email-field__clear"');
}

describe('SolarisEmailField SSR (clear-button hydration)', () => {
  it('omits the value-driven clear button from SSR for empty values', async () => {
    const html = await renderHost(
      SsrEmailClearableEmptyHostComponent,
      'solaris-ssr-email-clearable-empty-host',
    );
    expect(hasClearButton(html)).toBe(false);
  });

  it('omits the value-driven clear button from SSR for prefilled values', async () => {
    const html = await renderHost(
      SsrEmailClearableFilledHostComponent,
      'solaris-ssr-email-clearable-filled-host',
    );
    expect(hasClearButton(html)).toBe(false);
  });

  it('keeps identical container structure for empty and prefilled values', async () => {
    const emptyHtml = await renderHost(
      SsrEmailClearableEmptyHostComponent,
      'solaris-ssr-email-clearable-empty-host',
    );
    const filledHtml = await renderHost(
      SsrEmailClearableFilledHostComponent,
      'solaris-ssr-email-clearable-filled-host',
    );
    expect(countContainers(filledHtml)).toBe(countContainers(emptyHtml));
  });

  it('renders a null form value without errors and without a clear button', async () => {
    const html = await renderHost(
      SsrEmailClearableNullHostComponent,
      'solaris-ssr-email-clearable-null-host',
    );
    expect(hasClearButton(html)).toBe(false);
  });
});
