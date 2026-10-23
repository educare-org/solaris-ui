import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { SolarisTranslateService } from '../../../../../services/translation';
import type { SolarisHeatmapRow } from '../model/chart-heatmap.types';
import { SolarisHeatmapComponent } from '../component/heatmap.component';

const ROWS: readonly SolarisHeatmapRow[] = [
  { id: 'mon', label: 'Monday', values: [92, 50, null] },
  { id: 'tue', label: 'Tuesday', values: [80, 100, 60] },
];
const COLUMNS = ['7h', '8h', '9h'];

describe('SolarisHeatmapComponent', () => {
  let fixture: ComponentFixture<SolarisHeatmapComponent>;

  const createFixture = (
    rows: readonly SolarisHeatmapRow[] = ROWS,
    columns: readonly string[] = COLUMNS,
  ): HTMLElement => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisHeatmapComponent);
    fixture.componentRef.setInput('locale', 'en-US');
    fixture.componentRef.setInput('rows', rows);
    fixture.componentRef.setInput('columns', columns);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  const cells = (el: HTMLElement): SVGGraphicsElement[] =>
    Array.from(el.querySelectorAll<SVGGraphicsElement>('[data-cell]'));

  it('renders an svg with role img and a synthesized summary', () => {
    const el = createFixture();
    const svg = el.querySelector('svg');
    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.getAttribute('aria-label')).toContain('2 × 3');
    expect(svg?.getAttribute('aria-label')).toContain('Total');
  });

  it('honors an explicit aria label override', () => {
    const el = createFixture();
    fixture.componentRef.setInput('ariaLabel', 'Custom heatmap');
    fixture.detectChanges();
    expect(el.querySelector('svg')?.getAttribute('aria-label')).toBe(
      'Custom heatmap',
    );
  });

  it('falls back to embedded strings without a translate provider', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: SolarisTranslateService, useValue: null }],
    });
    const fallback = TestBed.createComponent(SolarisHeatmapComponent);
    fallback.componentRef.setInput('locale', 'pt-BR');
    fallback.componentRef.setInput('rows', ROWS);
    fallback.componentRef.setInput('columns', COLUMNS);
    fallback.detectChanges();
    const label =
      (fallback.nativeElement as HTMLElement)
        .querySelector('svg')
        ?.getAttribute('aria-label') ?? '';
    expect(label).toContain('2 × 3');
  });

  it('exposes the size on the host and renders one rect per cell', () => {
    const el = createFixture();
    expect(el.getAttribute('data-size')).toBe('md');
    expect(cells(el)).toHaveLength(6);
    expect(cells(el)[0]?.getAttribute('tabindex')).toBe('0');
    expect(cells(el)[1]?.getAttribute('tabindex')).toBe('-1');
  });

  it('labels every cell with row, column and formatted value', () => {
    const el = createFixture();
    expect(cells(el)[0]?.getAttribute('aria-label')).toBe('Monday, 7h: 92');
    expect(cells(el)[2]?.getAttribute('aria-label')).toBe('Monday, 9h: —');
  });

  it('paints intensity with a primary color-mix and empties neutral', () => {
    const el = createFixture();
    expect(cells(el)[0]?.getAttribute('fill')).toContain(
      'var(--solaris-primary-solid)',
    );
    expect(cells(el)[2]?.getAttribute('fill')).toBe(
      'var(--solaris-neutral-subtle)',
    );
    expect(cells(el)[2]?.hasAttribute('data-empty')).toBe(true);
  });

  it('scales intensity against an explicit max', () => {
    const el = createFixture();
    fixture.componentRef.setInput('max', 200);
    fixture.detectChanges();
    expect(cells(el)[0]?.getAttribute('fill')).toContain('47%');
  });

  it('staggers cell entrances by grid position', () => {
    const el = createFixture();
    const delays = cells(el).map((cell) => cell.style.animationDelay);
    expect(delays[0]).toBe('0ms');
    expect(delays[3]).toBe('54ms');
  });

  it('renders a sticky gutter with one label per row', () => {
    const el = createFixture();
    const labels = Array.from(
      el.querySelectorAll('.solaris-heatmap__gutter-label'),
    );
    expect(labels.map((label) => label.textContent?.trim())).toEqual([
      'Monday',
      'Tuesday',
    ]);
  });

  it('moves focus across columns and rows with the arrow keys', () => {
    const el = createFixture();
    cells(el)[0]?.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    cells(el)[0]?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    fixture.detectChanges();
    expect(cells(el)[1]?.getAttribute('tabindex')).toBe('0');
    expect(cells(el)[0]?.getAttribute('tabindex')).toBe('-1');
    cells(el)[1]?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    fixture.detectChanges();
    expect(cells(el)[4]?.getAttribute('tabindex')).toBe('0');
    expect(cells(el)[1]?.getAttribute('tabindex')).toBe('-1');
  });

  it('supports Home and End jumps and vertical clamping', () => {
    const el = createFixture();
    cells(el)[4]?.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    cells(el)[4]?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Home', bubbles: true }),
    );
    fixture.detectChanges();
    expect(cells(el)[3]?.getAttribute('tabindex')).toBe('0');
    cells(el)[3]?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }),
    );
    fixture.detectChanges();
    expect(cells(el)[0]?.getAttribute('tabindex')).toBe('0');
    cells(el)[0]?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'End', bubbles: true }),
    );
    fixture.detectChanges();
    expect(cells(el)[2]?.getAttribute('tabindex')).toBe('0');
  });

  it('emits cellSelect on Enter and on click', () => {
    const el = createFixture();
    const emitted: { rowId: string; columnIndex: number }[] = [];
    fixture.componentInstance.cellSelect.subscribe((event) =>
      emitted.push(event),
    );
    const first = cells(el)[1];
    (first as unknown as HTMLElement).focus();
    fixture.detectChanges();
    first.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    cells(el)[4]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(emitted).toEqual([
      { rowId: 'mon', columnIndex: 1 },
      { rowId: 'tue', columnIndex: 1 },
    ]);
  });

  it('shows a tooltip anchored inside the svg wrapper on focus', () => {
    const el = createFixture();
    cells(el)[0]?.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    const tooltip = el.querySelector('.solaris-heatmap__tooltip');
    expect(tooltip).not.toBeNull();
    expect(
      tooltip?.parentElement?.classList.contains('solaris-heatmap__canvas'),
    ).toBe(true);
    expect(tooltip?.textContent).toContain('Monday');
    expect(tooltip?.textContent).toContain('7h');
    expect(tooltip?.textContent).toContain('92');
  });

  it('docks the tooltip toward the grid center to stay visible', () => {
    const el = createFixture(
      [{ id: 'x', label: 'X', values: [10, 20, 30] }],
      ['a', 'b', 'c'],
    );
    cells(el)[2]?.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    expect(
      el.querySelector('.solaris-heatmap__tooltip')?.getAttribute('data-side'),
    ).toBe('left');
  });

  it('hides the intensity scale by default and shows it segmented with ticks', () => {
    const el = createFixture();
    expect(el.querySelector('.solaris-heatmap__scale')).toBeNull();
    fixture.componentRef.setInput('showScale', true);
    fixture.detectChanges();
    const scale = el.querySelector('.solaris-heatmap__scale');
    const segments = scale?.querySelectorAll('.solaris-heatmap__scale-segment');
    expect(segments).toHaveLength(5);
    expect(scale?.textContent).toContain('100');
    expect(scale?.textContent).toContain('0');
    expect(segments?.[4]?.getAttribute('style')).toContain(
      'var(--solaris-primary-solid)',
    );
  });

  it('docks the tooltip for empty cells with a dash', () => {
    const el = createFixture();
    cells(el)[2]?.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    expect(
      el.querySelector('.solaris-heatmap__tooltip')?.textContent,
    ).toContain('—');
  });

  it('hides the svg and renders an empty state with no plottable data', () => {
    const el = createFixture(
      [{ id: 'x', label: 'X', values: [null, null, null] }],
      COLUMNS,
    );
    expect(el.querySelector('svg')?.hasAttribute('hidden')).toBe(true);
    expect(
      el.querySelector('.solaris-heatmap__empty-title')?.textContent,
    ).toContain('No data');
    expect(cells(el)).toHaveLength(3);
  });

  it('honors a custom value formatter', () => {
    const el = createFixture();
    fixture.componentRef.setInput(
      'valueFormat',
      (value: number) => `${value}%`,
    );
    fixture.detectChanges();
    expect(cells(el)[0]?.getAttribute('aria-label')).toBe('Monday, 7h: 92%');
  });

  it('exposes a screen-reader data table', () => {
    const el = createFixture();
    const data = el.querySelector('.solaris-heatmap__data');
    expect(data?.textContent).toContain('Monday');
    expect(data?.textContent).toContain('Tuesday');
    expect(data?.textContent).toContain('92');
  });

  it('renders identically on the server without browser APIs', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const server = TestBed.createComponent(SolarisHeatmapComponent);
    server.componentRef.setInput('locale', 'en-US');
    server.componentRef.setInput('rows', ROWS);
    server.componentRef.setInput('columns', COLUMNS);
    expect(() => server.detectChanges()).not.toThrow();
    expect(
      (server.nativeElement as HTMLElement).querySelectorAll('[data-cell]'),
    ).toHaveLength(6);
  });

  it('never mutates the consumer rows', () => {
    const frozen = ROWS.map((row) => Object.freeze({ ...row }));
    const el = createFixture(frozen, COLUMNS);
    expect(cells(el)).toHaveLength(6);
    expect(frozen[0]?.values).toEqual([92, 50, null]);
  });
});
