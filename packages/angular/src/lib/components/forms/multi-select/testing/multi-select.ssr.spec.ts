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
  SolarisMultiSelectComponent,
  SolarisOptionComponent,
  provideSolarisTesting,
} from '@educarehq/solaris-ui';

@Component({
  selector: 'solaris-ssr-multi-select-clearable-empty-host',
  standalone: true,
  imports: [
    SolarisMultiSelectComponent,
    SolarisOptionComponent,
    ReactiveFormsModule,
  ],
  template: `<solaris-multi-select
    label="Choices"
    [clearable]="true"
    [formControl]="control"
  >
    <solaris-option value="a">Option A</solaris-option>
    <solaris-option value="b">Option B</solaris-option>
  </solaris-multi-select>`,
})
class SsrMultiSelectClearableEmptyHostComponent {
  readonly control = new FormControl<string[]>([]);
}

@Component({
  selector: 'solaris-ssr-multi-select-clearable-filled-host',
  standalone: true,
  imports: [
    SolarisMultiSelectComponent,
    SolarisOptionComponent,
    ReactiveFormsModule,
  ],
  template: `<solaris-multi-select
    label="Choices"
    [clearable]="true"
    [formControl]="control"
  >
    <solaris-option value="a">Option A</solaris-option>
    <solaris-option value="b">Option B</solaris-option>
  </solaris-multi-select>`,
})
class SsrMultiSelectClearableFilledHostComponent {
  readonly control = new FormControl<string[]>(['a']);
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
    html.match(
      new RegExp(`<${tagName}[^>]*${className}(?=["\\s])[^>]*>`),
    )?.[0] ?? null
  );
}

const PLACEHOLDER_WRAPPER = 'solaris-multi-select__value';

describe('SolarisMultiSelect SSR (value-driven trigger hydration)', () => {
  it('always renders trigger chrome and hides value content for empty values', async () => {
    const html = await renderHost(
      SsrMultiSelectClearableEmptyHostComponent,
      'solaris-ssr-multi-select-clearable-empty-host',
    );
    expect(
      matchTag(html, 'button', 'solaris-multi-select__clear'),
    ).not.toBeNull();
    expect(matchTag(html, 'span', PLACEHOLDER_WRAPPER)).not.toBeNull();
    expect(
      isHidden(matchTag(html, 'button', 'solaris-multi-select__clear')),
    ).toBe(true);
    expect(isHidden(matchTag(html, 'span', PLACEHOLDER_WRAPPER))).toBe(false);
  });

  it('renders value content visible for selected values without changing the node structure', async () => {
    const html = await renderHost(
      SsrMultiSelectClearableFilledHostComponent,
      'solaris-ssr-multi-select-clearable-filled-host',
    );
    expect(
      matchTag(html, 'button', 'solaris-multi-select__clear'),
    ).not.toBeNull();
    expect(matchTag(html, 'div', 'solaris-multi-select__chips')).not.toBeNull();
    expect(
      isHidden(matchTag(html, 'button', 'solaris-multi-select__clear')),
    ).toBe(false);
    expect(isHidden(matchTag(html, 'span', PLACEHOLDER_WRAPPER))).toBe(true);
  });

  it('keeps identical container structure for empty and selected values', async () => {
    const emptyHtml = await renderHost(
      SsrMultiSelectClearableEmptyHostComponent,
      'solaris-ssr-multi-select-clearable-empty-host',
    );
    const filledHtml = await renderHost(
      SsrMultiSelectClearableFilledHostComponent,
      'solaris-ssr-multi-select-clearable-filled-host',
    );
    expect(countContainers(filledHtml)).toBe(countContainers(emptyHtml));
  });
});
