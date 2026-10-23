import { PLATFORM_ID } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { vi } from 'vitest';

import { SolarisTranslateService } from '../../../../../services/translation';
import type { SolarisRadarSeries } from '../model/chart-radar.types';
import { SolarisRadarComponent } from '../component/radar.component';

const AXES = ['Reading', 'Writing', 'Math', 'Science', 'Social'];
const SERIES: readonly SolarisRadarSeries[] = [
  { id: 'class-a', label: 'Class A', values: [8.5, 7, 9, 6.5, 8] },
  { id: 'class-b', label: 'Class B', values: [7, 8, 6, 8.5, 7.5] },
];

describe('SolarisRadarComponent', () => {
  let fixture: ComponentFixture<SolarisRadarComponent>;

  const createFixture = (
    series: readonly SolarisRadarSeries[] = SERIES,
    axes: readonly string[] = AXES,
  ): HTMLElement => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisRadarComponent);
    fixture.componentRef.setInput('locale', 'en-US');
    fixture.componentRef.setInput('axes', axes);
    fixture.componentRef.setInput('series', series);
    fixture.componentRef.setInput('max', 10);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  const flushMicrotasks = async (rounds = 10): Promise<void> => {
    for (let i = 0; i < rounds; i += 1) {
      await Promise.resolve();
    }
  };

  const vertices = (el: HTMLElement): SVGGraphicsElement[] =>
    Array.from(el.querySelectorAll<SVGGraphicsElement>('[data-vertex]'));

  const polygons = (el: HTMLElement): SVGPolygonElement[] =>
    Array.from(el.querySelectorAll<SVGPolygonElement>('[data-series]'));

  it('renders an svg with role img and a synthesized summary', () => {
    const el = createFixture();
    const svg = el.querySelector('svg');
    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.getAttribute('aria-label')).toContain('Radar 5 axes');
    expect(svg?.getAttribute('aria-label')).toContain('Class A');
  });

  it('honors an explicit aria label override', () => {
    const el = createFixture();
    fixture.componentRef.setInput('ariaLabel', 'Custom radar');
    fixture.detectChanges();
    expect(el.querySelector('svg')?.getAttribute('aria-label')).toBe(
      'Custom radar',
    );
  });

  it('falls back to embedded strings without a translate provider', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: SolarisTranslateService, useValue: null }],
    });
    const fallback = TestBed.createComponent(SolarisRadarComponent);
    fallback.componentRef.setInput('locale', 'pt-BR');
    fallback.componentRef.setInput('axes', AXES);
    fallback.componentRef.setInput('series', SERIES);
    fallback.detectChanges();
    const label =
      (fallback.nativeElement as HTMLElement)
        .querySelector('svg')
        ?.getAttribute('aria-label') ?? '';
    expect(label).toContain('Radar 5 axes');
    expect(label).toContain('Class B');
  });

  it('exposes the size on the host with one polygon and vertices per series', () => {
    const el = createFixture();
    expect(el.getAttribute('data-size')).toBe('md');
    expect(polygons(el)).toHaveLength(2);
    expect(vertices(el)).toHaveLength(10);
    expect(vertices(el)[0]?.getAttribute('tabindex')).toBe('0');
    expect(vertices(el)[1]?.getAttribute('tabindex')).toBe('-1');
  });

  it('labels every vertex with series, axis and formatted value', () => {
    const el = createFixture();
    expect(vertices(el)[0]?.getAttribute('aria-label')).toBe(
      'Class A, Reading: 8.5',
    );
    expect(vertices(el)[5]?.getAttribute('aria-label')).toBe(
      'Class B, Reading: 7',
    );
  });

  it('grows polygons from the center and settles on the final web', async () => {
    vi.useFakeTimers();
    try {
      const el = createFixture();
      await flushMicrotasks();
      fixture.detectChanges();
      expect(el.hasAttribute('data-entering')).toBe(true);
      const growing = polygons(el)[0]?.getAttribute('points') ?? '';
      vi.advanceTimersByTime(1500);
      fixture.detectChanges();
      expect(el.hasAttribute('data-entering')).toBe(false);
      const settled = polygons(el)[0]?.getAttribute('points') ?? '';
      expect(settled === '').toBe(false);
      expect(settled).not.toBe(growing);
    } finally {
      vi.useRealTimers();
    }
  });

  it('renders the final web under prefers-reduced-motion', async () => {
    const original = window.matchMedia;
    window.matchMedia = (() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    try {
      const el = createFixture();
      await flushMicrotasks();
      fixture.detectChanges();
      expect(el.hasAttribute('data-entering')).toBe(false);
      expect(polygons(el)).toHaveLength(2);
    } finally {
      window.matchMedia = original;
    }
  });

  it('docks the tooltip outside the hovered vertex', () => {
    const el = createFixture();
    vertices(el)[0]?.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    expect(
      el.querySelector('.solaris-radar__tooltip')?.getAttribute('data-side'),
    ).toBe('top');
  });

  it('labels the legend as a filter with button semantics', () => {
    const el = createFixture();
    expect(
      el.querySelector('.solaris-radar__legend-title')?.textContent,
    ).toContain('Filter by:');
    const toggle = el.querySelector(
      '[data-legend="class-a"]',
    ) as HTMLButtonElement;
    expect(toggle.getAttribute('aria-label')).toContain('Class A');
    toggle.click();
    fixture.detectChanges();
    expect(toggle.hasAttribute('data-hidden')).toBe(true);
    expect(
      toggle.querySelector('.solaris-radar__legend-label')?.textContent,
    ).toBe('Class A');
  });

  it('toggles series through the integrated legend', () => {
    const el = createFixture();
    const emitted: string[] = [];
    fixture.componentInstance.seriesToggle.subscribe((id) => emitted.push(id));
    const toggle = el.querySelector(
      '[data-legend="class-a"]',
    ) as HTMLButtonElement;
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    toggle.click();
    fixture.detectChanges();
    expect(emitted).toEqual(['class-a']);
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    expect(polygons(el)).toHaveLength(1);
    expect(polygons(el)[0]?.getAttribute('data-series')).toBe('class-b');
    toggle.click();
    fixture.detectChanges();
    expect(polygons(el)).toHaveLength(2);
  });

  it('keeps stable palette slots while toggling the legend', () => {
    const el = createFixture();
    const before = polygons(el)[1]?.getAttribute('stroke');
    (el.querySelector('[data-legend="class-a"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(polygons(el)[0]?.getAttribute('stroke')).toBe(before);
  });

  it('moves focus within a series with the arrow keys', () => {
    const el = createFixture();
    vertices(el)[0]?.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    vertices(el)[0]?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    fixture.detectChanges();
    expect(vertices(el)[1]?.getAttribute('tabindex')).toBe('0');
    expect(vertices(el)[0]?.getAttribute('tabindex')).toBe('-1');
    vertices(el)[1]?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'End', bubbles: true }),
    );
    fixture.detectChanges();
    expect(vertices(el)[4]?.getAttribute('tabindex')).toBe('0');
    vertices(el)[4]?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    fixture.detectChanges();
    expect(vertices(el)[4]?.getAttribute('tabindex')).toBe('0');
  });

  it('emits vertexSelect on Enter and on click', () => {
    const el = createFixture();
    const emitted: { seriesId: string; axisIndex: number }[] = [];
    fixture.componentInstance.vertexSelect.subscribe((event) =>
      emitted.push(event),
    );
    const first = vertices(el)[6];
    (first as unknown as HTMLElement).focus();
    fixture.detectChanges();
    first.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    vertices(el)[2]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(emitted).toEqual([
      { seriesId: 'class-b', axisIndex: 1 },
      { seriesId: 'class-a', axisIndex: 2 },
    ]);
  });

  it('shows a tooltip with series, axis and value on vertex focus', () => {
    const el = createFixture();
    vertices(el)[0]?.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    const tooltip = el.querySelector('.solaris-radar__tooltip');
    expect(tooltip).not.toBeNull();
    expect(
      tooltip?.parentElement?.classList.contains('solaris-radar__canvas'),
    ).toBe(true);
    expect(tooltip?.textContent).toContain('Class A');
    expect(tooltip?.textContent).toContain('Reading');
    expect(tooltip?.textContent).toContain('8.5');
  });

  it('clamps values above the max onto the web edge', async () => {
    vi.useFakeTimers();
    try {
      const el = createFixture([
        { id: 'over', label: 'Over', values: [12, 12, 12, 12, 12] },
      ]);
      await flushMicrotasks();
      vi.advanceTimersByTime(1500);
      fixture.detectChanges();
      const frame = polygons(el)[0]?.getAttribute('points') ?? '';
      const ends = Array.from(el.querySelectorAll('.solaris-radar__axis')).map(
        (line) => `${line.getAttribute('x2')},${line.getAttribute('y2')}`,
      );
      for (const end of ends) {
        expect(frame).toContain(end);
      }
    } finally {
      vi.useRealTimers();
    }
  });

  it('parks missing values at the center with a dash label', () => {
    const el = createFixture([
      { id: 'gap', label: 'Gap', values: [8, null, 6, 7, 5] },
    ]);
    expect(vertices(el)[1]?.getAttribute('aria-label')).toBe('Gap, Writing: —');
  });

  it('docks axis labels outside the web vertices', () => {
    const el = createFixture();
    const labels = Array.from(
      el.querySelectorAll('.solaris-radar__axis-label'),
    );
    expect(labels).toHaveLength(5);
    const ends = Array.from(el.querySelectorAll('.solaris-radar__axis')).map(
      (line) => ({
        x: Number(line.getAttribute('x2')),
        y: Number(line.getAttribute('y2')),
      }),
    );
    labels.forEach((label, index) => {
      const end = ends[index];
      const lx = Number(label.getAttribute('x'));
      const ly = Number(label.getAttribute('y'));
      const labelDistance = Math.hypot(lx - 160, ly - 150);
      const endDistance = Math.hypot((end?.x ?? 0) - 160, (end?.y ?? 0) - 150);
      expect(labelDistance).toBeGreaterThan(endDistance);
    });
  });

  it('hides the svg and renders an empty state with no visible series', () => {
    const el = createFixture([]);
    expect(el.querySelector('svg')?.hasAttribute('hidden')).toBe(true);
    expect(
      el.querySelector('.solaris-radar__empty-title')?.textContent,
    ).toContain('No data');
  });

  it('treats fewer than three axes as empty', () => {
    const el = createFixture(SERIES, ['Reading', 'Writing']);
    expect(el.querySelector('svg')?.hasAttribute('hidden')).toBe(true);
  });

  it('excludes prop-hidden series from the web and the marks', () => {
    const el = createFixture([
      ...SERIES,
      { id: 'old', label: 'Old', values: [5, 5, 5, 5, 5], hidden: true },
    ]);
    expect(polygons(el)).toHaveLength(2);
    expect(vertices(el)).toHaveLength(10);
  });

  it('honors a custom value formatter', () => {
    const el = createFixture();
    fixture.componentRef.setInput(
      'valueFormat',
      (value: number) => `${value}/10`,
    );
    fixture.detectChanges();
    expect(vertices(el)[0]?.getAttribute('aria-label')).toBe(
      'Class A, Reading: 8.5/10',
    );
  });

  it('exposes a screen-reader data table', () => {
    const el = createFixture();
    const data = el.querySelector('.solaris-radar__data');
    expect(data?.textContent).toContain('Reading');
    expect(data?.textContent).toContain('Class A');
    expect(data?.textContent).toContain('8.5');
  });

  it('renders identically on the server without browser APIs', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });
    const server = TestBed.createComponent(SolarisRadarComponent);
    server.componentRef.setInput('locale', 'en-US');
    server.componentRef.setInput('axes', AXES);
    server.componentRef.setInput('series', SERIES);
    expect(() => server.detectChanges()).not.toThrow();
    const el = server.nativeElement as HTMLElement;
    expect(el.querySelectorAll('[data-series]')).toHaveLength(2);
    expect(el.hasAttribute('data-entering')).toBe(false);
  });

  it('never mutates the consumer series', () => {
    const frozen = SERIES.map((entry) => Object.freeze({ ...entry }));
    const el = createFixture(frozen);
    expect(polygons(el)).toHaveLength(2);
    expect(frozen[0]?.values).toEqual([8.5, 7, 9, 6.5, 8]);
  });
});
