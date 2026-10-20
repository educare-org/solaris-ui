import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';
import { SolarisPreviewCodeComponent } from '../component/preview-code.component';
import type {
  SolarisPreviewCodeAlign,
  SolarisPreviewCodeAppearance,
  SolarisPreviewCodeDensity,
  SolarisPreviewCodeFile,
  SolarisPreviewCodeMinHeight,
  SolarisPreviewCodePadding,
  SolarisPreviewCodeSize,
  SolarisPreviewCodeTab,
} from '../model/preview-code.types';

const TEST_TRANSLATIONS = {
  'en-US': {
    'solaris.previewCode.ariaLabel': 'Preview code',
    'solaris.previewCode.preview': 'Preview',
    'solaris.previewCode.code': 'Code',
    'solaris.previewCode.fileSelector.ariaLabel': 'Code files',
    'spec.previewCode.preview': 'Live preview',
    'spec.previewCode.code': 'Source code',
    'spec.previewCode.aria': 'Preview and source tabs',
    'spec.previewCode.filesAria': 'Example code files',
  },
};

type HostOverrides = Partial<PreviewCodeHostComponent>;

@Component({
  standalone: true,
  imports: [SolarisPreviewCodeComponent],
  template: `
    <solaris-preview-code
      [code]="code"
      [codeFiles]="codeFiles"
      [language]="language"
      [defaultCodeFile]="defaultCodeFile"
      [activeTab]="activeTab"
      [defaultTab]="defaultTab"
      [appearance]="appearance"
      [size]="size"
      [density]="density"
      [previewLabel]="previewLabel"
      [previewLabelKey]="previewLabelKey"
      [codeLabel]="codeLabel"
      [codeLabelKey]="codeLabelKey"
      [ariaLabel]="ariaLabel"
      [ariaLabelKey]="ariaLabelKey"
      [fileSelectorAriaLabel]="fileSelectorAriaLabel"
      [fileSelectorAriaLabelKey]="fileSelectorAriaLabelKey"
      [codeBlockAppearance]="codeBlockAppearance"
      [codeBlockSize]="codeBlockSize"
      [codeExpandable]="codeExpandable"
      [codeCollapsedLines]="codeCollapsedLines"
      [previewAlign]="previewAlign"
      [previewMinHeight]="previewMinHeight"
      [previewPadding]="previewPadding"
      (activeTabChange)="handleActiveTabChange($event)"
    >
      <button type="button">Save</button>
    </solaris-preview-code>
  `,
})
class PreviewCodeHostComponent {
  code: string | null | undefined = 'const answer = 42;';
  codeFiles: readonly SolarisPreviewCodeFile[] = [];
  language: string | null = 'typescript';
  defaultCodeFile: string | null = null;
  activeTab: SolarisPreviewCodeTab | null = null;
  defaultTab: SolarisPreviewCodeTab = 'preview';
  appearance: SolarisPreviewCodeAppearance = 'outline';
  size: SolarisPreviewCodeSize = 'md';
  density: SolarisPreviewCodeDensity = 'compact';
  previewLabel: string | null = null;
  previewLabelKey: string | null = null;
  codeLabel: string | null = null;
  codeLabelKey: string | null = null;
  ariaLabel: string | null = null;
  ariaLabelKey: string | null = null;
  fileSelectorAriaLabel: string | null = null;
  fileSelectorAriaLabelKey: string | null = null;
  codeBlockAppearance: SolarisPreviewCodeAppearance | null = null;
  codeBlockSize: SolarisPreviewCodeSize | null = null;
  codeExpandable = false;
  codeCollapsedLines = 8;
  previewAlign: SolarisPreviewCodeAlign = 'center';
  previewMinHeight: SolarisPreviewCodeMinHeight = 'md';
  previewPadding: SolarisPreviewCodePadding = 'md';
  changedTabs: SolarisPreviewCodeTab[] = [];

  handleActiveTabChange(tab: SolarisPreviewCodeTab): void {
    this.changedTabs.push(tab);
  }
}

