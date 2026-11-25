// @vitest-environment node
import '@angular/compiler';
import { Component, type Type } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  bootstrapApplication,
  type BootstrapContext,
} from '@angular/platform-browser';
import {
  provideServerRendering,
  renderApplication,
} from '@angular/platform-server';
import {
  SolarisRichTextEditorComponent,
  provideSolarisTesting,
} from '@educarehq/solaris-ui';

@Component({
  selector: 'solaris-ssr-rich-text-empty-host',
  standalone: true,
  imports: [SolarisRichTextEditorComponent, ReactiveFormsModule],
  template: `<solaris-rich-text-editor
    placeholder="Description"
    [formControl]="control"
  ></solaris-rich-text-editor>`,
})
class SsrRichTextEmptyHostComponent {
  readonly control = new FormControl<string>('');
}

@Component({
  selector: 'solaris-ssr-rich-text-filled-host',
  standalone: true,
  imports: [SolarisRichTextEditorComponent, ReactiveFormsModule],
  template: `<solaris-rich-text-editor
    placeholder="Description"
    [formControl]="control"
  ></solaris-rich-text-editor>`,
})
class SsrRichTextFilledHostComponent {
  readonly control = new FormControl<string>('<p>Hello</p>');
}

@Component({
  selector: 'solaris-ssr-rich-text-disabled-host',
  standalone: true,
  imports: [SolarisRichTextEditorComponent],
  template: `<solaris-rich-text-editor placeholder="Description" disabled />`,
})
class SsrRichTextDisabledHostComponent {}

@Component({
  selector: 'solaris-ssr-rich-text-readonly-host',
  standalone: true,
  imports: [SolarisRichTextEditorComponent],
  template: `<solaris-rich-text-editor
    placeholder="Description"
    readonly
    variant="composer"
  />`,
})
class SsrRichTextReadonlyHostComponent {}

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

function countContainers(html: string): number {
  return html.match(/<!--container-->/g)?.length ?? 0;
}

describe('SolarisRichTextEditor SSR', () => {
  it('renders the empty editor shell without errors', async () => {
    const html = await renderHost(
      SsrRichTextEmptyHostComponent,
      'solaris-ssr-rich-text-empty-host',
    );
    expect(html).toContain('solaris-rich-text-editor');
    expect(html).toContain('solaris-rich-text-editor-area');
    expect(html).toContain('role="textbox"');
  });

  it('renders a prefilled HTML value without errors', async () => {
    const html = await renderHost(
      SsrRichTextFilledHostComponent,
      'solaris-ssr-rich-text-filled-host',
    );
    expect(html).toContain('solaris-rich-text-editor-area');
  });

  it('renders disabled and readonly states on the server', async () => {
    const disabledHtml = await renderHost(
      SsrRichTextDisabledHostComponent,
      'solaris-ssr-rich-text-disabled-host',
    );
    expect(disabledHtml).toContain('contenteditable="false"');
    const readonlyHtml = await renderHost(
      SsrRichTextReadonlyHostComponent,
      'solaris-ssr-rich-text-readonly-host',
    );
    expect(readonlyHtml).toContain('data-variant="composer"');
  });

  it('keeps identical container structure for empty and prefilled values', async () => {
    const emptyHtml = await renderHost(
      SsrRichTextEmptyHostComponent,
      'solaris-ssr-rich-text-empty-host',
    );
    const filledHtml = await renderHost(
      SsrRichTextFilledHostComponent,
      'solaris-ssr-rich-text-filled-host',
    );
    expect(countContainers(filledHtml)).toBe(countContainers(emptyHtml));
  });
});
