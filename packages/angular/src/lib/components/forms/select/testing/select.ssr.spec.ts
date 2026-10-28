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
  SolarisOptionComponent,
  SolarisSelectComponent,
  provideSolarisTesting,
} from '@educarehq/solaris-ui';

@Component({
  selector: 'solaris-ssr-select-clearable-empty-host',
  standalone: true,
  imports: [
    SolarisSelectComponent,
    SolarisOptionComponent,
    ReactiveFormsModule,
  ],
  template: `<solaris-select
    label="Choice"
    [clearable]="true"
    [formControl]="control"
  >
    <solaris-option value="a">Option A</solaris-option>
    <solaris-option value="b">Option B</solaris-option>
  </solaris-select>`,
})
class SsrSelectClearableEmptyHostComponent {
  readonly control = new FormControl<string | null>(null);
}

@Component({
  selector: 'solaris-ssr-select-clearable-filled-host',
  standalone: true,
  imports: [
    SolarisSelectComponent,
    SolarisOptionComponent,
    ReactiveFormsModule,
  ],
  template: `<solaris-select
    label="Choice"
    [clearable]="true"
    [formControl]="control"
  >
    <solaris-option value="a">Option A</solaris-option>
    <solaris-option value="b">Option B</solaris-option>
  </solaris-select>`,
})
class SsrSelectClearableFilledHostComponent {
  readonly control = new FormControl<string | null>('a');
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

function isHidden(tag: string | null): boolean {
  return tag !== null && /\bhidden\b/.test(tag);
}

function matchTag(
  html: string,
  tagName: string,
  className: string,
): string | null {
  return (
    html.match(new RegExp(`<${tagName}[^>]*${className}[^>]*>`))?.[0] ?? null
  );
}

describe('SolarisSelect SSR (value-driven trigger hydration)', () => {
  it('always renders trigger chrome and hides value content for empty values', async () => {
    const html = await renderHost(
      SsrSelectClearableEmptyHostComponent,
      'solaris-ssr-select-clearable-empty-host',
    );
    expect(matchTag(html, 'span', 'solaris-select__value-text')).not.toBeNull();
    expect(
      matchTag(html, 'span', 'solaris-select__placeholder'),
    ).not.toBeNull();
    expect(matchTag(html, 'button', 'solaris-select__clear')).not.toBeNull();
    expect(isHidden(matchTag(html, 'span', 'solaris-select__value-text'))).toBe(
      true,
    );
    expect(
      isHidden(matchTag(html, 'span', 'solaris-select__placeholder')),
    ).toBe(false);
    expect(isHidden(matchTag(html, 'button', 'solaris-select__clear'))).toBe(
      true,
    );
  });

  it('renders value content visible for selected values without changing the node structure', async () => {
    const html = await renderHost(
      SsrSelectClearableFilledHostComponent,
      'solaris-ssr-select-clearable-filled-host',
    );
    expect(html).toContain('Option A');
    expect(isHidden(matchTag(html, 'span', 'solaris-select__value-text'))).toBe(
      false,
    );
    expect(
      isHidden(matchTag(html, 'span', 'solaris-select__placeholder')),
    ).toBe(true);
    expect(isHidden(matchTag(html, 'button', 'solaris-select__clear'))).toBe(
      false,
    );
  });

  it('keeps identical container structure for empty and selected values', async () => {
    const emptyHtml = await renderHost(
      SsrSelectClearableEmptyHostComponent,
      'solaris-ssr-select-clearable-empty-host',
    );
    const filledHtml = await renderHost(
      SsrSelectClearableFilledHostComponent,
      'solaris-ssr-select-clearable-filled-host',
    );
    expect(countContainers(filledHtml)).toBe(countContainers(emptyHtml));
  });
});
