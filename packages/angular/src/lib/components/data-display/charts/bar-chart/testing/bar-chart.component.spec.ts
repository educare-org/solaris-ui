import { PLATFORM_ID } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { SolarisTranslateService } from '../../../../../services/translation';
import { SolarisBarChartComponent } from '../component/bar-chart.component';
import type {
  SolarisChartReferenceLine,
  SolarisChartSeries,
} from '../../model/chart.types';

const SERIES: readonly SolarisChartSeries[] = [
  {
    id: 'automation',
    label: 'Automation',
    points: [
      { x: 'Mon', y: 10 },
      { x: 'Tue', y: 20 },
      { x: 'Wed', y: 15 },
      { x: 'Thu', y: null },
    ],
  },
  {
    id: 'queries',
    label: 'Queries',
    points: [
      { x: 'Mon', y: 5 },
      { x: 'Tue', y: 8 },
      { x: 'Wed', y: 6 },
      { x: 'Thu', y: 9 },
    ],
  },
];

describe('SolarisBarChartComponent', () => {
  let fixture: ComponentFixture<SolarisBarChartComponent>;

  const createFixture = (
    series: readonly SolarisChartSeries[] = SERIES,
  ): HTMLElement => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisBarChartComponent);
    fixture.componentRef.setInput('locale', 'en-US');
    fixture.componentRef.setInput('series', series);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  const bars = (el: HTMLElement): SVGGraphicsElement[] =>
    Array.from(el.querySelectorAll<SVGGraphicsElement>('[data-bar]'));

  const flushLayoutMorph = async (): Promise<void> => {
    if (typeof requestAnimationFrame === 'undefined') return;
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
    fixture.detectChanges();
  };

  it('renders an svg with role img and a synthesized summary', () => {
    const el = createFixture();
    const svg = el.querySelector('svg');
    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.getAttribute('aria-label')).toContain('Automation');
    expect(svg?.getAttribute('aria-label')).toContain('Queries');
  });

  it('honors an explicit aria label override', () => {
    const el = createFixture();
    fixture.componentRef.setInput('ariaLabel', 'Custom chart');
    fixture.detectChanges();
    expect(el.querySelector('svg')?.getAttribute('aria-label')).toBe(
      'Custom chart',
    );
  });

  it('falls back to embedded strings without a translate provider', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: SolarisTranslateService, useValue: null }],
    });
    const fallback = TestBed.createComponent(SolarisBarChartComponent);
    fallback.componentRef.setInput('locale', 'pt-BR');
    fallback.componentRef.setInput('series', SERIES);
    fallback.detectChanges();
    const label =
      (fallback.nativeElement as HTMLElement)
        .querySelector('svg')
        ?.getAttribute('aria-label') ?? '';
    expect(label).toContain('Automation');
    expect(label).toContain('pontos');
  });

  it('renders grouped bars by default with layout and orientation attrs', () => {
    const el = createFixture();
    expect(el.getAttribute('data-layout')).toBe('grouped');
    expect(el.getAttribute('data-orientation')).toBe('vertical');
    expect(bars(el)).toHaveLength(7);
    const first = bars(el)[0];
    expect(first.getAttribute('tabindex')).toBe('0');
    expect(bars(el)[1].getAttribute('tabindex')).toBe('-1');
    expect(first.getAttribute('aria-label')).toContain('Automation');
  });

  it('fills bars with series-tinted gradients', () => {
    const el = createFixture();
    const fill = bars(el)[0].getAttribute('fill') ?? '';
    expect(fill.startsWith('url(#solaris-bar-chart-')).toBe(true);
    expect(el.querySelector('linearGradient')).not.toBeNull();
  });

  it('staggers the bar enter animation by series and category', () => {
    const el = createFixture();
    expect(bars(el)[0].style.animationDelay).toBe('0ms');
    expect(bars(el)[1].style.animationDelay).not.toBe('0ms');
  });

  it('renders bars as paths with selective outer rounding', () => {
    const el = createFixture();
    const first = bars(el)[0];
    expect(first.tagName.toLowerCase()).toBe('path');
    expect(first.getAttribute('d')).toMatch(/A (?!0 0)/);
  });

  it('leaves the baseline edge square and the free edge round', async () => {
    const el = createFixture();
    fixture.componentRef.setInput('layout', 'stacked');
    fixture.detectChanges();
    await flushLayoutMorph();
    expect(el.getAttribute('data-layout')).toBe('stacked');
    const monday = bars(el).filter((bar) =>
      bar.getAttribute('data-bar')?.endsWith(':0'),
    );
    expect(monday).toHaveLength(2);
    const bottom = monday[0].getAttribute('d') ?? '';
    const top = monday[1].getAttribute('d') ?? '';
    expect(bottom).not.toBe(top);
    const zeroArcs = (d: string): number => d.split('A 0 0').length - 1;
    expect(zeroArcs(bottom)).toBe(4);
    expect(zeroArcs(top)).toBe(2);
  });

  it('collapses bars to the baseline on layout switch before regrowing', async () => {
    const el = createFixture();
    fixture.componentRef.setInput('layout', 'stacked');
    fixture.detectChanges();
    expect(el.getAttribute('data-morphing')).toBe('');
    const collapsed = bars(el).map((bar) => bar.getAttribute('d') ?? '');
    for (const d of collapsed) {
      const edges = [...d.matchAll(/V ([\d.-]+)/g)].map((match) => match[1]);
      expect(edges.length).toBeGreaterThan(0);
      expect(new Set(edges).size).toBe(1);
    }
    await flushLayoutMorph();
    expect(el.hasAttribute('data-morphing')).toBe(false);
    const grown = bars(el).map((bar) => bar.getAttribute('d') ?? '');
    expect(grown).not.toEqual(collapsed);
    for (const d of grown) {
      const edges = [...d.matchAll(/V ([\d.-]+)/g)].map((match) => match[1]);
      expect(new Set(edges).size).toBeGreaterThan(1);
    }
  });

  it('renders value labels above bar tips when showValues is enabled', () => {
    const el = createFixture();
    expect(el.querySelector('.solaris-bar-chart__value')).toBeNull();
    fixture.componentRef.setInput('showValues', true);
    fixture.detectChanges();
    const values = Array.from(el.querySelectorAll('.solaris-bar-chart__value'));
    expect(values).toHaveLength(bars(el).length);
    expect(values[0].textContent?.trim()).toBe('10');
    expect(values[0].getAttribute('text-anchor')).toBe('middle');
  });

  it('staggers value labels one phase per series', () => {
    const el = createFixture();
    fixture.componentRef.setInput('showValues', true);
    fixture.detectChanges();
    const delays = new Set(
      Array.from(
        el.querySelectorAll<SVGGraphicsElement>('.solaris-bar-chart__value'),
      ).map((label) => label.style.animationDelay),
    );
    expect(delays.has('0ms')).toBe(true);
    expect(delays.has('300ms')).toBe(true);
  });

  it('anchors value labels outside the tip in horizontal mode', async () => {
    const el = createFixture();
    fixture.componentRef.setInput('showValues', true);
    fixture.componentRef.setInput('orientation', 'horizontal');
    fixture.detectChanges();
    await flushLayoutMorph();
    const first = el.querySelector('.solaris-bar-chart__value');
    expect(first?.textContent?.trim()).toBe('10');
    expect(first?.getAttribute('text-anchor')).toBe('start');
  });

  it('places value labels below the baseline for negative bars', () => {
    const el = createFixture([
      {
        id: 'delta',
        label: 'Delta',
        points: [{ x: 'A', y: -8 }],
      },
    ]);
    fixture.componentRef.setInput('showValues', true);
    fixture.detectChanges();
    const label = el.querySelector('.solaris-bar-chart__value');
    expect(label?.textContent?.trim()).toBe('-8');
    expect(label?.getAttribute('text-anchor')).toBe('middle');
  });

  it('hides value labels while bars morph between layouts', async () => {
    const el = createFixture();
    fixture.componentRef.setInput('showValues', true);
    fixture.detectChanges();
    expect(
      el.querySelectorAll('.solaris-bar-chart__value').length,
    ).toBeGreaterThan(0);
    fixture.componentRef.setInput('layout', 'stacked');
    fixture.detectChanges();
    expect(el.querySelector('.solaris-bar-chart__value')).toBeNull();
    await flushLayoutMorph();
    expect(
      el.querySelectorAll('.solaris-bar-chart__value').length,
    ).toBeGreaterThan(0);
  });

  it('renders an empty state when there is no data', () => {
    const el = createFixture([]);
    expect(el.querySelector('.solaris-bar-chart__empty')).not.toBeNull();
    expect(
      el.querySelector('.solaris-bar-chart__empty-title')?.textContent,
    ).toContain('No data');
    expect(el.querySelector('svg')?.hasAttribute('hidden')).toBe(true);
    expect(bars(el)).toHaveLength(0);
  });

  it('renders an empty state when every series is hidden', () => {
    const el = createFixture(
      SERIES.map((entry) => ({ ...entry, hidden: true })),
    );
    expect(el.querySelector('.solaris-bar-chart__empty')).not.toBeNull();
    expect(bars(el)).toHaveLength(0);
    expect(
      el.querySelector('.solaris-bar-chart__empty-message')?.textContent,
    ).not.toBe('');
  });

  it('collapses each stacked segment onto its own base', async () => {
    const el = createFixture();
    fixture.componentRef.setInput('layout', 'stacked');
    fixture.detectChanges();
    const monday = bars(el).filter((bar) =>
      bar.getAttribute('data-bar')?.endsWith(':0'),
    );
    expect(monday).toHaveLength(2);
    const collapsedTop = monday[1].getAttribute('d') ?? '';
    const collapsedEdges = [...collapsedTop.matchAll(/V ([\d.-]+)/g)].map(
      (match) => match[1],
    );
    await flushLayoutMorph();
    const grown = bars(el).filter((bar) =>
      bar.getAttribute('data-bar')?.endsWith(':0'),
    );
    const grownBottomEdges = [
      ...(grown[0].getAttribute('d') ?? '').matchAll(/V ([\d.-]+)/g),
    ].map((match) => match[1]);
    const grownTopEdges = [
      ...(grown[1].getAttribute('d') ?? '').matchAll(/V ([\d.-]+)/g),
    ].map((match) => match[1]);
    expect(new Set(collapsedEdges).size).toBe(1);
    expect(collapsedEdges[0]).toBe(grownTopEdges[0]);
    expect(collapsedEdges[0]).not.toBe(grownBottomEdges[0]);
  });

  it('appends a percent suffix to ticks in stacked-100 mode', () => {
    const el = createFixture();
    fixture.componentRef.setInput('layout', 'stacked-100');
    fixture.detectChanges();
    const ticks = Array.from(
      el.querySelectorAll('.solaris-bar-chart__tick'),
    ).map((node) => node.textContent?.trim());
    expect(ticks.some((text) => text?.endsWith('%'))).toBe(true);
  });

  it('renders horizontal bars with long labels truncated on the left', () => {
    const el = createFixture([
      {
        id: 'class',
        label: 'Class',
        points: [
          { x: 'A', y: 42, label: 'Turma de alfabetização avançada' },
          { x: 'B', y: 68, label: 'Turma de reforço de matemática' },
        ],
      },
    ]);
    fixture.componentRef.setInput('orientation', 'horizontal');
    fixture.detectChanges();
    expect(el.getAttribute('data-orientation')).toBe('horizontal');
    const labels = Array.from(
      el.querySelectorAll('.solaris-bar-chart__tick'),
    ).map((node) => node.textContent?.trim());
    expect(labels.some((text) => text?.endsWith('…'))).toBe(true);
    const first = bars(el)[0];
    expect(first.getAttribute('d')?.length ?? 0).toBeGreaterThan(10);
  });

  it('grows the horizontal viewBox with the category count', () => {
    const el = createFixture();
    const labels = Array.from({ length: 7 }, (_, index) => `d${index + 1}`);
    fixture.componentRef.setInput('xLabels', labels);
    fixture.componentRef.setInput('series', [
      {
        id: 'a',
        label: 'A',
        points: labels.map((x, index) => ({ x, y: (index + 1) * 10 })),
      },
    ]);
    fixture.componentRef.setInput('orientation', 'horizontal');
    fixture.detectChanges();
    const viewBox =
      el.querySelector('svg')?.getAttribute('viewBox') ?? '0 0 0 0';
    expect(Number(viewBox.split(' ')[3])).toBe(404);
  });

  it('keeps dense vertical charts readable with a scrollable min width', () => {
    const el = createFixture();
    const labels = Array.from({ length: 16 }, (_, index) => `d${index + 1}`);
    fixture.componentRef.setInput('xLabels', labels);
    fixture.componentRef.setInput('series', [
      {
        id: 'a',
        label: 'A',
        points: labels.map((x, index) => ({ x, y: index + 1 })),
      },
    ]);
    fixture.detectChanges();
    expect(el.querySelector('svg')?.style.minWidth).toBe('416px');
  });

  it('paints reference lines above the bars', () => {
    const el = createFixture();
    fixture.componentRef.setInput('referenceLines', [{ value: 12 }]);
    fixture.detectChanges();
    const order = Array.from(
      el.querySelectorAll(
        '.solaris-bar-chart__series, .solaris-bar-chart__reference',
      ),
    ).map((node) =>
      node.classList.contains('solaris-bar-chart__reference')
        ? 'reference'
        : 'series',
    );
    expect(order.indexOf('reference')).toBeGreaterThan(
      order.lastIndexOf('series'),
    );
  });

  it('emits pointSelect on Enter with roving tabindex', () => {
    const el = createFixture();
    const emitted: { seriesId: string; index: number }[] = [];
    fixture.componentInstance.pointSelect.subscribe((event) =>
      emitted.push(event),
    );
    const first = bars(el)[0];
    (first as unknown as HTMLElement).focus();
    fixture.detectChanges();
    first.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    fixture.detectChanges();
    expect(emitted).toEqual([{ seriesId: 'automation', index: 0 }]);
    const second = bars(el)[1];
    first.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    fixture.detectChanges();
    expect(second.getAttribute('tabindex')).toBe('0');
    expect(first.getAttribute('tabindex')).toBe('-1');
  });

  it('shows a single-series tooltip on bar focus and dims the rest', () => {
    const el = createFixture();
    bars(el)[0].dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    const tooltip = el.querySelector('.solaris-bar-chart__tooltip');
    expect(tooltip?.textContent).toContain('Automation:');
    expect(tooltip?.textContent).not.toContain('Queries:');
    expect(
      el.querySelector('.solaris-bar-chart__tooltip-heading')?.textContent,
    ).toContain('Mon');
    expect(el.querySelector('.solaris-bar-chart__tooltip-total')).toBeNull();
    expect(bars(el)[1].getAttribute('data-dimmed')).toBe('');
    expect(bars(el)[0].hasAttribute('data-dimmed')).toBe(false);
  });

  it('shows the full tooltip with total on axis hover', () => {
    const el = createFixture();
    const axis = el.querySelector('.solaris-bar-chart__axis-hit');
    expect(axis).not.toBeNull();
    axis?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();
    const tooltip = el.querySelector('.solaris-bar-chart__tooltip');
    expect(tooltip?.textContent).toContain('Automation:');
    expect(tooltip?.textContent).toContain('Queries:');
    expect(
      el.querySelector('.solaris-bar-chart__tooltip-total-label')?.textContent,
    ).toContain('Total:');
    expect(el.querySelector('[data-dimmed]')).toBeNull();
  });

  it('hides the selection guide on single-bar hover', () => {
    const el = createFixture();
    bars(el)[0].dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    const guide = el.querySelector('.solaris-bar-chart__selection-guide');
    expect(guide?.hasAttribute('data-hidden')).toBe(true);
    expect(
      el.querySelector('.solaris-bar-chart__tick--category[data-active]'),
    ).toBeNull();
  });

  it('shows the narrowed guide and highlights the axis on whole-column hover', async () => {
    const el = createFixture();
    const axis = el.querySelector('.solaris-bar-chart__axis-hit');
    axis?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await new Promise<void>((resolve) => {
      if (typeof requestAnimationFrame === 'undefined') {
        resolve();
        return;
      }
      requestAnimationFrame(() => resolve());
    });
    fixture.detectChanges();
    const guide = el.querySelector('.solaris-bar-chart__selection-guide');
    expect(guide?.hasAttribute('data-hidden')).toBe(false);
    expect(guide?.getAttribute('y')).toBe('12');
    expect(Number(guide?.getAttribute('height'))).toBeCloseTo(223.45, 2);
    expect(
      el.querySelector('.solaris-bar-chart__tick--category[data-active]')
        ?.textContent,
    ).toContain('Mon');
  });

  it('renders reference lines inside the scale and hides out-of-scale ones', () => {
    const references: readonly SolarisChartReferenceLine[] = [
      { value: 12, label: 'Class average' },
    ];
    const el = createFixture();
    fixture.componentRef.setInput('referenceLines', references);
    fixture.detectChanges();
    const line = el.querySelector('.solaris-bar-chart__reference');
    expect(line).not.toBeNull();
    expect(el.textContent).toContain('Class average');

    fixture.componentRef.setInput('referenceLines', [
      { value: 1300, label: 'Média' },
    ]);
    fixture.detectChanges();
    expect(el.querySelector('.solaris-bar-chart__reference')).toBeNull();
    expect(el.textContent).not.toContain('Média');
  });

  it('always renders the last category label even when thinned', () => {
    const el = createFixture();
    const labels = Array.from({ length: 16 }, (_, index) => `d${index + 1}`);
    fixture.componentRef.setInput('xLabels', labels);
    fixture.componentRef.setInput('series', [
      {
        id: 'a',
        label: 'A',
        points: labels.map((x, index) => ({ x, y: index + 1 })),
      },
    ]);
    fixture.detectChanges();
    const texts = Array.from(
      el.querySelectorAll('.solaris-bar-chart__tick'),
    ).map((node) => node.textContent?.trim());
    expect(texts).toContain('d16');
  });

  it('renders custom labels and formatted values', () => {
    const el = createFixture();
    fixture.componentRef.setInput('xLabels', ['A', 'B', 'C', 'D']);
    fixture.componentRef.setInput(
      'valueFormat',
      (value: number) => `${value}k`,
    );
    fixture.detectChanges();
    expect(el.textContent).toContain('A');
    expect(el.textContent).toContain('k');
  });

  it('rounds bars through the radius token by default and honors overrides', () => {
    const el = createFixture();
    expect(el.style.getPropertyValue('--solaris-bar-chart-bar-radius')).toBe(
      '',
    );
    fixture.componentRef.setInput('barRadius', 6);
    fixture.detectChanges();
    expect(el.style.getPropertyValue('--solaris-bar-chart-bar-radius')).toBe(
      '6px',
    );
  });

  it('exposes a screen-reader data table with every value', () => {
    const el = createFixture();
    const table = el.querySelector('.solaris-bar-chart__data');
    expect(table?.textContent).toContain('Automation');
    expect(table?.textContent).toContain('20');
  });

  it('renders on the server without a ResizeObserver', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });
    const server = TestBed.createComponent(SolarisBarChartComponent);
    server.componentRef.setInput('locale', 'en-US');
    server.componentRef.setInput('series', SERIES);
    expect(() => server.detectChanges()).not.toThrow();
    const el = server.nativeElement as HTMLElement;
    expect(el.querySelectorAll('[data-bar]')).toHaveLength(7);
  });

  it('never mutates the consumer series', () => {
    const frozen = SERIES.map((entry) =>
      Object.freeze({ ...entry, points: Object.freeze([...entry.points]) }),
    );
    const snapshot = JSON.stringify(frozen);
    createFixture(frozen);
    fixture.componentRef.setInput('layout', 'stacked-100');
    fixture.detectChanges();
    expect(JSON.stringify(frozen)).toBe(snapshot);
  });
});
