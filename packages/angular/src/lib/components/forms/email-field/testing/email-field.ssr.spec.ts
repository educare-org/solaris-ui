// @vitest-environment node
import '@angular/compiler';
import { Component, type Type } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  SolarisFormSuffixActionDirective,
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

@Component({
  selector: 'solaris-ssr-email-consumer-host',
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
class SsrEmailConsumerHostComponent {
  email = '';
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
  return html.includes('solaris-email-field__clear');
}

function isClearButtonHidden(html: string): boolean {
  const match = html.match(/<button[^>]*solaris-email-field__clear[^>]*>/);
  return match !== null && /\bhidden\b/.test(match[0]);
}

describe('SolarisEmailField SSR (clear-button hydration)', () => {
  it('always renders the clear button and hides it for empty values', async () => {
    const html = await renderHost(
      SsrEmailClearableEmptyHostComponent,
      'solaris-ssr-email-clearable-empty-host',
    );
    expect(hasClearButton(html)).toBe(true);
    expect(isClearButtonHidden(html)).toBe(true);
  });

  it('renders the clear button visible for prefilled values without changing the node structure', async () => {
    const html = await renderHost(
      SsrEmailClearableFilledHostComponent,
      'solaris-ssr-email-clearable-filled-host',
    );
    expect(hasClearButton(html)).toBe(true);
    expect(isClearButtonHidden(html)).toBe(false);
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

  it('renders a null form value without errors and with a hidden clear button', async () => {
    const html = await renderHost(
      SsrEmailClearableNullHostComponent,
      'solaris-ssr-email-clearable-null-host',
    );
    expect(hasClearButton(html)).toBe(true);
    expect(isClearButtonHidden(html)).toBe(true);
  });

  it('renders the consumer ngModel + suffix-action layout without errors', async () => {
    const html = await renderHost(
      SsrEmailConsumerHostComponent,
      'solaris-ssr-email-consumer-host',
    );
    expect(html).toContain('type="email"');
    expect(html).toContain('Continuar');
    expect(html).toContain('solaris-form-suffix-action');
    expect(hasClearButton(html)).toBe(true);
    expect(isClearButtonHidden(html)).toBe(true);
  });

  it('keeps identical container structure between the consumer layout and the empty field', async () => {
    const emptyHtml = await renderHost(
      SsrEmailClearableEmptyHostComponent,
      'solaris-ssr-email-clearable-empty-host',
    );
    const consumerHtml = await renderHost(
      SsrEmailConsumerHostComponent,
      'solaris-ssr-email-consumer-host',
    );
    expect(countContainers(consumerHtml)).toBe(countContainers(emptyHtml));
  });
});
