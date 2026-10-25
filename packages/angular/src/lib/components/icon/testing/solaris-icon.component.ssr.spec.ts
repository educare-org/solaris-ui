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
  SolarisIconComponent,
  provideSolarisTesting,
} from '@educarehq/solaris-ui';

@Component({
  selector: 'solaris-ssr-icon-host',
  standalone: true,
  imports: [SolarisIconComponent],
  template: `
    <solaris-icon name="check" />
    <solaris-icon name="bookmark" variant="solid" />
    <solaris-icon name="check" variant="solid" />
    <solaris-icon name="bookmark" variant="duotone" />
    <solaris-icon name="check" variant="duotone" />
    <solaris-icon name="google" />
    <solaris-icon name="info" [decorative]="false" ariaLabel="Information" />
    <solaris-icon name="check" [absoluteStrokeWidth]="true" />
  `,
})
class SsrIconHostComponent {}

async function renderIcons(): Promise<string> {
  return renderApplication(
    (context: BootstrapContext) =>
      bootstrapApplication(
        SsrIconHostComponent,
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
        '<html><head></head><body><solaris-ssr-icon-host></solaris-ssr-icon-host></body></html>',
      url: '/',
    },
  );
}

describe('SolarisIconComponent SSR (Domino, no innerHTML)', () => {
  it('should prerender without NotYetImplemented innerHTML errors', async () => {
    const html = await renderIcons();
    expect(html).toContain('<svg');
    expect(html).not.toContain('NotYetImplemented');
  });

  it('should render outline markup structurally on the server', async () => {
    const html = await renderIcons();
    expect(html).toContain('d="M20 6 9 17l-5-5"');
    expect(html).toContain('viewBox="0 0 24 24"');
  });

  it('should render dedicated solid art without a mask fallback', async () => {
    const html = await renderIcons();
    expect(html).toContain('data-variant="solid"');
    expect(html).toContain(
      'd="M19 21l-7-4-7 4V5a2 2 0 012-2h10a2 2 0 012 2v16z"',
    );
  });

  it('should render the knockout mask fallback for stroke-only solid icons', async () => {
    const html = await renderIcons();
    expect(html).toContain('<mask');
    expect(html).toContain('mask="url(#solaris-check-3-mask)"');
  });

  it('should render duotone layers on the server', async () => {
    const html = await renderIcons();
    expect(html).toContain('data-variant="duotone"');
    expect(html).toContain('opacity="0.25"');
    expect(html).toContain('opacity="0.2"');
  });

  it('should render brand fills and semantic labels on the server', async () => {
    const html = await renderIcons();
    expect(html).toContain('fill="#4285F4"');
    expect(html).toContain('aria-label="Information"');
    expect(html).toContain('role="img"');
  });

  it('should render vector-effect for absolute stroke widths on the server', async () => {
    const html = await renderIcons();
    expect(html).toContain('vector-effect="non-scaling-stroke"');
  });
});
