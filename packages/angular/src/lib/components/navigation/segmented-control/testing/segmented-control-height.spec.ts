import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';

import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';
import { provideSolaris } from '../../../../providers/provide-solaris';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../services/icon/icons/solaris-built-in-icons';
import { SolarisSegmentedControlComponent } from '../component/segmented-control.component';
import { SolarisSegmentedItemComponent } from '../item/segmented-item.component';

/**
 * Regression: segmented-control outer height must land exactly on the
 * control-height ladder while content + padding always stays below the
 * token (so nothing clips).
 *
 * Context: the `lg/normal + fullWidth` case (Mensal/Anual) clipped, the host
 * `font: ... /1` fought the label `line-height-sm (1.4)`, and the selection
 * indicator went stale in fixed-width layouts. This spec parses the style
 * sheets and fails if any of the 9 size x density combinations stops pinning
 * `min-height` to its own token, lets content + padding reach the token, or
 * loses the fullWidth ellipsis shrink path.
 */
describe('Segmented control height ladder', () => {
  const SPACING_PX: Record<string, number> = {
    'spacing-0': 0,
    'spacing-1': 1,
    'spacing-2': 2,
    'spacing-3': 4,
    'spacing-4': 6,
    'spacing-5': 8,
    'spacing-6': 12,
    'spacing-7': 16,
    'spacing-8': 20,
    'spacing-9': 24,
    'spacing-10': 32,
  };
  const FONT_PX: Record<string, number> = {
    'font-size-xs': 14,
    'font-size-sm': 16,
    'font-size-md': 18,
    'font-size-lg': 20,
    'font-size-xl': 24,
  };
  const LINE_HEIGHT_SM = 1.4;
  const TOKEN: Record<string, { token: string; px: number }> = {
    'compact-sm': { token: 'control-height-compact-sm', px: 28 },
    'compact-md': { token: 'control-height-compact-md', px: 32 },
    'compact-lg': { token: 'control-height-compact-lg', px: 36 },
    'normal-sm': { token: 'control-height-normal-sm', px: 36 },
    'normal-md': { token: 'control-height-normal-md', px: 40 },
    'normal-lg': { token: 'control-height-normal-lg', px: 44 },
    'comfortable-sm': { token: 'control-height-comfortable-sm', px: 44 },
    'comfortable-md': { token: 'control-height-comfortable-md', px: 48 },
    'comfortable-lg': { token: 'control-height-comfortable-lg', px: 52 },
  };

  interface LadderRow {
    size: 'sm' | 'md' | 'lg';
    density: 'compact' | 'normal' | 'comfortable';
    font: string;
    itemPaddingY: string;
  }

  const LADDER: LadderRow[] = [
    {
      size: 'sm',
      density: 'compact',
      font: 'font-size-xs',
      itemPaddingY: 'spacing-2',
    },
    {
      size: 'md',
      density: 'compact',
      font: 'font-size-xs',
      itemPaddingY: 'spacing-3',
    },
    {
      size: 'lg',
      density: 'compact',
      font: 'font-size-sm',
      itemPaddingY: 'spacing-4',
    },
    {
      size: 'sm',
      density: 'normal',
      font: 'font-size-sm',
      itemPaddingY: 'spacing-4',
    },
    {
      size: 'md',
      density: 'normal',
      font: 'font-size-sm',
      itemPaddingY: 'spacing-5',
    },
    {
      size: 'lg',
      density: 'normal',
      font: 'font-size-lg',
      itemPaddingY: 'spacing-4',
    },
    {
      size: 'sm',
      density: 'comfortable',
      font: 'font-size-lg',
      itemPaddingY: 'spacing-4',
    },
    {
      size: 'md',
      density: 'comfortable',
      font: 'font-size-lg',
      itemPaddingY: 'spacing-5',
    },
    {
      size: 'lg',
      density: 'comfortable',
      font: 'font-size-lg',
      itemPaddingY: 'spacing-5',
    },
  ];

  let controlScss = '';
  let itemScss = '';

  beforeAll(async () => {
    const { readFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const { dirname, resolve } = await import('node:path');
    const here = dirname(fileURLToPath(import.meta.url));
    controlScss = readFileSync(
      resolve(here, '../component/segmented-control.component.scss'),
      'utf8',
    );
    itemScss = readFileSync(
      resolve(here, '../item/segmented-item.component.scss'),
      'utf8',
    );
  });

  function comboBlock(size: string, density: string): string {
    const selector = `&[data-size='${size}'][data-density='${density}'] {`;
    const start = controlScss.indexOf(selector);
    expect(start).toBeGreaterThan(-1);
    const open = controlScss.indexOf('{', start);
    const close = controlScss.indexOf('}', open);
    return controlScss.slice(open + 1, close);
  }

  function varToken(body: string, name: string): string {
    const declaration = body
      .split(';')
      .find((part) => part.includes(`${name}:`));
    expect(declaration).toBeTruthy();
    const match = declaration?.match(/--solaris-(spacing-\d+|font-size-\w+)/);
    expect(match?.[1]).toBeTruthy();
    return match?.[1] as string;
  }

  it('pins the floor to the own control-height token (exact outer height, never an alias)', () => {
    const all = Object.values(TOKEN).map((t) => t.token);
    for (const row of LADDER) {
      const body = comboBlock(row.size, row.density)
        .replace(/\s+/g, ' ')
        .replace(/var\(\s*([^)]*?)\s*\)/g, 'var($1)');
      const expected = TOKEN[`${row.density}-${row.size}`].token;
      expect(body).toContain(
        `--solaris-segmented-item-height: var(--solaris-${expected})`,
      );
      for (const other of all) {
        if (other !== expected) {
          expect(body).not.toContain(`--solaris-${other}`);
        }
      }
    }
  });

  it('keeps content + padding strictly below the token so the floor binds without squeezing', () => {
    for (const row of LADDER) {
      const body = comboBlock(row.size, row.density);
      const font = varToken(body, '--solaris-segmented-item-font-size');
      const paddingY = varToken(body, '--solaris-segmented-item-padding-y');
      expect(font).toBe(row.font);
      expect(paddingY).toBe(row.itemPaddingY);
      const content = FONT_PX[row.font] * LINE_HEIGHT_SM;
      const outer = content + 2 * SPACING_PX[row.itemPaddingY];
      expect(outer).toBeLessThan(TOKEN[`${row.density}-${row.size}`].px);
    }
  });

  it('keeps lateral breathing room at or above the vertical padding', () => {
    const expected: Record<string, string> = {
      'compact-sm': 'spacing-4',
      'compact-md': 'spacing-4',
      'compact-lg': 'spacing-5',
      'normal-sm': 'spacing-5',
      'normal-md': 'spacing-5',
      'normal-lg': 'spacing-5',
      'comfortable-sm': 'spacing-5',
      'comfortable-md': 'spacing-6',
      'comfortable-lg': 'spacing-6',
    };
    for (const row of LADDER) {
      const body = comboBlock(row.size, row.density);
      const paddingX = varToken(body, '--solaris-segmented-item-padding-x');
      const key = `${row.density}-${row.size}`;
      expect(paddingX).toBe(expected[key]);
      expect(SPACING_PX[paddingX]).toBeGreaterThanOrEqual(
        SPACING_PX[row.itemPaddingY],
      );
    }
  });

  it('lets width grow freely and only squeezes in fixed-width layouts', () => {
    expect(itemScss).toContain(
      'min-width: var(--solaris-segmented-item-min-width)',
    );
    expect(controlScss).toMatch(/--solaris-segmented-item-min-width:\s*auto/);
    expect(controlScss).toMatch(
      /\[data-full-width\],\s*&\[data-equal-width\]\s*{[^}]*--solaris-segmented-item-min-width:\s*0/s,
    );
  });

  it('compensates the outline border so outline stays on-token too', () => {
    const start = controlScss.indexOf(
      `&[data-appearance='outline'][data-orientation='horizontal']:not(`,
    );
    expect(start).toBeGreaterThan(-1);
    const body = controlScss.slice(
      controlScss.indexOf('{', start) + 1,
      controlScss.indexOf('}', controlScss.indexOf('{', start)),
    );
    expect(body).toContain('--solaris-segmented-item-height-override: calc(');
    expect(body).toContain('--solaris-segmented-item-height');
    expect(body).toContain('--solaris-segmented-border-width');
  });

  it('unifies the item line-height on line-height-sm (no /1 shorthand)', () => {
    expect(itemScss).not.toContain('/ 1 var(--solaris-font-family-sans)');
    expect(itemScss).toContain(
      'var(--solaris-segmented-item-line-height) var(--solaris-font-family-sans)',
    );
    expect(itemScss).toMatch(
      /--solaris-segmented-item-line-height:\s*var\(\s*--solaris-line-height-sm\s*\)/,
    );
  });

  it('keeps the label ellipsis fallback shrinkable (min-width 0 + nowrap/ellipsis)', () => {
    const labelStart = itemScss.indexOf('.solaris-segmented-item__label {');
    expect(labelStart).toBeGreaterThan(-1);
    const labelBody = itemScss.slice(
      labelStart,
      itemScss.indexOf('}', labelStart),
    );
    expect(labelBody).toContain('min-width: 0');
    expect(labelBody).toContain('white-space: nowrap');
    expect(labelBody).toContain('text-overflow: ellipsis');
    expect(labelBody).toContain('overflow: hidden');
  });

  it('supports a square radius=none (container, indicator, flush edges)', () => {
    const start = controlScss.indexOf(`&[data-radius='none'] {`);
    expect(start).toBeGreaterThan(-1);
    const body = controlScss.slice(
      controlScss.indexOf('{', start) + 1,
      controlScss.indexOf('}', controlScss.indexOf('{', start)),
    );
    expect(body).toContain(
      '--solaris-segmented-radius: var(--solaris-radius-none)',
    );
    expect(body).toContain(
      '--solaris-segmented-indicator-radius: var(--solaris-radius-none)',
    );
    expect(body).toContain(
      '--solaris-segmented-flush-inline: var(--solaris-radius-none)',
    );
    expect(body).toContain(
      '--solaris-segmented-flush-block: var(--solaris-radius-none)',
    );
  });

  it('lets radius=lg items follow the container (item + indicator + flush edges)', () => {
    const start = controlScss.indexOf(`&[data-radius='lg'] {`);
    expect(start).toBeGreaterThan(-1);
    const body = controlScss.slice(
      controlScss.indexOf('{', start) + 1,
      controlScss.indexOf('}', controlScss.indexOf('{', start)),
    );
    expect(body).toContain(
      '--solaris-segmented-item-border-radius: var(--solaris-radius-lg)',
    );
    expect(body).toContain(
      '--solaris-segmented-indicator-radius: var(--solaris-radius-lg)',
    );
    expect(body).toContain(
      '--solaris-segmented-flush-inline: var(--solaris-radius-lg)',
    );
    expect(body).toContain(
      '--solaris-segmented-flush-block: var(--solaris-radius-lg)',
    );
  });

  it('clips projected long labels inside the item box (no paint outside the indicator)', () => {
    const innerStart = itemScss.indexOf('.solaris-segmented-item__inner {');
    expect(innerStart).toBeGreaterThan(-1);
    const innerBody = itemScss.slice(
      innerStart,
      itemScss.indexOf('}', innerStart),
    );
    expect(innerBody).toContain('min-width: 0');
    expect(innerBody).toContain('max-width: 100%');
    expect(innerBody).toContain('overflow: hidden');
    expect(innerBody).toContain('white-space: nowrap');
  });
});

