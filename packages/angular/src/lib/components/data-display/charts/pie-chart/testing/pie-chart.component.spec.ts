import { PLATFORM_ID } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { vi } from 'vitest';

import { SolarisTranslateService } from '../../../../../services/translation';
import type { SolarisChartSlice } from '../../model/chart.types';
import { SolarisPieChartComponent } from '../component/pie-chart.component';

const SLICES: readonly SolarisChartSlice[] = [
  { id: 'fundamental', label: 'Fundamental', value: 1240 },
  { id: 'medio', label: 'Médio', value: 860 },
  { id: 'eja', label: 'EJA', value: 310 },
  { id: 'integral', label: 'Integral', value: 190 },
];

describe('SolarisPieChartComponent', () => {
  let fixture: ComponentFixture<SolarisPieChartComponent>;

  const createFixture = (
    slices: readonly SolarisChartSlice[] = SLICES,
  ): HTMLElement => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisPieChartComponent);
    fixture.componentRef.setInput('locale', 'en-US');
    fixture.componentRef.setInput('series', []);
    fixture.componentRef.setInput('slices', slices);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  const paths = (el: HTMLElement): SVGGraphicsElement[] =>
    Array.from(el.querySelectorAll<SVGGraphicsElement>('[data-slice]'));

  const flushMicrotasks = async (rounds = 10): Promise<void> => {
    for (let i = 0; i < rounds; i += 1) {
      await Promise.resolve();
    }
  };

  it('renders an svg with role img and a synthesized summary', () => {
    const el = createFixture();
    const svg = el.querySelector('svg');
    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.getAttribute('aria-label')).toContain('Total');
    expect(svg?.getAttribute('aria-label')).toContain('Fundamental');
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
    const fallback = TestBed.createComponent(SolarisPieChartComponent);
    fallback.componentRef.setInput('locale', 'pt-BR');
    fallback.componentRef.setInput('series', []);
    fallback.componentRef.setInput('slices', SLICES);
    fallback.detectChanges();
    const label =
      (fallback.nativeElement as HTMLElement)
        .querySelector('svg')
        ?.getAttribute('aria-label') ?? '';
    expect(label).toContain('Total');
    expect(label).toContain('Fundamental');
  });

  it('exposes the variant on the host and renders one path per slice', () => {
    const el = createFixture();
    expect(el.getAttribute('data-variant')).toBe('pie');
    expect(paths(el)).toHaveLength(4);
    expect(paths(el)[0].getAttribute('tabindex')).toBe('0');
    expect(paths(el)[1].getAttribute('tabindex')).toBe('-1');
    expect(paths(el)[0].getAttribute('aria-label')).toContain('Fundamental');
  });

  it('fills slices with slice-anchored gradients that darken at the edge', () => {
    const el = createFixture();
    const fill = paths(el)[0].getAttribute('fill') ?? '';
    expect(fill.startsWith('url(#solaris-pie-chart-')).toBe(true);
    const gradient = el.querySelector('radialGradient');
    expect(gradient?.getAttribute('gradientUnits')).toBe('userSpaceOnUse');
    expect(gradient?.getAttribute('cx')).not.toBeNull();
    const stops = Array.from(gradient?.querySelectorAll('stop') ?? []);
    expect(stops).toHaveLength(3);
    expect(stops[0].getAttribute('style')).toContain(
      'var(--solaris-primary-solid)',
    );
    expect(stops[1].getAttribute('style')).toContain('92%');
    expect(stops[2].getAttribute('style')).toContain('black');
  });

  it('grows slices from zero and shows percents only at full reveal', async () => {
    vi.useFakeTimers();
    try {
      const el = createFixture();
      fixture.componentRef.setInput('showValues', true);
      fixture.detectChanges();
      await flushMicrotasks();
      fixture.detectChanges();
      expect(el.hasAttribute('data-entering')).toBe(true);
      expect(paths(el).every((path) => path.getAttribute('d') === '')).toBe(
        true,
      );
      expect(el.querySelector('.solaris-pie-chart__value')).toBeNull();
      vi.advanceTimersByTime(200);
      fixture.detectChanges();
      expect(paths(el)[0].getAttribute('d') === '').toBe(false);
      expect(el.querySelector('.solaris-pie-chart__value')).toBeNull();
      vi.advanceTimersByTime(1000);
      fixture.detectChanges();
      expect(el.hasAttribute('data-entering')).toBe(false);
      const labels = Array.from(
        el.querySelectorAll('.solaris-pie-chart__value'),
      ).map((node) => node.textContent?.trim());
      expect(labels.length).toBeGreaterThan(0);
      expect(labels.some((text) => text?.includes('%'))).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it('fills the gauge arc from zero on enter', async () => {
    vi.useFakeTimers();
    try {
      const el = createFixture([
        { id: 'attendance', label: 'Attendance', value: 87 },
      ]);
      fixture.componentRef.setInput('variant', 'gauge');
      fixture.componentRef.setInput('gaugeTarget', 90);
      fixture.detectChanges();
      await flushMicrotasks();
      fixture.detectChanges();
      const value = el.querySelector('.solaris-pie-chart__gauge-value');
      expect(value?.getAttribute('d')).toBe('');
      vi.advanceTimersByTime(200);
      fixture.detectChanges();
      const partial = value?.getAttribute('d') ?? '';
      expect(partial === '').toBe(false);
      vi.advanceTimersByTime(600);
      fixture.detectChanges();
      const full = value?.getAttribute('d') ?? '';
      expect(full === '').toBe(false);
      expect(full).not.toBe(partial);
      expect(
        el.querySelector('.solaris-pie-chart__gauge-target'),
      ).not.toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('skips the reveal when reduced motion is preferred', () => {
    const original = window.matchMedia;
    window.matchMedia = (() => ({
      matches: true,
    })) as unknown as typeof window.matchMedia;
    try {
      const el = createFixture();
      fixture.componentRef.setInput('showValues', true);
      fixture.detectChanges();
      expect(el.hasAttribute('data-entering')).toBe(false);
      expect(el.querySelector('.solaris-pie-chart__value')).not.toBeNull();
      expect(paths(el)[0].getAttribute('d') === '').toBe(false);
    } finally {
      window.matchMedia = original;
    }
  });

  it('groups small slices into Others below minSlicePercent', () => {
    const el = createFixture([
      { id: 'big', label: 'Big', value: 96 },
      { id: 'tiny-a', label: 'Tiny A', value: 2 },
      { id: 'tiny-b', label: 'Tiny B', value: 2 },
    ]);
    fixture.componentRef.setInput('minSlicePercent', 3);
    fixture.detectChanges();
    const ids = paths(el).map((path) => path.getAttribute('data-slice'));
    expect(ids).toEqual(['big', 'others']);
    expect(el.querySelector('svg')?.getAttribute('aria-label')).toContain(
      'Others',
    );
  });

  it('keeps every slice when minSlicePercent is zero', () => {
    const el = createFixture([
      { id: 'big', label: 'Big', value: 96 },
      { id: 'tiny', label: 'Tiny', value: 4 },
    ]);
    fixture.componentRef.setInput('minSlicePercent', 0);
    fixture.detectChanges();
    expect(paths(el)).toHaveLength(2);
  });

  it('opens a donut hole with the total in the center', () => {
    const el = createFixture();
    fixture.componentRef.setInput('variant', 'donut');
    fixture.detectChanges();
    expect(el.getAttribute('data-variant')).toBe('donut');
    expect(
      el.querySelector('.solaris-pie-chart__center-value')?.textContent,
    ).toContain('2.6');
    expect(
      el.querySelector('.solaris-pie-chart__center-label')?.textContent,
    ).toContain('Total');
  });

  it('honors centerValue and centerLabel overrides', () => {
    const el = createFixture();
    fixture.componentRef.setInput('variant', 'donut');
    fixture.componentRef.setInput('centerValue', '7.5');
    fixture.componentRef.setInput('centerLabel', 'Average');
    fixture.detectChanges();
    expect(
      el.querySelector('.solaris-pie-chart__center-value')?.textContent,
    ).toContain('7.5');
    expect(
      el.querySelector('.solaris-pie-chart__center-label')?.textContent,
    ).toContain('Average');
  });

  it('prints percents inside wide slices when showValues is enabled', async () => {
    vi.useFakeTimers();
    try {
      const el = createFixture();
      expect(el.querySelector('.solaris-pie-chart__value')).toBeNull();
      fixture.componentRef.setInput('showValues', true);
      fixture.detectChanges();
      await flushMicrotasks();
      vi.advanceTimersByTime(1000);
      fixture.detectChanges();
      const labels = Array.from(
        el.querySelectorAll('.solaris-pie-chart__value'),
      ).map((node) => node.textContent?.trim());
      expect(labels.length).toBeGreaterThan(0);
      expect(labels.some((text) => text?.includes('%'))).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it('renders a gauge track, value arc and target tick', () => {
    const el = createFixture([
      { id: 'attendance', label: 'Attendance', value: 87 },
    ]);
    fixture.componentRef.setInput('variant', 'gauge');
    fixture.componentRef.setInput('gaugeTarget', 90);
    fixture.detectChanges();
    expect(el.getAttribute('data-variant')).toBe('gauge');
    expect(el.querySelector('.solaris-pie-chart__gauge-track')).not.toBeNull();
    const value = el.querySelector('.solaris-pie-chart__gauge-value');
    expect(value?.getAttribute('data-slice')).toBe('attendance');
    expect(el.querySelector('.solaris-pie-chart__gauge-target')).not.toBeNull();
    expect(
      el.querySelector('.solaris-pie-chart__gauge-min')?.textContent,
    ).toContain('0');
    expect(
      el.querySelector('.solaris-pie-chart__gauge-max')?.textContent,
    ).toContain('100');
  });

  it('announces the gauge value and target in the aria label', () => {
    const el = createFixture([
      { id: 'attendance', label: 'Attendance', value: 87 },
    ]);
    fixture.componentRef.setInput('variant', 'gauge');
    fixture.componentRef.setInput('gaugeTarget', 90);
    fixture.detectChanges();
    expect(el.querySelector('svg')?.getAttribute('aria-label')).toContain(
      'Attendance',
    );
  });

  it('derives slices from series sums when no slices input is given', () => {
    TestBed.configureTestingModule({});
    const seriesFixture = TestBed.createComponent(SolarisPieChartComponent);
    seriesFixture.componentRef.setInput('locale', 'en-US');
    seriesFixture.componentRef.setInput('series', [
      {
        id: 'automation',
        label: 'Automation',
        points: [
          { x: 'Mon', y: 10 },
          { x: 'Tue', y: 20 },
        ],
      },
      {
        id: 'queries',
        label: 'Queries',
        points: [{ x: 'Mon', y: 5 }],
        hidden: true,
      },
    ]);
    seriesFixture.detectChanges();
    const el = seriesFixture.nativeElement as HTMLElement;
    expect(
      Array.from(el.querySelectorAll('[data-slice]')).map((node) =>
        node.getAttribute('data-slice'),
      ),
    ).toEqual(['automation']);
    expect(el.querySelector('svg')?.getAttribute('aria-label')).toContain(
      'Automation',
    );
  });

  it('emits sliceSelect on Enter with roving tabindex', () => {
    const el = createFixture();
    const emitted: string[] = [];
    fixture.componentInstance.sliceSelect.subscribe((id) => emitted.push(id));
    const first = paths(el)[0];
    (first as unknown as HTMLElement).focus();
    fixture.detectChanges();
    first.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    fixture.detectChanges();
    expect(emitted).toEqual(['fundamental']);
    const second = paths(el)[1];
    first.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    fixture.detectChanges();
    expect(second.getAttribute('tabindex')).toBe('0');
    expect(first.getAttribute('tabindex')).toBe('-1');
  });

  it('emits sliceSelect on click', () => {
    const el = createFixture();
    const emitted: string[] = [];
    fixture.componentInstance.sliceSelect.subscribe((id) => emitted.push(id));
    paths(el)[2].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(emitted).toEqual(['eja']);
  });

  it('shows a tooltip with value, percent and total on slice focus', () => {
    const el = createFixture();
    paths(el)[0].dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    const tooltip = el.querySelector('.solaris-pie-chart__tooltip');
    expect(tooltip?.textContent).toContain('Fundamental');
    expect(tooltip?.textContent).toContain('%');
    expect(
      el.querySelector('.solaris-pie-chart__tooltip-total-label')?.textContent,
    ).toContain('Total:');
    expect(paths(el)[1].getAttribute('data-dimmed')).toBe('');
    expect(paths(el)[0].hasAttribute('data-dimmed')).toBe(false);
  });

  it('anchors the tooltip outside the hovered slice edge', () => {
    const el = createFixture();
    const tooltip = (): HTMLElement | null =>
      el.querySelector<HTMLElement>('.solaris-pie-chart__tooltip');
    paths(el)[0].dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    expect(parseFloat(tooltip()?.style.left ?? '')).toBeCloseTo(86, 0);
    expect(parseFloat(tooltip()?.style.top ?? '')).toBeCloseTo(47, 0);
    paths(el)[0].dispatchEvent(new FocusEvent('blur'));
    fixture.componentRef.setInput('slices', [
      { id: 'big', label: 'Big', value: 96 },
      { id: 'tiny', label: 'Tiny', value: 4 },
    ]);
    fixture.componentRef.setInput('minSlicePercent', 0);
    fixture.detectChanges();
    const tiny = paths(el).find(
      (path) => path.getAttribute('data-slice') === 'tiny',
    );
    tiny?.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    expect(tooltip()?.textContent).toContain('Tiny');
    expect(parseFloat(tooltip()?.style.top ?? '')).toBeCloseTo(14, 0);
    expect(tooltip()?.getAttribute('data-side')).toBe('top');
  });

  it('docks the tooltip on the outer side of the hovered wedge', () => {
    const el = createFixture();
    paths(el)[0].dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    const tooltip = el.querySelector('.solaris-pie-chart__tooltip');
    // Fundamental sits on the right edge: the box opens to its right,
    // fully outside the ring instead of straddling it.
    expect(tooltip?.getAttribute('data-side')).toBe('right');
  });

  it('positions the tooltip inside the svg canvas box', () => {
    const el = createFixture();
    paths(el)[0].dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    const tooltip = el.querySelector('.solaris-pie-chart__tooltip');
    const canvas = tooltip?.parentElement;
    expect(canvas?.classList.contains('solaris-pie-chart__canvas')).toBe(true);
    expect(canvas?.querySelector('svg')).not.toBeNull();
  });

  it('hides the single-slice total in the tooltip', () => {
    const el = createFixture([{ id: 'only', label: 'Only', value: 10 }]);
    paths(el)[0].dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    expect(el.querySelector('.solaris-pie-chart__tooltip')).not.toBeNull();
    expect(el.querySelector('.solaris-pie-chart__tooltip-total')).toBeNull();
  });

  it('renders an empty state when there is no data', () => {
    const el = createFixture([]);
    expect(el.querySelector('.solaris-pie-chart__empty')).not.toBeNull();
    expect(
      el.querySelector('.solaris-pie-chart__empty-title')?.textContent,
    ).toContain('No data');
    expect(el.querySelector('svg')?.hasAttribute('hidden')).toBe(true);
    expect(paths(el)).toHaveLength(0);
  });

  it('exposes a screen-reader data table with every value', () => {
    const el = createFixture();
    const table = el.querySelector('.solaris-pie-chart__data');
    expect(table?.textContent).toContain('Fundamental');
    expect(table?.textContent).toContain('1.2K');
  });

  it('renders on the server without browser APIs', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });
    const server = TestBed.createComponent(SolarisPieChartComponent);
    server.componentRef.setInput('locale', 'en-US');
    server.componentRef.setInput('series', []);
    server.componentRef.setInput('slices', SLICES);
    expect(() => server.detectChanges()).not.toThrow();
    const el = server.nativeElement as HTMLElement;
    expect(el.querySelectorAll('[data-slice]')).toHaveLength(4);
  });

  it('never mutates the consumer slices', () => {
    const frozen = SLICES.map((slice) => Object.freeze({ ...slice }));
    const snapshot = JSON.stringify(frozen);
    createFixture(frozen);
    fixture.componentRef.setInput('minSlicePercent', 30);
    fixture.detectChanges();
    expect(JSON.stringify(frozen)).toBe(snapshot);
  });
});
