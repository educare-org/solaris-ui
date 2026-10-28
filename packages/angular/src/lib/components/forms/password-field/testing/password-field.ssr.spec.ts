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
  SolarisPasswordFieldComponent,
  provideSolarisTesting,
} from '@educarehq/solaris-ui';

@Component({
  selector: 'solaris-ssr-password-strength-empty-host',
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field
    label="Password"
    [showStrength]="true"
    [formControl]="control"
  ></solaris-password-field>`,
})
class SsrPasswordStrengthEmptyHostComponent {
  readonly control = new FormControl<string>('');
}

@Component({
  selector: 'solaris-ssr-password-strength-filled-host',
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field
    label="Password"
    [showStrength]="true"
    [formControl]="control"
  ></solaris-password-field>`,
})
class SsrPasswordStrengthFilledHostComponent {
  readonly control = new FormControl<string>('Str0ng!Pass');
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

function hasStrengthMeter(html: string): boolean {
  return html.includes('solaris-password-field__strength');
}

function isStrengthMeterHidden(html: string): boolean {
  const match = html.match(/<div[^>]*solaris-password-field__strength[^>]*>/);
  return match !== null && /\bhidden\b/.test(match[0]);
}

describe('SolarisPasswordField SSR (strength-meter hydration)', () => {
  it('always renders the strength meter and hides it for empty values', async () => {
    const html = await renderHost(
      SsrPasswordStrengthEmptyHostComponent,
      'solaris-ssr-password-strength-empty-host',
    );
    expect(hasStrengthMeter(html)).toBe(true);
    expect(isStrengthMeterHidden(html)).toBe(true);
  });

  it('renders the strength meter visible for prefilled values without changing the node structure', async () => {
    const html = await renderHost(
      SsrPasswordStrengthFilledHostComponent,
      'solaris-ssr-password-strength-filled-host',
    );
    expect(hasStrengthMeter(html)).toBe(true);
    expect(isStrengthMeterHidden(html)).toBe(false);
  });

  it('keeps identical container structure for empty and prefilled values', async () => {
    const emptyHtml = await renderHost(
      SsrPasswordStrengthEmptyHostComponent,
      'solaris-ssr-password-strength-empty-host',
    );
    const filledHtml = await renderHost(
      SsrPasswordStrengthFilledHostComponent,
      'solaris-ssr-password-strength-filled-host',
    );
    expect(countContainers(filledHtml)).toBe(countContainers(emptyHtml));
  });
});