describe('Segmented control fullWidth lg/normal with long labels', () => {
  @Component({
    standalone: true,
    imports: [SolarisSegmentedControlComponent, SolarisSegmentedItemComponent],
    template: `
      <solaris-segmented-control
        size="lg"
        [fullWidth]="true"
        [(value)]="selectedValue"
      >
        <solaris-segmented-item value="monthly">Mensal</solaris-segmented-item>
        <solaris-segmented-item value="yearly">Anual</solaris-segmented-item>
        <solaris-segmented-item value="shared">
          Responsabilidade compartilhada anual
        </solaris-segmented-item>
      </solaris-segmented-control>
    `,
  })
  class TestHost {
    readonly selectedValue = signal<unknown>('monthly');
  }

  let fixture: ComponentFixture<TestHost>;
  let hostElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
      providers: [
        ...provideSolarisTesting(),
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    hostElement = fixture.nativeElement.querySelector(
      'solaris-segmented-control',
    ) as HTMLElement;
  });

  it('renders the consumer case without clipping the labels', () => {
    const items = hostElement.querySelectorAll('solaris-segmented-item');
    expect(items.length).toBe(3);
    expect(items[0].textContent).toContain('Mensal');
    expect(items[2].textContent).toContain(
      'Responsabilidade compartilhada anual',
    );
    expect(hostElement.getAttribute('data-size')).toBe('lg');
    expect(hostElement.getAttribute('data-full-width')).not.toBeNull();
  });

  it('keeps the indicator wired across resize and value change', () => {
    expect(
      hostElement.querySelector('.solaris-segmented-control__indicator'),
    ).toBeTruthy();
    window.dispatchEvent(new Event('resize'));
    fixture.detectChanges();
    fixture.componentInstance.selectedValue.set('yearly');
    fixture.detectChanges();
    const items = hostElement.querySelectorAll('solaris-segmented-item');
    expect(items[1].getAttribute('data-selected')).toBe('true');
    expect(
      hostElement.querySelector('.solaris-segmented-control__indicator'),
    ).toBeTruthy();
  });
});