describe('SolarisPreviewCodeComponent', () => {
  let fixture: ComponentFixture<PreviewCodeHostComponent>;

  function createHost(
    overrides: HostOverrides = {},
  ): ComponentFixture<PreviewCodeHostComponent> {
    fixture = TestBed.createComponent(PreviewCodeHostComponent);
    Object.assign(fixture.componentInstance, overrides);
    fixture.detectChanges();
    return fixture;
  }

  function element(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function previewCode(): HTMLElement {
    return element().querySelector('solaris-preview-code') as HTMLElement;
  }

  function panels(): NodeListOf<HTMLElement> {
    return element().querySelectorAll(
      '.solaris-preview-code__panel',
    ) as unknown as NodeListOf<HTMLElement>;
  }

  function codeBlock(): HTMLElement | null {
    return element().querySelector('solaris-code-block');
  }

  function frame(): HTMLElement {
    return element().querySelector(
      '.solaris-preview-code__frame',
    ) as HTMLElement;
  }

  function segmentedItems(): NodeListOf<HTMLElement> {
    return element().querySelectorAll(
      'solaris-segmented-item',
    ) as unknown as NodeListOf<HTMLElement>;
  }

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [PreviewCodeHostComponent],
      providers: [
        provideSolarisTesting({
          translate: { translations: TEST_TRANSLATIONS },
        }),
      ],
    }).compileComponents();
  });

  it('renders the preview panel by default with projected content', () => {
    createHost();
    expect(previewCode().getAttribute('data-active-tab')).toBe('preview');
    expect(panels().length).toBe(1);
    expect(panels()[0].getAttribute('role')).toBe('tabpanel');
    expect(element().textContent).toContain('Save');
    expect(codeBlock()).toBeNull();
  });

  it('starts on the code tab when defaultTab is code', () => {
    createHost({ defaultTab: 'code' });
    expect(previewCode().getAttribute('data-active-tab')).toBe('code');
    expect(codeBlock()).not.toBeNull();
  });

  it('switches tabs uncontrolled and emits activeTabChange', () => {
    createHost();
    segmentedItems()[1].click();
    fixture.detectChanges();
    expect(previewCode().getAttribute('data-active-tab')).toBe('code');
    expect(fixture.componentInstance.changedTabs).toEqual(['code']);
    expect(codeBlock()).not.toBeNull();
  });

  it('leaves no height locks behind when heights cannot be measured', () => {
    createHost();
    segmentedItems()[1].click();
    fixture.detectChanges();
    expect(previewCode().getAttribute('data-active-tab')).toBe('code');
    expect(frame().style.height).toBe('');
    expect(
      frame().classList.contains('solaris-preview-code__frame--tab-sizing'),
    ).toBe(false);
  });

  it('tweens the frame height between tabs of different heights', async () => {
    createHost();
    const target = frame();
    const outgoingPanel = element().querySelector(
      '.solaris-preview-code__panel--preview',
    ) as Element;
    const rectOf = (height: number): DOMRect =>
      ({
        height,
        width: 100,
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: 100,
        bottom: height,
        toJSON: () => ({}),
      }) as DOMRect;
    const heights = new Map<Element, number[]>([
      [target, [400, 120]],
      [outgoingPanel, [340]],
    ]);
    const measure = vi
      .spyOn(Element.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: Element) {
        if (this.classList?.contains('solaris-code-block__frame')) {
          return rectOf(60);
        }
        return rectOf(heights.get(this)?.shift() ?? 0);
      });

    segmentedItems()[1].click();
    const box = element().querySelector(
      '.solaris-code-block__frame',
    ) as HTMLElement;
    expect(
      target.classList.contains('solaris-preview-code__frame--tab-sizing'),
    ).toBe(true);
    expect(target.style.height).toBe('120px');
    expect(box.style.height).toBe('60px');
    expect(box.style.minBlockSize).toBe('0px');
    expect(box.style.boxSizing).toBe('border-box');
    expect(box.style.overflow).toBe('hidden');
    expect(box.style.transition).toContain('height');
    fixture.detectChanges();
    expect(previewCode().getAttribute('data-active-tab')).toBe('code');
    await new Promise((resolve) => setTimeout(resolve, 450));
    fixture.detectChanges();
    expect(target.style.height).toBe('');
    expect(
      target.classList.contains('solaris-preview-code__frame--tab-sizing'),
    ).toBe(false);
    expect(box.style.height).toBe('');
    expect(box.style.minBlockSize).toBe('');
    expect(box.style.boxSizing).toBe('');
    expect(box.style.overflow).toBe('');
    expect(box.style.transition).toBe('');
    measure.mockRestore();
  });

  it('keeps controlled activeTab and still emits on user intent', () => {
    createHost({ activeTab: 'preview' });
    segmentedItems()[1].click();
    fixture.detectChanges();
    expect(previewCode().getAttribute('data-active-tab')).toBe('preview');
    expect(fixture.componentInstance.changedTabs).toEqual(['code']);
  });

  it('supports two-way activeTab binding through input and output', () => {
    createHost({ activeTab: 'preview' });
    const host = fixture.componentInstance;
    host.handleActiveTabChange = (tab: SolarisPreviewCodeTab) => {
      host.changedTabs.push(tab);
      host.activeTab = tab;
    };
    segmentedItems()[1].click();
    fixture.detectChanges();
    expect(previewCode().getAttribute('data-active-tab')).toBe('code');
  });

  it('falls back to the first file when the default id is unknown', () => {
    createHost({
      codeFiles: [
        { id: 'html', label: 'HTML', language: 'html', code: '<b>hi</b>' },
        { id: 'ts', label: 'TS', language: 'typescript', code: 'const a = 1;' },
      ],
      defaultCodeFile: 'missing-id',
      defaultTab: 'code',
    });
    expect(codeBlock()).not.toBeNull();
  });

  it('honours defaultCodeFile when the id exists', () => {
    createHost({
      codeFiles: [
        { id: 'html', label: 'HTML', language: 'html', code: '<b>hi</b>' },
        { id: 'ts', label: 'TS', language: 'typescript', code: 'const a = 1;' },
      ],
      defaultCodeFile: 'ts',
      defaultTab: 'code',
    });
    expect(codeBlock()).not.toBeNull();
    expect(codeBlock()?.getAttribute('data-size')).toBe('md');
  });

  it('inherits appearance and size into the code block', () => {
    createHost({
      defaultTab: 'code',
      appearance: 'surface',
      size: 'lg',
    });
    expect(codeBlock()?.getAttribute('data-appearance')).toBe('surface');
    expect(codeBlock()?.getAttribute('data-size')).toBe('lg');
  });

  it('supports code block appearance and size overrides', () => {
    createHost({
      defaultTab: 'code',
      appearance: 'surface',
      size: 'lg',
      codeBlockAppearance: 'outline',
      codeBlockSize: 'sm',
    });
    expect(codeBlock()?.getAttribute('data-appearance')).toBe('outline');
    expect(codeBlock()?.getAttribute('data-size')).toBe('sm');
  });

  it('forwards expandable code settings to the code block', () => {
    createHost({
      code: ['a', 'b', 'c', 'd', 'e'].join('\n'),
      language: 'text',
      defaultTab: 'code',
      codeExpandable: true,
      codeCollapsedLines: 2,
    });
    expect(codeBlock()?.getAttribute('data-collapsible')).toBe('true');
  });

  it('resolves translated labels for tabs and panels', () => {
    createHost({
      previewLabelKey: 'spec.previewCode.preview',
      codeLabelKey: 'spec.previewCode.code',
      ariaLabelKey: 'spec.previewCode.aria',
      defaultTab: 'code',
    });
    expect(panels()[0].getAttribute('aria-label')).toBe('Source code');
    const segmented = element().querySelector('solaris-segmented-control');
    expect(segmented?.getAttribute('aria-label')).toBe(
      'Preview and source tabs',
    );
  });

  it('exposes labelled tabpanels with controls association', () => {
    createHost({ defaultTab: 'code' });
    const panel = panels()[0];
    expect(panel.getAttribute('role')).toBe('tabpanel');
    expect(panel.getAttribute('id')).toContain(
      'solaris-preview-code-panel-code-',
    );
    expect(segmentedItems()[1].getAttribute('aria-controls')).toBe(
      panel.getAttribute('id'),
    );
  });

  it('removes the inactive panel from the DOM', () => {
    createHost();
    expect(
      element().querySelector('.solaris-preview-code__panel--code'),
    ).toBeNull();
    expect(
      element().querySelector('.solaris-preview-code__panel--preview'),
    ).not.toBeNull();
  });

  it('reflects preview layout variants as data attributes', () => {
    createHost({
      previewAlign: 'stretch',
      previewMinHeight: 'lg',
      previewPadding: 'sm',
    });
    expect(previewCode().getAttribute('data-preview-align')).toBe('stretch');
    expect(previewCode().getAttribute('data-preview-min-height')).toBe('lg');
    expect(previewCode().getAttribute('data-preview-padding')).toBe('sm');
  });

  it('normalizes invalid tab and layout values to defaults', () => {
    createHost({
      defaultTab: 'invalid-tab' as SolarisPreviewCodeTab,
      previewAlign: 'invalid-align' as SolarisPreviewCodeAlign,
    });
    expect(previewCode().getAttribute('data-active-tab')).toBe('preview');
    expect(previewCode().getAttribute('data-preview-align')).toBe('center');
  });

  it('supports keyboard activation through the segmented control', () => {
    createHost();
    const codeItem = segmentedItems()[1];
    codeItem.focus();
    codeItem.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    fixture.detectChanges();
    expect(previewCode().getAttribute('data-active-tab')).toBe('code');
    expect(fixture.componentInstance.changedTabs).toEqual(['code']);
  });
});
