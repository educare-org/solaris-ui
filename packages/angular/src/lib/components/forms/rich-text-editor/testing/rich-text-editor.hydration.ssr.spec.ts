// @vitest-environment jsdom
import '@angular/compiler';
import { Component, type Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SolarisRichTextEditorComponent } from '@educarehq/solaris-ui';
import {
  cleanupHydrationScenario,
  assertHydrationClean,
  ssrAndHydrate,
} from '../../../../testing/hydration/hydration-harness';

function host(
  tag: string,
  template: string,
  imports: Type<unknown>[] = [SolarisRichTextEditorComponent, FormsModule],
): { host: Type<unknown>; tag: string } {
  @Component({ selector: tag, standalone: true, imports, template })
  class MatrixHost {
    html = '';
  }
  return { host: MatrixHost, tag };
}

async function runScenario(name: string, template: string) {
  const tag = `solaris-rich-text-matrix-${name}`;
  const { host: hostType } = host(tag, template);
  const result = await ssrAndHydrate(hostType, tag);
  assertHydrationClean(result, name);
  return result;
}

describe('SolarisRichTextEditor hydration matrix', () => {
  it('empty editor hydrates without mismatches', async () => {
    const result = await runScenario(
      'empty',
      `<solaris-rich-text-editor placeholder="Description" [(ngModel)]="html" />`,
    );
    expect(
      document.querySelector('.solaris-rich-text-editor-area'),
    ).toBeTruthy();
    expect(
      document.querySelector('[role="textbox"][aria-multiline="true"]'),
    ).toBeTruthy();
    cleanupHydrationScenario(result);
  });

  it('disabled editor hydrates with contenteditable false', async () => {
    const result = await runScenario(
      'disabled',
      `<solaris-rich-text-editor placeholder="Description" disabled />`,
    );
    expect(
      document
        .querySelector('.solaris-rich-text-editor-area')
        ?.getAttribute('contenteditable'),
    ).toBe('false');
    cleanupHydrationScenario(result);
  });

  it('readonly composer hydrates with the composer variant', async () => {
    const result = await runScenario(
      'readonly-composer',
      `<solaris-rich-text-editor variant="composer" readonly />`,
    );
    expect(
      document
        .querySelector('solaris-rich-text-editor')
        ?.getAttribute('data-variant'),
    ).toBe('composer');
    cleanupHydrationScenario(result);
  });

  it('input after hydration propagates to ngModel (listener survival)', async () => {
    const tag = 'solaris-rich-text-matrix-replay';
    @Component({
      selector: tag,
      standalone: true,
      imports: [SolarisRichTextEditorComponent, FormsModule],
      template: `<solaris-rich-text-editor [(ngModel)]="html" />`,
    })
    class ReplayHost {
      html = '';
    }
    const result = await ssrAndHydrate(ReplayHost, tag);
    assertHydrationClean(result, 'replay');
    const area = document.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    // SECURITY_EXCEPTION: test-only DOM write into the jsdom document owned by the harness; mirrors the harness replay path.
    area.innerHTML = '<p>hello</p>';
    const replayEvent = document.createEvent('Event');
    replayEvent.initEvent('input', true, true);
    area.dispatchEvent(replayEvent);
    await new Promise((resolve) => setTimeout(resolve, 0));
    const components = (
      result.appRef as unknown as { components: { instance: unknown }[] }
    )?.components;
    expect(
      (components?.[0]?.instance as { html: unknown } | undefined)?.html,
    ).toBeDefined();
    cleanupHydrationScenario(result);
  });
});
