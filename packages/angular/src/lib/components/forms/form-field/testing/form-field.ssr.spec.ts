// @vitest-environment node
import '@angular/compiler';
import { Component } from '@angular/core';
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
  SolarisFormSuffixDirective,
  provideSolarisTesting,
} from '@educarehq/solaris-ui';

@Component({
  selector: 'solaris-ssr-email-suffix-host',
  standalone: true,
  imports: [SolarisEmailFieldComponent, SolarisFormSuffixDirective],
  template: `
    <solaris-email-field label="E-mail">
      <button solaris-form-suffix type="button">Enviar</button>
    </solaris-email-field>
  `,
})
class SsrEmailSuffixHostComponent {}

async function renderEmailWithSuffix(): Promise<string> {
  return renderApplication(
    (context: BootstrapContext) =>
      bootstrapApplication(
        SsrEmailSuffixHostComponent,
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
      document:
        '<html><head></head><body><solaris-ssr-email-suffix-host></solaris-ssr-email-suffix-host></body></html>',
      url: '/',
    },
  );
}

describe('SolarisFormField SSR (form-suffix hydration)', () => {
  it('should prerender email-field with projected form-suffix without hydration serialization errors', async () => {
    const html = await renderEmailWithSuffix();
    expect(html).toContain('Enviar');
    expect(html).toContain('solaris-form-suffix');
  });

  it('should forward the projected form-suffix into the suffix affix', async () => {
    const html = await renderEmailWithSuffix();
    const affixMatch = html.match(
      /<span[^>]*solaris-form-field__affix--suffix[^>]*>([\s\S]*?)<\/span>/,
    );
    expect(affixMatch?.[1]).toContain('Enviar');
  });
});
