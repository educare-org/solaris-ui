import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { vi } from 'vitest';

import { SolarisTranslateService } from '../../../../../services/translation';
import { SolarisLineChartComponent } from '../component/line-chart.component';
import type {
  SolarisChartReferenceLine,
  SolarisChartSeries,
} from '../../model/chart.types';

const SERIES: readonly SolarisChartSeries[] = [
  {
    id: 'usa',
    label: 'USA',
    points: [
      { x: 'Mon', y: 10 },
      { x: 'Tue', y: 20 },
      { x: 'Wed', y: 15 },
      { x: 'Thu', y: null },
    ],
  },
  {
    id: 'europe',
    label: 'Europe',
    points: [
      { x: 'Mon', y: 5 },
      { x: 'Tue', y: 8 },
      { x: 'Wed', y: 6 },
      { x: 'Thu', y: 9 },
    ],
  },
];

describe('SolarisLineChartComponent', () => {
  let fixture: ComponentFixture<SolarisLineChartComponent>;

  const createFixture = (
    series: readonly SolarisChartSeries[] = SERIES,
  ): HTMLElement => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisLineChartComponent);
    fixture.componentRef.setInput('locale', 'en-US');
    fixture.componentRef.setInput('series', series);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  const dots = (el: HTMLElement): SVGCircleElement[] =>
    Array.from(el.querySelectorAll<SVGCircleElement>('circle[data-dot]'));

  it('renders an svg with role img and a synthesized summary', () => {
    const el = createFixture();
    const svg = el.querySelector('svg');
    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.getAttribute('aria-label')).toContain('USA');
    expect(svg?.getAttribute('aria-label')).toContain('Europe');
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
    const fallback = TestBed.createComponent(SolarisLineChartComponent);
    fallback.componentRef.setInput('locale', 'pt-BR');
    fallback.componentRef.setInput('series', SERIES);
    fallback.detectChanges();
    const label =
      (fallback.nativeElement as HTMLElement)
        .querySelector('svg')
        ?.getAttribute('aria-label') ?? '';
    expect(label).toContain('USA');
    expect(label).toContain('pontos');
  });

  it('renders smooth cubic paths by default and linear paths on demand', () => {
    const el = createFixture();
    const first = el.querySelector('.solaris-line-chart__line');
    expect(first?.getAttribute('d')).toContain('C');
    fixture.componentRef.setInput('interpolation', 'linear');
    fixture.detectChanges();
    expect(
      el.querySelector('.solaris-line-chart__line')?.getAttribute('d'),
    ).toContain('L');
    expect(
      el.querySelector('.solaris-line-chart__line')?.getAttribute('d'),
    ).not.toContain('C');
  });

  it('renders stepped paths when step is enabled', () => {
    const el = createFixture();
    fixture.componentRef.setInput('step', true);
    fixture.detectChanges();
    const path =
      el.querySelector('.solaris-line-chart__line')?.getAttribute('d') ?? '';
    expect(path).toContain('H');
    expect(path).toContain('V');
    expect(el.getAttribute('data-interpolation')).toBe('step');
  });

  it('renders area fills with series-tinted gradients and hides them on demand', () => {
    const el = createFixture();
    expect(el.querySelector('.solaris-line-chart__area')).not.toBeNull();
    expect(
      el.querySelector('linearGradient stop')?.getAttribute('style'),
    ).toContain('color-mix');
    fixture.componentRef.setInput('area', false);
    fixture.detectChanges();
    expect(el.querySelector('.solaris-line-chart__area')).toBeNull();
  });

  it('skips gap dots and renders one focusable dot per plottable point', () => {
    const el = createFixture();
    expect(dots(el)).toHaveLength(7);
    const first = dots(el)[0];
    expect(first.getAttribute('tabindex')).toBe('0');
    expect(dots(el)[1].getAttribute('tabindex')).toBe('-1');
    expect(first.getAttribute('aria-label')).toContain('USA');
  });

  it('hides dots behind the showDots flag', () => {
    const el = createFixture();
    fixture.componentRef.setInput('showDots', false);
    fixture.detectChanges();
    expect(dots(el)).toHaveLength(0);
  });

  it('emits pointSelect on Enter with roving tabindex', () => {
    const el = createFixture();
    const emitted: { seriesId: string; index: number }[] = [];
    fixture.componentInstance.pointSelect.subscribe((event) =>
      emitted.push(event),
    );
    const first = dots(el)[0];
    (first as unknown as HTMLElement).focus();
    fixture.detectChanges();
    first.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    fixture.detectChanges();
    expect(emitted).toEqual([{ seriesId: 'usa', index: 0 }]);
    const second = dots(el)[1];
    first.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    fixture.detectChanges();
    expect(second.getAttribute('tabindex')).toBe('0');
    expect(first.getAttribute('tabindex')).toBe('-1');
  });

  it('shows a multi-series tooltip with heading and total on dot focus', () => {
    const el = createFixture();
    dots(el)[0].dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    const tooltip = el.querySelector('.solaris-line-chart__tooltip');
    expect(tooltip?.textContent).toContain('USA:');
    expect(tooltip?.textContent).toContain('Europe:');
    expect(
      el.querySelector('.solaris-line-chart__tooltip-heading')?.textContent,
    ).toContain('Mon');
    expect(
      el.querySelector('.solaris-line-chart__tooltip-total-label')?.textContent,
    ).toContain('Total:');
    expect(tooltip?.textContent).toContain(
      el
        .querySelector('.solaris-line-chart__tooltip-total')
        ?.textContent?.trim() as string,
    );
  });

  it('always renders the last x label even when thinned', () => {
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
      el.querySelectorAll('.solaris-line-chart__tick'),
    ).map((node) => node.textContent?.trim());
    expect(texts).toContain('d16');
  });

  it('renders reference lines inside the scale and hides out-of-scale ones', () => {
    const references: readonly SolarisChartReferenceLine[] = [
      { value: 12, label: 'Class average' },
    ];
    const el = createFixture();
    fixture.componentRef.setInput('referenceLines', references);
    fixture.detectChanges();
    const line = el.querySelector('.solaris-line-chart__reference');
    expect(line).not.toBeNull();
    expect(el.textContent).toContain('Class average');

    fixture.componentRef.setInput('referenceLines', [
      { value: 1300, label: 'Média' },
    ]);
    fixture.detectChanges();
    expect(el.querySelector('.solaris-line-chart__reference')).toBeNull();
    expect(el.textContent).not.toContain('Média');
  });

  it('animates the series group when the dataset changes', async () => {
    const el = createFixture();
    expect(
      el.querySelector('.solaris-line-chart__series-group'),
    ).not.toBeNull();
    const proto = Element.prototype as unknown as Record<string, unknown>;
    const original = proto['animate'];
    const animate = vi.fn();
    proto['animate'] = animate;
    try {
      fixture.componentRef.setInput('series', [
        {
          id: 'usa',
          label: 'USA',
          points: [
            { x: 'Mon', y: 40 },
            { x: 'Tue', y: 60 },
            { x: 'Wed', y: 55 },
            { x: 'Thu', y: 80 },
          ],
        },
      ]);
      fixture.detectChanges();
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );
      expect(animate).toHaveBeenCalled();
    } finally {
      if (original === undefined) {
        delete proto['animate'];
      } else {
        proto['animate'] = original;
      }
    }
  });

  it('renders custom x labels and formatted y ticks', () => {
    const el = createFixture();
    fixture.componentRef.setInput('xLabels', ['A', 'B', 'C', 'D']);
    fixture.componentRef.setInput('yFormat', (value: number) => `${value}k`);
    fixture.detectChanges();
    expect(el.textContent).toContain('A');
    expect(el.textContent).toContain('k');
  });

  it('exposes a screen-reader data table with every value', () => {
    const el = createFixture();
    const table = el.querySelector('.solaris-line-chart__data');
    expect(table?.textContent).toContain('USA');
    expect(table?.textContent).toContain('20');
  });

  it('reflects size and density on the host', () => {
    const el = createFixture();
    fixture.componentRef.setInput('size', 'lg');
    fixture.componentRef.setInput('density', 'comfortable');
    fixture.detectChanges();
    expect(el.getAttribute('data-size')).toBe('lg');
    expect(el.getAttribute('data-density')).toBe('comfortable');
    fixture.componentRef.setInput('size', 'sm');
    fixture.componentRef.setInput('density', 'compact');
    fixture.detectChanges();
    expect(el.getAttribute('data-size')).toBe('sm');
    expect(el.getAttribute('data-density')).toBe('compact');
  });

  it('never mutates the consumer series', () => {
    const frozen = SERIES.map((entry) =>
      Object.freeze({ ...entry, points: Object.freeze([...entry.points]) }),
    );
    const snapshot = JSON.stringify(frozen);
    createFixture(frozen);
    expect(JSON.stringify(frozen)).toBe(snapshot);
  });
});
