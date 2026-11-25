import { TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { SolarisRichTextEditorComponent } from '../component/rich-text-editor.component';
import { SolarisRichTextEditorHarness } from './rich-text-editor.harness';

import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';

@Component({
  selector: 'solaris-rich-text-harness-host',
  standalone: true,
  imports: [SolarisRichTextEditorComponent],
  template: `<solaris-rich-text-editor
    variant="document"
    placeholder="Description"
    [maxLength]="300"
  />`,
})
class HarnessHost {}

@Component({
  selector: 'solaris-rich-text-composer-harness-host',
  standalone: true,
  imports: [SolarisRichTextEditorComponent],
  template: `<solaris-rich-text-editor variant="composer" />`,
})
class ComposerHarnessHost {}

describe('SolarisRichTextEditorHarness', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideSolarisTesting()],
    }).compileComponents();
  });

  it('drives the document editor through its public harness API', async () => {
    const fixture = TestBed.createComponent(HarnessHost);
    fixture.detectChanges();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(SolarisRichTextEditorHarness);

    expect(await harness.getVariant()).toBe('document');
    expect(await harness.getFormat()).toBe('rich');
    expect(await harness.hasToolbar()).toBe(true);
    expect(await harness.getCharCount()).toContain('0');
  });

  it('reads text and applies toolbar actions through the harness', async () => {
    const fixture = TestBed.createComponent(HarnessHost);
    fixture.detectChanges();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(SolarisRichTextEditorHarness);
    const editor = fixture.debugElement.query(
      By.directive(SolarisRichTextEditorComponent),
    )?.componentInstance as SolarisRichTextEditorComponent | undefined;
    editor?.writeValue('<p>Hello</p>');
    fixture.detectChanges();
    expect(await harness.getText()).toBe('Hello');
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    area.focus();
    const text = area.querySelector('p')?.firstChild as Node | null;
    if (text) {
      const range = document.createRange();
      range.selectNodeContents(text);
      document.getSelection()?.removeAllRanges();
      document.getSelection()?.addRange(range);
    }
    await harness.clickToolbarAction('bold');
    fixture.detectChanges();
    expect(area.querySelector('strong')).toBeTruthy();
    expect(await harness.getText()).toBe('Hello');
  });

  it('exposes the composer variant without selection-dependent toolbar state', async () => {
    const fixture = TestBed.createComponent(ComposerHarnessHost);
    fixture.detectChanges();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(SolarisRichTextEditorHarness);

    expect(await harness.getVariant()).toBe('composer');
    await harness.focus();
    expect(await harness.getFormat()).toBe('rich');
  });
});
