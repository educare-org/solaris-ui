// @vitest-environment node
import '@angular/compiler';
import { Component, type Type } from '@angular/core';
import {
  bootstrapApplication,
  type BootstrapContext,
} from '@angular/platform-browser';
import {
  provideServerRendering,
  renderApplication,
} from '@angular/platform-server';
import {
  SolarisRichTextViewComponent,
  provideSolarisTesting,
} from '@educarehq/solaris-ui';

@Component({
  selector: 'solaris-ssr-rich-text-view-host',
  standalone: true,
  imports: [SolarisRichTextViewComponent],
  template: `<solaris-rich-text-view
    [value]="value"
    ariaLabel="Description"
  ></solaris-rich-text-view>`,
})
class SsrRichTextViewHostComponent {
  readonly value =
    '<p data-align="center">Hello</p><figure data-image><img src="https://example.com/a.png" alt="Logo" /></figure>';
}

async function renderHost(host: Type<unknown>, tag: string): Promise<string> {
  return renderApplication(
    (context: BootstrapContext) =>
      bootstrapApplication(
        host,
        {
          providers: [provideServerRendering(), provideSolarisTesting()],
        },
        context,
      ),
    {
      document: `<html><head></head><body><${tag}></${tag}></body></html>`,
      url: '/',
    },
  );
}

describe('SolarisRichTextView SSR', () => {
  it('renders the view shell without errors and defers content to the client', async () => {
    const html = await renderHost(
      SsrRichTextViewHostComponent,
      'solaris-ssr-rich-text-view-host',
    );
    expect(html).toContain('solaris-rich-text-view');
    expect(html).toContain('solaris-rich-text-view-content');
    expect(html).toContain('role="region"');
  });
});
