import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';
import { provideSolarisCodeHighlighter } from '../model/code-block.tokens';
import { provideSolarisShikiHighlighter } from '../shiki/code-block-shiki.provider';
import type {
  SolarisCodeHighlightResult,
  SolarisCodeHighlighter,
} from '../model/code-block.types';
import { SolarisCodeBlockComponent } from '../component/code-block.component';

const TEST_TRANSLATIONS = {
  'en-US': {
    'solaris.codeBlock.ariaLabel': 'Code block',
    'solaris.codeBlock.commandSelector.ariaLabel': 'Command selector',
    'solaris.codeBlock.copy': 'Copy code',
    'solaris.codeBlock.copied': 'Code copied',
    'solaris.codeBlock.expand': 'Expand code',
    'solaris.codeBlock.collapse': 'Collapse code',
    'solaris.codeBlock.edit': 'Edit code',
    'solaris.codeBlock.save': 'Save changes',
    'solaris.codeBlock.cancel': 'Cancel editing',
    'custom.copy.label': 'Copiar código',
  },
};

const MULTILINE_CODE = [
  'const answer = 42;',
  'function greet(name: string) {',
  '  return `Hello ${name}`;',
  '}',
  "console.log(greet('Solaris'));",
].join('\n');

describe('SolarisCodeBlockComponent', () => {
  let fixture: ComponentFixture<SolarisCodeBlockComponent>;

  async function configureTestingModule(
    translate = true,
    extraProviders: unknown[] = [],
  ): Promise<void> {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [SolarisCodeBlockComponent],
      providers: [
        ...(translate
          ? provideSolarisTesting({
              translate: { translations: TEST_TRANSLATIONS },
            })
          : provideSolarisTesting()),
        ...(extraProviders as never[]),
      ],
    }).compileComponents();
  }

  function createComponent(
    inputs: Record<string, unknown> = {},
  ): ComponentFixture<SolarisCodeBlockComponent> {
    fixture = TestBed.createComponent(SolarisCodeBlockComponent);
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    fixture.detectChanges();
    return fixture;
  }

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function codeElement(): HTMLElement {
    return fixture.nativeElement.querySelector('code') as HTMLElement;
  }

  function preElement(): HTMLElement | null {
    return fixture.nativeElement.querySelector(
      '.solaris-code-block__pre',
    ) as HTMLElement | null;
  }

  function viewport(): HTMLElement | null {
    return fixture.nativeElement.querySelector(
      '.solaris-code-block__viewport',
    ) as HTMLElement | null;
  }

  function copyButton(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector(
      '.solaris-code-block__icon-button',
    ) as HTMLButtonElement | null;
  }

  function expandButton(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector(
      '.solaris-code-block__toggle-button',
    ) as HTMLButtonElement | null;
  }

  function editToggleButton(): HTMLButtonElement | null {
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll(
        '.solaris-code-block__actions .solaris-code-block__icon-button',
      ) as NodeListOf<HTMLButtonElement>,
    );
    return (
      buttons.find(
        (button) =>
          button.getAttribute('aria-label') === 'Edit code' ||
          button.getAttribute('aria-label') === 'Save changes',
      ) ?? null
    );
  }

  function cancelButton(): HTMLButtonElement | null {
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll(
        '.solaris-code-block__actions .solaris-code-block__icon-button',
      ) as NodeListOf<HTMLButtonElement>,
    );
    return (
      buttons.find(
        (button) => button.getAttribute('aria-label') === 'Cancel editing',
      ) ?? null
    );
  }

  function editor(): HTMLTextAreaElement | null {
    return fixture.nativeElement.querySelector(
      '.solaris-code-block__editor',
    ) as HTMLTextAreaElement | null;
  }

  function selectorItems(): HTMLElement[] {
    return Array.from(
      fixture.nativeElement.querySelectorAll('solaris-segmented-item'),
    ) as HTMLElement[];
  }

  function mockClipboard(
    writeText: ReturnType<typeof vi.fn> = vi.fn().mockResolvedValue(undefined),
  ): ReturnType<typeof vi.fn> {
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    return writeText;
  }

  function deferred<T>(): { promise: Promise<T>; resolve: (value: T) => void } {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((innerResolve) => {
      resolve = innerResolve;
    });
    return { promise, resolve };
  }

  async function flushHighlight(): Promise<void> {
    await fixture.whenStable();
    await Promise.resolve();
    await Promise.resolve();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await configureTestingModule();
  });

  afterEach(() => {
    fixture?.destroy();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    createComponent();
    expect(fixture.componentInstance).toBeTruthy();
    expect(host()).toBeTruthy();
  });

  it('should render block layout by default', () => {
    createComponent({ code: 'const answer = 42;' });
    expect(host().getAttribute('data-layout')).toBe('block');
    expect(fixture.nativeElement.querySelector('pre')).toBeTruthy();
  });

  it('should support inline layout', () => {
    createComponent({ code: 'pnpm nx build angular', layout: 'inline' });
    expect(host().getAttribute('data-layout')).toBe('inline');
    expect(fixture.nativeElement.querySelector('pre')).toBeNull();
    expect(
      fixture.nativeElement.querySelector('.solaris-code-block__inline-shell'),
    ).toBeTruthy();
  });

  it('should default to surface appearance and md size', () => {
    createComponent({ code: 'const answer = 42;' });
    expect(host().getAttribute('data-appearance')).toBe('surface');
    expect(host().getAttribute('data-size')).toBe('md');
  });

  it('should support outline appearance', () => {
    createComponent({ code: 'const answer = 42;', appearance: 'outline' });
    expect(host().getAttribute('data-appearance')).toBe('outline');
  });

  it('should fall back to surface for unknown appearances', () => {
    createComponent({ code: 'const answer = 42;', appearance: 'glass' });
    expect(host().getAttribute('data-appearance')).toBe('surface');
  });

  it('should apply size, radius, and density attributes', () => {
    createComponent({
      code: 'const answer = 42;',
      size: 'lg',
      radius: 'xl',
      density: 'compact',
    });
    expect(host().getAttribute('data-size')).toBe('lg');
    expect(host().getAttribute('data-radius')).toBe('xl');
    expect(host().getAttribute('data-density')).toBe('compact');
  });

  it('should inherit density from the theme service when not provided', () => {
    createComponent({ code: 'const answer = 42;' });
    expect(host().getAttribute('data-density')).toBe('normal');
  });

  it('should render code input preserving whitespace without blank lines', () => {
    const code = 'function test() {\n  return 42;\n}';
    createComponent({ code, language: 'typescript' });
    const rendered = Array.from(
      fixture.nativeElement.querySelectorAll(
        '.solaris-code-block__line',
      ) as NodeListOf<HTMLElement>,
    ).map((line) => line.textContent ?? '');
    expect(rendered).toHaveLength(3);
    expect(rendered.join('\n')).toBe(code);
    expect(
      fixture.nativeElement.querySelector('.solaris-code-block__line-break'),
    ).toBeNull();
  });

  it('should separate inline lines with explicit line breaks', () => {
    createComponent({
      code: 'first\nsecond',
      language: 'text',
      layout: 'inline',
    });
    expect(
      fixture.nativeElement.querySelectorAll('.solaris-code-block__line-break'),
    ).toHaveLength(1);
    expect(codeElement().textContent).toBe('first\nsecond');
  });

  it('should highlight code with the Shiki provider when registered', async () => {
    await configureTestingModule(true, [provideSolarisShikiHighlighter()]);
    createComponent({ code: 'const answer = 42;', language: 'typescript' });
    await vi.waitFor(
      () => {
        fixture.detectChanges();
        const styled = fixture.nativeElement.querySelector(
          '.solaris-code-block__line span[style*="color"]',
        ) as HTMLElement | null;
        expect(styled?.textContent).toBe('const');
      },
      { timeout: 20000, interval: 100 },
    );
  });

  it('should handle empty, null, and undefined code safely', () => {
    createComponent({ code: '' });
    expect(codeElement().textContent).toBe('');
    expect(host().getAttribute('data-empty')).toBe('true');
  });

  it('should render a language label and badge fallback for languages without icons', () => {
    createComponent({ code: '.a { color: red; }', language: 'css' });
    const label = fixture.nativeElement.querySelector(
      '.solaris-code-block__identity-label',
    ) as HTMLElement;
    const badge = fixture.nativeElement.querySelector(
      '.solaris-code-block__badge',
    ) as HTMLElement;
    expect(label.textContent?.trim()).toBe('CSS');
    expect(badge.textContent?.trim()).toBe('CSS');
  });

  it('should render language identity icons filled, not outlined', () => {
    createComponent({ code: 'pnpm nx build angular', language: 'shell' });
    const svg = fixture.nativeElement.querySelector(
      '.solaris-code-block__identity-icon svg',
    ) as SVGElement | null;
    expect(svg?.getAttribute('fill')).toBe('currentColor');
    expect(svg?.getAttribute('stroke')).toBe('none');
  });

  it('should apply evenodd fill-rule to compound language glyphs', () => {
    createComponent({ code: 'const answer = 42;', language: 'typescript' });
    const path = fixture.nativeElement.querySelector(
      '.solaris-code-block__identity-icon svg path',
    ) as SVGElement | null;
    expect(path?.getAttribute('fill-rule')).toBe('evenodd');
  });

  it('should render a registry icon for known language keys', () => {
    createComponent({ code: 'pnpm nx build angular', language: 'shell' });
    expect(
      fixture.nativeElement.querySelector('.solaris-code-block__identity-icon'),
    ).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector('.solaris-code-block__badge'),
    ).toBeNull();
  });

  it('should honor the identityLabel override instead of the language icon', () => {
    createComponent({
      code: 'pnpm nx build angular',
      language: 'shell',
      identityLabel: 'Terminal',
    });
    const label = fixture.nativeElement.querySelector(
      '.solaris-code-block__identity-label',
    ) as HTMLElement;
    expect(label.textContent?.trim()).toBe('Terminal');
    expect(
      fixture.nativeElement.querySelector('.solaris-code-block__identity-icon'),
    ).toBeNull();
  });

  it('should show the action icon in inline layout', () => {
    createComponent({ code: 'pnpm nx build angular', layout: 'inline' });
    const button = fixture.nativeElement.querySelector(
      '.solaris-code-block__inline-shell .solaris-code-block__icon-button',
    ) as HTMLElement | null;
    const visibleIcon = button?.querySelector(
      '.solaris-code-block__action-icon--visible svg',
    );
    expect(button).toBeTruthy();
    expect(visibleIcon).toBeTruthy();
  });

  it('should translate the copy button title through labelKey', () => {
    createComponent({
      code: 'const answer = 42;',
      copyLabelKey: 'custom.copy.label',
    });
    expect(copyButton()?.getAttribute('title')).toBe('Copiar código');
    expect(copyButton()?.getAttribute('aria-label')).toBe('Copiar código');
  });

  it('should render the copy button by default with an accessible label', () => {
    createComponent({ code: 'const answer = 42;' });
    expect(copyButton()).toBeTruthy();
    expect(copyButton()?.getAttribute('aria-label')).toBe('Copy code');
  });

  it('should hide the copy button when copyable is false', () => {
    createComponent({ code: 'const answer = 42;', copyable: false });
    expect(copyButton()).toBeNull();
  });

  it('should copy visible code, emit copied, and announce success', async () => {
    const writeText = mockClipboard();
    createComponent({ code: 'const answer = 42;' });
    const emitted: string[] = [];
    fixture.componentInstance.copied.subscribe((value) => emitted.push(value));

    copyButton()?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(writeText).toHaveBeenCalledWith('const answer = 42;');
    expect(copyButton()?.getAttribute('aria-label')).toBe('Code copied');
    expect(emitted).toEqual(['const answer = 42;']);
    const live = fixture.nativeElement.querySelector(
      '[aria-live="polite"]',
    ) as HTMLElement;
    expect(live.textContent).toBe('Code copied');
  });

  it('should reset the copied state after copiedDuration', async () => {
    vi.useFakeTimers();
    mockClipboard();
    createComponent({ code: 'const answer = 42;', copiedDuration: 50 });

    copyButton()?.click();
    await vi.advanceTimersByTimeAsync(0);
    fixture.detectChanges();
    expect(copyButton()?.getAttribute('aria-label')).toBe('Code copied');

    await vi.advanceTimersByTimeAsync(50);
    fixture.detectChanges();
    expect(copyButton()?.getAttribute('aria-label')).toBe('Copy code');
  });

  it('should not show copied state when clipboard copy fails', async () => {
    mockClipboard(vi.fn().mockRejectedValue(new Error('denied')));
    createComponent({ code: 'const answer = 42;' });

    copyButton()?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(copyButton()?.getAttribute('aria-label')).toBe('Copy code');
  });

  it('should fail gracefully when the Clipboard API is unavailable', async () => {
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    });
    createComponent({ code: 'const answer = 42;' });

    copyButton()?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(copyButton()?.getAttribute('aria-label')).toBe('Copy code');
  });

  it('should show expand controls only for long block content', () => {
    createComponent({
      code: MULTILINE_CODE,
      expandable: true,
      collapsedLines: 3,
    });
    expect(expandButton()).toBeTruthy();
    expect(host().getAttribute('data-collapsible')).toBe('true');
    expect(host().getAttribute('data-expanded')).toBe('false');
  });

  it('should not show expand controls for inline layout', () => {
    createComponent({
      code: MULTILINE_CODE,
      layout: 'inline',
      expandable: true,
      collapsedLines: 1,
    });
    expect(expandButton()).toBeNull();
  });

  it('should emit expandedChange when toggling expansion', () => {
    createComponent({
      code: MULTILINE_CODE,
      expandable: true,
      collapsedLines: 3,
    });
    const emitted: boolean[] = [];
    fixture.componentInstance.expandedChange.subscribe((value) =>
      emitted.push(value),
    );

    expandButton()?.click();
    fixture.detectChanges();

    expect(host().getAttribute('data-expanded')).toBe('true');
    expect(expandButton()?.getAttribute('aria-expanded')).toBe('true');
    expect(emitted).toEqual([true]);
  });

  it('should honor the expanded input', () => {
    createComponent({
      code: MULTILINE_CODE,
      expandable: true,
      collapsedLines: 3,
      expanded: true,
    });
    expect(host().getAttribute('data-expanded')).toBe('true');
    expect(expandButton()?.textContent?.trim()).toBe('Collapse code');
  });

  it('should leave no inline height residue after toggling expansion', () => {
    createComponent({
      code: MULTILINE_CODE,
      expandable: true,
      collapsedLines: 3,
    });

    expandButton()?.click();
    fixture.detectChanges();
    expect(host().getAttribute('data-expanded')).toBe('true');
    expect(viewport()?.style.maxHeight).toBe('');
    expect(
      viewport()?.classList.contains('solaris-code-block__viewport--animating'),
    ).toBe(false);

    expandButton()?.click();
    fixture.detectChanges();
    expect(host().getAttribute('data-expanded')).toBe('false');
    expect(viewport()?.style.maxHeight).toBe('');
    expect(
      viewport()?.classList.contains('solaris-code-block__viewport--animating'),
    ).toBe(false);
  });

  it('should render the first command by default', () => {
    createComponent({
      variant: 'command',
      commands: [
        { id: 'pnpm', label: 'pnpm', code: 'pnpm add x', language: 'shell' },
        { id: 'npm', label: 'npm', code: 'npm install x', language: 'shell' },
      ],
    });
    expect(codeElement().textContent).toBe('pnpm add x');
  });

  it('should honor selectedCommand and emit selectedCommandChange', async () => {
    createComponent({
      variant: 'command',
      selectedCommand: 'npm',
      commands: [
        { id: 'pnpm', label: 'pnpm', code: 'pnpm add x', language: 'shell' },
        { id: 'npm', label: 'npm', code: 'npm install x', language: 'shell' },
      ],
    });
    const emitted: Array<string | null> = [];
    fixture.componentInstance.selectedCommandChange.subscribe((value) =>
      emitted.push(value),
    );
    expect(codeElement().textContent).toBe('npm install x');

    selectorItems()[0]?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(codeElement().textContent).toBe('pnpm add x');
    expect(emitted).toEqual(['pnpm']);
  });

  it('should replay a content swap fade when switching commands', async () => {
    createComponent({
      variant: 'command',
      commands: [
        { id: 'pnpm', label: 'pnpm', code: 'pnpm add x', language: 'shell' },
        { id: 'npm', label: 'npm', code: 'npm install x', language: 'shell' },
      ],
    });
    expect(
      preElement()?.classList.contains('solaris-code-block__pre--swap'),
    ).toBe(false);

    selectorItems()[1]?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(codeElement().textContent).toBe('npm install x');
    expect(
      preElement()?.classList.contains('solaris-code-block__pre--swap'),
    ).toBe(true);
  });

  it('should skip the swap fade under reduced motion', async () => {
    document.documentElement.setAttribute('data-reduced-motion', 'true');
    try {
      createComponent({
        variant: 'command',
        commands: [
          { id: 'pnpm', label: 'pnpm', code: 'pnpm add x', language: 'shell' },
          { id: 'npm', label: 'npm', code: 'npm install x', language: 'shell' },
        ],
      });

      selectorItems()[1]?.click();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(codeElement().textContent).toBe('npm install x');
      expect(
        preElement()?.classList.contains('solaris-code-block__pre--swap'),
      ).toBe(false);
    } finally {
      document.documentElement.removeAttribute('data-reduced-motion');
    }
  });

  it('should render the command selector only with multiple commands', () => {
    createComponent({
      variant: 'command',
      commands: [{ id: 'pnpm', label: 'pnpm', code: 'pnpm add x' }],
    });
    expect(
      fixture.nativeElement.querySelector('solaris-segmented-control'),
    ).toBeNull();

    createComponent({
      variant: 'command',
      commands: [
        { id: 'pnpm', label: 'pnpm', code: 'pnpm add x' },
        { id: 'npm', label: 'npm', code: 'npm install x' },
      ],
    });
    expect(
      fixture.nativeElement.querySelector('solaris-segmented-control'),
    ).toBeTruthy();
    expect(selectorItems()).toHaveLength(2);
  });

  it('should highlight keywords with the built-in fallback', () => {
    createComponent({ code: 'const answer = 42;', language: 'typescript' });
    const token = fixture.nativeElement.querySelector(
      '[data-token-kind="keyword"]',
    ) as HTMLElement;
    expect(token?.textContent).toBe('const');
  });

  it('should support language aliases in the fallback highlighter', () => {
    createComponent({ code: 'const answer = 42;', language: 'ts' });
    const token = fixture.nativeElement.querySelector(
      '[data-token-kind="keyword"]',
    ) as HTMLElement;
    expect(token?.textContent).toBe('const');
    expect(codeElement().getAttribute('data-language')).toBe('typescript');
  });

  it('should invoke a custom sync highlighter adapter', async () => {
    const highlight = vi.fn(
      (code: string): SolarisCodeHighlightResult => ({
        language: 'text',
        lines: [{ tokens: [{ text: `custom:${code}`, kind: 'builtin' }] }],
      }),
    );
    await configureTestingModule(true, [
      provideSolarisCodeHighlighter({ highlight }),
    ]);
    createComponent({ code: 'echo test' });

    expect(highlight).toHaveBeenCalledWith('echo test', 'text', {
      colorScheme: 'light',
    });
    expect(codeElement().textContent).toBe('custom:echo test');
  });

  it('should resolve async highlighters and ignore stale results', async () => {
    const pendingByCode = new Map<
      string,
      {
        promise: Promise<SolarisCodeHighlightResult>;
        resolve: (v: SolarisCodeHighlightResult) => void;
      }
    >();
    const highlight = vi.fn((code: string) => {
      const gate = deferred<SolarisCodeHighlightResult>();
      pendingByCode.set(code, gate);
      return gate.promise;
    });
    await configureTestingModule(true, [
      provideSolarisCodeHighlighter({ highlight } as SolarisCodeHighlighter),
    ]);
    createComponent({ code: 'first', language: 'typescript' });

    fixture.componentRef.setInput('code', 'second');
    fixture.detectChanges();

    pendingByCode.get('second')?.resolve({
      language: 'typescript',
      lines: [{ tokens: [{ text: 'second', kind: 'builtin' }] }],
    });
    await flushHighlight();
    expect(codeElement().textContent).toBe('second');

    pendingByCode.get('first')?.resolve({
      language: 'typescript',
      lines: [{ tokens: [{ text: 'first', kind: 'builtin' }] }],
    });
    await flushHighlight();
    expect(codeElement().textContent).toBe('second');
  });

  it('should fall back to plain code when the custom highlighter throws', async () => {
    const highlight = (): SolarisCodeHighlightResult => {
      throw new Error('boom');
    };
    await configureTestingModule(true, [
      provideSolarisCodeHighlighter({ highlight } as SolarisCodeHighlighter),
    ]);
    createComponent({ code: 'const answer = 42;', language: 'typescript' });
    expect(codeElement().textContent).toBe('const answer = 42;');
  });

  it('should copy raw code instead of highlighted output', async () => {
    const writeText = mockClipboard();
    await configureTestingModule(true, [
      provideSolarisCodeHighlighter({
        highlight: () => ({
          language: 'shell',
          lines: [{ tokens: [{ text: 'decorated', kind: 'builtin' }] }],
        }),
      }),
    ]);
    createComponent({ code: 'pnpm nx build angular', language: 'shell' });

    copyButton()?.click();
    await fixture.whenStable();

    expect(writeText).toHaveBeenCalledWith('pnpm nx build angular');
  });

  it('should label the code region and support direct overrides', () => {
    createComponent({
      code: 'const answer = 42;',
      ariaLabel: 'Installation example',
    });
    expect(viewport()?.getAttribute('aria-label')).toBe('Installation example');
    expect(viewport()?.getAttribute('role')).toBe('region');
  });

  it('should translate labels through labelKey inputs', () => {
    createComponent({
      code: 'const answer = 42;',
      copyLabelKey: 'solaris.codeBlock.copy',
      ariaLabelKey: 'solaris.codeBlock.ariaLabel',
    });
    expect(copyButton()?.getAttribute('aria-label')).toBe('Copy code');
    expect(viewport()?.getAttribute('aria-label')).toBe('Code block');
  });

  it('should activate copy and expand through keyboard', async () => {
    const writeText = mockClipboard();
    createComponent({
      code: MULTILINE_CODE,
      expandable: true,
      collapsedLines: 3,
    });

    copyButton()?.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true }),
    );
    await fixture.whenStable();
    fixture.detectChanges();

    expandButton()?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    fixture.detectChanges();

    expect(writeText).toHaveBeenCalledWith(MULTILINE_CODE);
    expect(host().getAttribute('data-expanded')).toBe('true');
  });

  it('should hide the edit action unless editable', () => {
    createComponent({ code: 'const answer = 42;' });
    expect(editToggleButton()).toBeNull();

    createComponent({ code: 'const answer = 42;', editable: true });
    expect(editToggleButton()).toBeTruthy();
    expect(editToggleButton()?.getAttribute('aria-label')).toBe('Edit code');
    expect(host().getAttribute('data-editing')).toBe('false');
  });

  it('should not show the edit action for inline layout', () => {
    createComponent({
      code: 'pnpm nx build angular',
      layout: 'inline',
      editable: true,
    });
    expect(editToggleButton()).toBeNull();
  });

  it('should enter editing with the visible code as draft', () => {
    createComponent({ code: 'const answer = 42;', editable: true });
    const editingStates: boolean[] = [];
    fixture.componentInstance.editingChange.subscribe((value) =>
      editingStates.push(value),
    );

    editToggleButton()?.click();
    fixture.detectChanges();

    expect(host().getAttribute('data-editing')).toBe('true');
    expect(editor()?.value).toBe('const answer = 42;');
    expect(editToggleButton()?.getAttribute('aria-label')).toBe('Save changes');
    expect(cancelButton()).toBeTruthy();
    const actionLabels = Array.from(
      fixture.nativeElement.querySelectorAll(
        '.solaris-code-block__actions .solaris-code-block__icon-button',
      ) as NodeListOf<HTMLButtonElement>,
    ).map((button) => button.getAttribute('aria-label'));
    expect(actionLabels).not.toContain('Copy code');
    expect(editingStates).toEqual([true]);
  });

  it('should morph the edit button into save and emit codeChange', () => {
    createComponent({ code: 'const answer = 42;', editable: true });
    const changed: string[] = [];
    fixture.componentInstance.codeChange.subscribe((value) =>
      changed.push(value),
    );

    editToggleButton()?.click();
    fixture.detectChanges();

    const textarea = editor() as HTMLTextAreaElement;
    textarea.value = 'const edited = 1;';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    editToggleButton()?.click();
    fixture.detectChanges();

    expect(changed).toEqual(['const edited = 1;']);
    expect(host().getAttribute('data-editing')).toBe('false');
    expect(editor()).toBeNull();
    expect(editToggleButton()?.getAttribute('aria-label')).toBe('Edit code');
  });

  it('should discard the draft on cancel', () => {
    createComponent({ code: 'const answer = 42;', editable: true });
    const changed: string[] = [];
    fixture.componentInstance.codeChange.subscribe((value) =>
      changed.push(value),
    );

    editToggleButton()?.click();
    fixture.detectChanges();

    const textarea = editor() as HTMLTextAreaElement;
    textarea.value = 'const edited = 1;';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    cancelButton()?.click();
    fixture.detectChanges();

    expect(changed).toEqual([]);
    expect(host().getAttribute('data-editing')).toBe('false');
    expect(codeElement().textContent).toBe('const answer = 42;');
  });

  it('should cancel on Escape and save on Ctrl+Enter', () => {
    createComponent({ code: 'const answer = 42;', editable: true });
    const changed: string[] = [];
    fixture.componentInstance.codeChange.subscribe((value) =>
      changed.push(value),
    );

    editToggleButton()?.click();
    fixture.detectChanges();
    editor()?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();
    expect(changed).toEqual([]);
    expect(host().getAttribute('data-editing')).toBe('false');

    editToggleButton()?.click();
    fixture.detectChanges();
    const textarea = editor() as HTMLTextAreaElement;
    textarea.value = 'const saved = true;';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        ctrlKey: true,
        bubbles: true,
      }),
    );
    fixture.detectChanges();
    expect(changed).toEqual(['const saved = true;']);
    expect(host().getAttribute('data-editing')).toBe('false');
  });

  it('should keep the viewport expanded while editing collapsed content', () => {
    createComponent({
      code: MULTILINE_CODE,
      expandable: true,
      collapsedLines: 3,
      editable: true,
    });
    expect(expandButton()).toBeTruthy();

    editToggleButton()?.click();
    fixture.detectChanges();

    expect(host().getAttribute('data-expanded')).toBe('true');
    expect(expandButton()).toBeNull();
  });
});
