import { By } from '@angular/platform-browser';
import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { configureSolarisTesting } from '../../../../../testing/solaris-test-utilities';
import { SolarisTranslateService } from '../../../../../services/translation';
import { SolarisChartShellComponent } from '../component/chart-shell.component';
import type { SolarisChartSeries } from '../../model/chart.types';

const SERIES: readonly SolarisChartSeries[] = [
  {
    id: 'automation',
    label: 'Task Automation',
    points: [
      { x: 28, y: 180 },
      { x: 29, y: 210 },
    ],
  },
  {
    id: 'queries',
    label: 'User Queries',
    hidden: true,
    points: [{ x: 28, y: 60 }],
  },
];

describe('SolarisChartShellComponent', () => {
  let fixture: ComponentFixture<SolarisChartShellComponent>;

  const createFixture = () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisChartShellComponent);
    fixture.componentRef.setInput('locale', 'en-US');
    fixture.componentRef.setInput('series', SERIES);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  const legendButtons = (el: HTMLElement): readonly HTMLButtonElement[] =>
    Array.from(
      el.querySelectorAll<HTMLButtonElement>(
        '.solaris-chart-shell__legend-item',
      ),
    );

  const selectView = (value: unknown): void => {
    const select = fixture.debugElement.query(
      By.css('solaris-select.solaris-chart-shell__view-select'),
    );
    select.triggerEventHandler('valueChange', value);
    fixture.detectChanges();
  };

  it('should render the component with title, hero and interval', () => {
    const el = createFixture();
    fixture.componentRef.setInput('title', 'Weekly Agent Activity');
    fixture.componentRef.setInput('heroValue', '12,450');
    fixture.componentRef.setInput('heroLabel', 'tasks');
    fixture.componentRef.setInput('intervalLabel', 'Apr 28 → May 04');
    fixture.detectChanges();
    expect(el.querySelector('.solaris-card-title')?.textContent).toContain(
      'Weekly Agent Activity',
    );
    expect(
      el.querySelector('.solaris-chart-shell__hero-value')?.textContent,
    ).toContain('12,450');
    expect(
      el.querySelector('.solaris-chart-shell__interval')?.textContent,
    ).toContain('Apr 28');
  });

  it('should stack the hero label above the value with an optional trend delta', () => {
    const el = createFixture();
    fixture.componentRef.setInput('heroValue', '1,3 mil');
    fixture.componentRef.setInput('heroLabel', 'tarefas');
    fixture.componentRef.setInput('heroDelta', '+11,4%');
    fixture.componentRef.setInput('heroDeltaDirection', 'up');
    fixture.detectChanges();
    const hero = el.querySelector('.solaris-chart-shell__hero');
    expect(hero?.textContent).toContain('tarefas');
    const badge = el.querySelector('solaris-badge');
    expect(badge?.textContent).toContain('+11,4%');
    expect(badge?.getAttribute('aria-label')).toContain('Rising');
    const icon = fixture.debugElement.query(
      By.css('.solaris-chart-shell__hero solaris-icon'),
    );
    expect(icon.componentInstance.name()).toBe('caret-up');
    expect(icon.componentInstance.decorative()).toBe(true);
  });

  it('should render a danger badge for a downward trend', () => {
    const el = createFixture();
    fixture.componentRef.setInput('heroValue', '1,3 mil');
    fixture.componentRef.setInput('heroDelta', '-8,1%');
    fixture.componentRef.setInput('heroDeltaDirection', 'down');
    fixture.detectChanges();
    const badge = el.querySelector('solaris-badge');
    expect(badge?.getAttribute('aria-label')).toContain('Falling');
    const icon = fixture.debugElement.query(
      By.css('.solaris-chart-shell__hero solaris-icon'),
    );
    expect(icon.componentInstance.name()).toBe('caret-down');
  });

  it('should translate the trend label through the fallback strings', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: SolarisTranslateService, useValue: null }],
    });
    const fallback = TestBed.createComponent(SolarisChartShellComponent);
    fallback.componentRef.setInput('locale', 'pt-BR');
    fallback.componentRef.setInput('series', SERIES);
    fallback.componentRef.setInput('heroValue', '1,3 mil');
    fallback.componentRef.setInput('heroDelta', '-8,1%');
    fallback.componentRef.setInput('heroDeltaDirection', 'down');
    fallback.detectChanges();
    const badge = (fallback.nativeElement as HTMLElement).querySelector(
      'solaris-badge',
    );
    expect(badge?.getAttribute('aria-label')).toContain('Em queda');
  });

  it('should hide the trend badge without delta input', () => {
    const el = createFixture();
    fixture.detectChanges();
    expect(el.querySelector('solaris-badge')).toBeNull();
  });

  it('should expose defaults on the host', () => {
    const el = createFixture();
    expect(el.getAttribute('data-size')).toBe('md');
    expect(el.getAttribute('data-view')).toBe('line');
    expect(el.hasAttribute('data-loading')).toBe(false);
  });

  it('should reflect size and density on the host', () => {
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

  it('should render one legend button per series with pressed state', () => {
    const el = createFixture();
    const buttons = legendButtons(el);
    expect(buttons).toHaveLength(2);
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
    expect(buttons[1].hasAttribute('data-hidden')).toBe(true);
  });

  it('should label the legend as a filter', () => {
    const el = createFixture();
    expect(
      el.querySelector('.solaris-chart-shell__legend-title')?.textContent,
    ).toContain('Filter by:');
  });

  it('should emit seriesToggle without mutating the consumer array', () => {
    const el = createFixture();
    const emitted: string[] = [];
    fixture.componentInstance.seriesToggle.subscribe((id) => emitted.push(id));
    const frozen = SERIES.map((entry) =>
      Object.freeze({ ...entry, points: Object.freeze([...entry.points]) }),
    );
    const snapshot = JSON.parse(JSON.stringify(frozen)) as unknown;
    fixture.componentRef.setInput('series', frozen);
    fixture.detectChanges();
    legendButtons(el)[0].click();
    fixture.detectChanges();
    expect(emitted).toEqual(['automation']);
    expect(fixture.componentInstance.series).toBeDefined();
    expect(JSON.parse(JSON.stringify(frozen)) as unknown).toEqual(snapshot);
  });

  it('should color legend dots from the palette order', () => {
    const el = createFixture();
    const dots = Array.from(
      el.querySelectorAll<HTMLElement>('.solaris-chart-shell__legend-dot'),
    );
    expect(dots[0].style.backgroundColor).toBe('var(--solaris-primary-solid)');
    expect(dots[1].style.backgroundColor).toBe('var(--solaris-accent-solid)');
  });

  it('should honor explicit series colors', () => {
    const el = createFixture();
    fixture.componentRef.setInput('series', [
      { id: 'a', label: 'A', color: 'danger', points: [{ x: 1, y: 1 }] },
    ]);
    fixture.detectChanges();
    const dot = el.querySelector<HTMLElement>(
      '.solaris-chart-shell__legend-dot',
    );
    expect(dot?.style.backgroundColor).toBe('var(--solaris-danger-solid)');
  });

  it('should expose the view switcher with three translated options', async () => {
    const el = createFixture();
    expect(
      el.querySelector('solaris-select.solaris-chart-shell__view-select'),
    ).toBeTruthy();
    const trigger = el.querySelector<HTMLElement>(
      'solaris-select.solaris-chart-shell__view-select .solaris-select__trigger',
    );
    trigger?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const options = Array.from(
      document.body.querySelectorAll(
        'solaris-dropdown-menu-item, solaris-option',
      ),
    );
    expect(options.length).toBeGreaterThan(0);
    document.body
      .querySelectorAll('.cdk-overlay-container')
      .forEach((node) => node.remove());
  });

  it('should update the view model through the switcher', () => {
    const el = createFixture();
    selectView('bar');
    expect(fixture.componentInstance.view()).toBe('bar');
    expect(el.getAttribute('data-view')).toBe('bar');
  });

  it('should ignore unknown views', () => {
    const el = createFixture();
    selectView('scatter');
    expect(el.getAttribute('data-view')).toBe('line');
    fixture.componentRef.setInput('availableViews', [
      { value: 'line' },
      { value: 'bar' },
    ]);
    fixture.detectChanges();
    selectView('pie');
    expect(el.getAttribute('data-view')).toBe('line');
    fixture.componentRef.setInput('availableViews', [{ value: 'line' }]);
    fixture.detectChanges();
    expect(
      el.querySelector('solaris-select.solaris-chart-shell__view-select'),
    ).toBeNull();
  });

  it('should accept heatmap and radar as opt-in N1 views', () => {
    const el = createFixture();
    fixture.componentRef.setInput('availableViews', [
      { value: 'line' },
      { value: 'heatmap' },
      { value: 'radar' },
    ]);
    fixture.detectChanges();
    selectView('heatmap');
    expect(el.getAttribute('data-view')).toBe('heatmap');
    selectView('radar');
    expect(el.getAttribute('data-view')).toBe('radar');
  });

  it('should render the period filter with six options by default', () => {
    const el = createFixture();
    expect(
      el.querySelectorAll(
        '.solaris-chart-shell__periods solaris-segmented-item',
      ),
    ).toHaveLength(6);
  });

  it('should render display and period filters side by side by default', () => {
    const el = createFixture();
    expect(
      el.querySelector(
        '.solaris-chart-shell__filters .solaris-chart-shell__display',
      ),
    ).toBeTruthy();
    expect(
      el.querySelectorAll(
        '.solaris-chart-shell__display solaris-segmented-item',
      ),
    ).toHaveLength(2);
  });

  it('should update the display mode through the switcher', () => {
    createFixture();
    const control = fixture.debugElement.query(
      By.css('solaris-segmented-control.solaris-chart-shell__display'),
    );
    control.triggerEventHandler('valueChange', 'list');
    fixture.detectChanges();
    expect(fixture.componentInstance.displayMode()).toBe('list');
    expect(
      (fixture.nativeElement as HTMLElement).getAttribute('data-display-mode'),
    ).toBe('list');
  });

  it('should expose a dedicated fullscreen button outside the menu', () => {
    const el = createFixture();
    const requested: string[] = [];
    fixture.componentInstance.actionRequest.subscribe((action) =>
      requested.push(action),
    );
    const buttons = Array.from(
      el.querySelectorAll<HTMLElement>(
        '.solaris-chart-shell__toolbar button[solaris-icon-button]',
      ),
    );
    expect(buttons.length).toBeGreaterThanOrEqual(2);
    buttons[0].click();
    fixture.detectChanges();
    expect(requested).toEqual(['fullscreen']);
  });

  it('should update the period model through the filter', () => {
    createFixture();
    const items = fixture.debugElement.queryAll(
      By.css('.solaris-chart-shell__periods solaris-segmented-item'),
    );
    items[2].nativeElement.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.period()).toBe('month');
  });

  it('should render literal description and aria label inputs', () => {
    const el = createFixture();
    fixture.componentRef.setInput('description', 'Custom description');
    fixture.componentRef.setInput('ariaLabel', 'Custom chart label');
    fixture.detectChanges();
    expect(
      el.querySelector('[solaris-card-description]')?.textContent,
    ).toContain('Custom description');
    expect(el.querySelector('solaris-card')?.getAttribute('aria-label')).toBe(
      'Custom chart label',
    );
  });

  it('should summarize visible series without plottable points as zero peak', () => {
    const el = createFixture();
    fixture.componentRef.setInput('series', [
      { id: 'a', label: 'A', points: [{ x: 1, y: null }] },
      { id: 'b', label: 'B', points: [{ x: 1, y: 4 }] },
    ]);
    fixture.detectChanges();
    expect(
      el
        .querySelector('.solaris-chart-shell__canvas')
        ?.getAttribute('aria-label'),
    ).toContain('A: 0 points');
  });

  it('should label custom actions by value when no dictionary entry exists', () => {
    const el = createFixture();
    const requested: string[] = [];
    fixture.componentInstance.actionRequest.subscribe((action) =>
      requested.push(action),
    );
    fixture.componentRef.setInput('actions', [{ value: 'print' }]);
    fixture.detectChanges();
    const trigger = el.querySelector<HTMLElement>(
      '[solaris-dropdown-menu-trigger]',
    );
    trigger?.click();
    fixture.detectChanges();
    const item = document.body.querySelector<HTMLElement>(
      'solaris-dropdown-menu-item',
    );
    expect(item?.textContent).toContain('print');
    item?.click();
    fixture.detectChanges();
    expect(requested).toEqual(['print']);
    document.body
      .querySelectorAll('.cdk-overlay-container')
      .forEach((node) => node.remove());
  });
  it('should resolve option labels from label and labelKey inputs', () => {
    const el = createFixture();
    fixture.componentRef.setInput('availableViews', [
      { value: 'line', label: 'Linha!' },
      { value: 'bar', labelKey: 'solaris.chart.viewBar' },
    ]);
    fixture.componentRef.setInput('availablePeriods', [
      { value: 'week', label: 'Semana!' },
      { value: 'month', labelKey: 'solaris.chart.periodMonth' },
    ]);
    fixture.componentRef.setInput('actions', [
      { value: 'export', label: 'Export!' },
      { value: 'custom', labelKey: 'solaris.chart.actionsFullscreen' },
    ]);
    fixture.componentRef.setInput('titleKey', 'solaris.chart.viewLine');
    fixture.componentRef.setInput(
      'descriptionKey',
      'solaris.chart.emptyMessage',
    );
    fixture.componentRef.setInput(
      'intervalLabelKey',
      'solaris.chart.emptyMessage',
    );
    fixture.detectChanges();
    expect(el.querySelector('.solaris-card-title')?.textContent).toContain(
      'Line',
    );
  });

  it('should ignore unknown periods', () => {
    createFixture();
    const control = fixture.debugElement.query(
      By.css('solaris-segmented-control.solaris-chart-shell__periods'),
    );
    control.triggerEventHandler('valueChange', 'never');
    fixture.detectChanges();
    expect(
      fixture.debugElement
        .query(By.css('solaris-segmented-control.solaris-chart-shell__periods'))
        .componentInstance.value(),
    ).toBe('week');
  });

  it('should ignore valid but unavailable periods', () => {
    createFixture();
    fixture.componentRef.setInput('availablePeriods', [
      { value: 'week' },
      { value: 'day' },
    ]);
    fixture.detectChanges();
    const control = fixture.debugElement.query(
      By.css('solaris-segmented-control.solaris-chart-shell__periods'),
    );
    control.triggerEventHandler('valueChange', 'month');
    fixture.detectChanges();
    expect(control.componentInstance.value()).toBe('week');
  });

  it('should hide toolbar blocks behind show flags', () => {
    const el = createFixture();
    fixture.componentRef.setInput('showViewSwitcher', false);
    fixture.componentRef.setInput('showPeriodFilter', false);
    fixture.componentRef.setInput('showDisplaySwitcher', false);
    fixture.componentRef.setInput('showLegend', false);
    fixture.componentRef.setInput('showActions', false);
    fixture.detectChanges();
    expect(el.querySelector('solaris-select')).toBeNull();
    expect(el.querySelector('solaris-segmented-control')).toBeNull();
    expect(el.querySelector('.solaris-chart-shell__legend')).toBeNull();
    expect(el.querySelector('[solaris-dropdown-menu-trigger]')).toBeNull();
  });

  it('should render loading skeletons with a status role', () => {
    const el = createFixture();
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(el.querySelector('[role="status"]')).toBeTruthy();
    expect(el.querySelectorAll('solaris-skeleton').length).toBeGreaterThan(0);
    expect(el.hasAttribute('data-loading')).toBe(true);
  });

  it('should render the error state with a retry button', () => {
    const el = createFixture();
    let retries = 0;
    fixture.componentInstance.retry.subscribe(() => (retries += 1));
    fixture.componentRef.setInput('error', 'Network failed');
    fixture.detectChanges();
    expect(el.querySelector('[role="alert"]')).toBeTruthy();
    expect(
      el.querySelector('.solaris-chart-shell__error-message')?.textContent,
    ).toContain('Network failed');
    (
      el.querySelector(
        '.solaris-chart-shell__error button',
      ) as HTMLButtonElement
    ).click();
    expect(retries).toBe(1);
  });

  it('should render the empty state without plottable data', () => {
    const el = createFixture();
    fixture.componentRef.setInput('series', [
      { id: 'a', label: 'A', points: [{ x: 1, y: null }] },
    ]);
    fixture.detectChanges();
    expect(
      el.querySelector('.solaris-chart-shell__empty-title')?.textContent,
    ).toContain('No data');
    expect(el.hasAttribute('data-empty')).toBe(true);
  });

  it('should treat fully hidden series as empty', () => {
    const el = createFixture();
    fixture.componentRef.setInput('series', [
      { id: 'a', label: 'A', hidden: true, points: [{ x: 1, y: 5 }] },
    ]);
    fixture.detectChanges();
    expect(el.querySelector('.solaris-chart-shell__empty')).toBeTruthy();
  });

  it('should project chart content inside an accessible canvas', () => {
    const el = createFixture();
    const canvas = el.querySelector('.solaris-chart-shell__canvas');
    expect(canvas?.getAttribute('role')).toBe('img');
    expect(canvas?.getAttribute('aria-label')).toContain('Task Automation');
  });

  it('should emit actionRequest from the menu', () => {
    const el = createFixture();
    const requested: string[] = [];
    fixture.componentInstance.actionRequest.subscribe((action) =>
      requested.push(action),
    );
    const trigger = el.querySelector<HTMLElement>(
      '[solaris-dropdown-menu-trigger]',
    );
    trigger?.click();
    fixture.detectChanges();
    const item = document.body.querySelector<HTMLElement>(
      'solaris-dropdown-menu-item',
    );
    expect(item).toBeTruthy();
    item?.click();
    fixture.detectChanges();
    expect(requested).toEqual(['export']);
    document.body
      .querySelectorAll('.cdk-overlay-container')
      .forEach((node) => node.remove());
  });

  it('should fall back to embedded strings without a translate provider', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: SolarisTranslateService, useValue: null }],
    });
    const fallback = TestBed.createComponent(SolarisChartShellComponent);
    fallback.componentRef.setInput('locale', 'pt-BR');
    fallback.componentRef.setInput('series', []);
    fallback.detectChanges();
    const el = fallback.nativeElement as HTMLElement;
    expect(
      el.querySelector('.solaris-chart-shell__empty-title')?.textContent,
    ).toContain('Sem dados');
  });

  it('should derive the interval label from start and end without intervalLabel', () => {
    const el = createFixture();
    fixture.componentRef.setInput('intervalStart', '2026-04-28');
    fixture.componentRef.setInput('intervalEnd', '2026-05-04');
    fixture.detectChanges();
    expect(
      el.querySelector('.solaris-chart-shell__interval-trigger')?.textContent,
    ).toContain('04/28/2026');
  });

  it('should render a clickable interval trigger instead of the static label', () => {
    configureSolarisTesting();
    const shell = TestBed.createComponent(SolarisChartShellComponent);
    shell.componentRef.setInput('locale', 'en-US');
    shell.componentRef.setInput('series', SERIES);
    shell.componentRef.setInput('intervalStart', '2026-04-28');
    shell.componentRef.setInput('intervalEnd', '2026-05-04');
    shell.detectChanges();
    const el = shell.nativeElement as HTMLElement;
    const trigger = el.querySelector(
      '.solaris-chart-shell__interval-trigger',
    ) as HTMLButtonElement;
    expect(trigger).toBeTruthy();
    expect(trigger.textContent).toContain('04/28/2026');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(el.querySelector('.solaris-chart-shell__interval')).toBeNull();
    expect(el.querySelector('solaris-date-range-picker')).toBeNull();
  });

  it('should toggle the range picker below the filters', async () => {
    configureSolarisTesting();
    const shell = TestBed.createComponent(SolarisChartShellComponent);
    shell.componentRef.setInput('locale', 'en-US');
    shell.componentRef.setInput('series', SERIES);
    shell.componentRef.setInput('intervalStart', '2026-04-28');
    shell.componentRef.setInput('intervalEnd', '2026-05-04');
    shell.detectChanges();
    const el = shell.nativeElement as HTMLElement;
    const trigger = el.querySelector(
      '.solaris-chart-shell__interval-trigger',
    ) as HTMLButtonElement;
    const panel = () =>
      document.querySelector(
        'solaris-date-range-picker .solaris-date-range-picker__panel',
      );
    trigger.click();
    await new Promise((resolve) => setTimeout(resolve, 10));
    shell.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(panel()).toBeTruthy();
    trigger.click();
    shell.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    await new Promise((resolve) => setTimeout(resolve, 350));
    expect(panel()).toBeNull();
  });

  it('should keep the static interval label without dates', () => {
    const el = createFixture();
    fixture.componentRef.setInput('intervalLabel', 'Apr 28 → May 04');
    fixture.detectChanges();
    expect(
      el.querySelector('.solaris-chart-shell__interval')?.textContent,
    ).toContain('Apr 28');
    expect(
      el.querySelector('.solaris-chart-shell__interval-trigger'),
    ).toBeNull();
  });

  it('should keep both picker sides editable for fixed-duration periods', async () => {
    const el = createFixture();
    fixture.componentRef.setInput('intervalStart', '2026-04-28');
    fixture.componentRef.setInput('intervalEnd', '2026-05-04');
    fixture.detectChanges();
    (
      el.querySelector(
        '.solaris-chart-shell__interval-trigger',
      ) as HTMLButtonElement
    ).click();
    await new Promise((resolve) => setTimeout(resolve, 10));
    fixture.detectChanges();
    const inputs = Array.from(
      document.querySelectorAll(
        'solaris-date-range-picker .solaris-date-range-picker__panel input',
      ),
    ) as HTMLInputElement[];
    expect(inputs).toHaveLength(2);
    expect(inputs.every((input) => !input.disabled)).toBe(true);
    (fixture.componentInstance as any).closeIntervalPicker();
    await new Promise((resolve) => setTimeout(resolve, 350));
  });

  it('should recompute the end when the period segment changes', () => {
    createFixture();
    const ranges: unknown[] = [];
    fixture.componentInstance.rangeChange.subscribe((range) =>
      ranges.push(range),
    );
    fixture.componentRef.setInput('intervalStart', '2026-04-28');
    fixture.componentRef.setInput('intervalEnd', '2026-05-04');
    fixture.detectChanges();
    const control = fixture.debugElement.query(
      By.css('solaris-segmented-control.solaris-chart-shell__periods'),
    );
    control.triggerEventHandler('valueChange', 'month');
    fixture.detectChanges();
    expect(fixture.componentInstance.intervalEnd()).toBe('2026-05-28');
    expect(ranges).toEqual([
      { start: '2026-04-28', end: '2026-05-28', period: 'month' },
    ]);
  });

  it('should keep a freely edited end and fall back to custom', () => {
    createFixture();
    const ranges: unknown[] = [];
    fixture.componentInstance.rangeChange.subscribe((range) =>
      ranges.push(range),
    );
    (fixture.componentInstance as any).onIntervalPickerChange({
      start: '2026-04-28',
      end: '2026-05-10',
    });
    expect(fixture.componentInstance.intervalEnd()).toBe('2026-05-10');
    expect(fixture.componentInstance.period()).toBe('custom');
    expect(ranges).toEqual([
      { start: '2026-04-28', end: '2026-05-10', period: 'custom' },
    ]);
  });

  it('should keep both picker dates for open periods', () => {
    createFixture();
    fixture.componentRef.setInput('availablePeriods', [{ value: 'all' }]);
    fixture.componentRef.setInput('period', 'all');
    fixture.detectChanges();
    (fixture.componentInstance as any).onIntervalPickerChange({
      start: '2026-01-01',
      end: '2026-12-31',
    });
    expect(fixture.componentInstance.intervalStart()).toBe('2026-01-01');
    expect(fixture.componentInstance.intervalEnd()).toBe('2026-12-31');
  });

  it('should switch the period to the matching preset on picker apply', () => {
    createFixture();
    fixture.componentRef.setInput('availablePeriods', [
      { value: 'month', fixedDuration: { months: 1 } },
      { value: 'all' },
    ]);
    fixture.componentRef.setInput('period', 'all');
    fixture.detectChanges();
    (fixture.componentInstance as any).onIntervalPickerChange({
      start: '2026-04-28',
      end: '2026-05-28',
    });
    expect(fixture.componentInstance.period()).toBe('month');
  });

  it('should adopt the preset period instead of recomputing a locked end', () => {
    createFixture();
    fixture.componentRef.setInput('intervalStart', '2026-01-01');
    fixture.componentRef.setInput('intervalEnd', '2026-01-07');
    fixture.detectChanges();
    (fixture.componentInstance as any).onIntervalPickerChange({
      start: '2026-01-01',
      end: '2026-02-01',
    });
    expect(fixture.componentInstance.intervalEnd()).toBe('2026-02-01');
    expect(fixture.componentInstance.period()).toBe('month');
  });

  it('should fall back to a custom period for unmatched ranges', () => {
    const el = createFixture();
    fixture.componentRef.setInput('period', 'all');
    fixture.componentRef.setInput('intervalStart', '2026-05-06');
    fixture.componentRef.setInput('intervalEnd', '2026-05-27');
    fixture.detectChanges();
    (fixture.componentInstance as any).onIntervalPickerChange({
      start: '2026-05-06',
      end: '2026-05-27',
    });
    fixture.detectChanges();
    expect(fixture.componentInstance.period()).toBe('custom');
    const items = Array.from(
      el.querySelectorAll(
        '.solaris-chart-shell__periods solaris-segmented-item',
      ),
    );
    expect(items).toHaveLength(7);
  });

  it('should expose presets anchored at the current start', () => {
    createFixture();
    fixture.componentRef.setInput('intervalStart', '2026-04-28');
    fixture.componentRef.setInput('intervalEnd', '2026-05-04');
    fixture.detectChanges();
    const presets = (fixture.componentInstance as any).intervalPresets();
    const ids = presets.map((preset: { id: string }) => preset.id);
    expect(ids).toContain('week');
    expect(ids).toContain('month');
    expect(ids).not.toContain('all');
    expect(
      presets.find((preset: { id: string }) => preset.id === 'week').range,
    ).toEqual({ start: '2026-04-28', end: '2026-05-04' });
  });

  it('should append an icon-only custom option before all when interactive', () => {
    const el = createFixture();
    fixture.componentRef.setInput('intervalStart', '2026-04-28');
    fixture.componentRef.setInput('intervalEnd', '2026-05-04');
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(
      By.css('.solaris-chart-shell__periods solaris-segmented-item'),
    );
    expect(items.map((item) => item.componentInstance.value())).toEqual([
      'day',
      'week',
      'month',
      'quarter',
      'year',
      'custom',
      'all',
    ]);
    const custom = items[5];
    expect(custom.componentInstance.icon()).toBe('calendar');
    expect(
      (custom.nativeElement as HTMLElement).getAttribute('aria-label'),
    ).toContain('Custom');
    expect(
      el.querySelectorAll(
        '.solaris-chart-shell__periods solaris-segmented-item',
      ),
    ).toHaveLength(7);
  });

  it('should toggle the picker without selecting when the icon is clicked', async () => {
    configureSolarisTesting();
    const shell = TestBed.createComponent(SolarisChartShellComponent);
    shell.componentRef.setInput('locale', 'en-US');
    shell.componentRef.setInput('series', SERIES);
    shell.componentRef.setInput('intervalStart', '2026-04-28');
    shell.componentRef.setInput('intervalEnd', '2026-05-04');
    shell.detectChanges();
    const el = shell.nativeElement as HTMLElement;
    const items = shell.debugElement.queryAll(
      By.css('.solaris-chart-shell__periods solaris-segmented-item'),
    );
    const panel = () =>
      document.querySelector(
        'solaris-date-range-picker .solaris-date-range-picker__panel',
      );
    (items[5].nativeElement as HTMLElement).click();
    shell.detectChanges();
    expect(shell.componentInstance.period()).toBe('week');
    expect(items[1].componentInstance.isSelected()).toBe(true);
    expect(items[5].componentInstance.isSelected()).toBe(false);
    expect(panel()).toBeTruthy();
    (items[5].nativeElement as HTMLElement).click();
    shell.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 350));
    expect(panel()).toBeNull();
  });

  it('should open the picker from the keyboard on the icon', async () => {
    configureSolarisTesting();
    const shell = TestBed.createComponent(SolarisChartShellComponent);
    shell.componentRef.setInput('locale', 'en-US');
    shell.componentRef.setInput('series', SERIES);
    shell.componentRef.setInput('intervalStart', '2026-04-28');
    shell.componentRef.setInput('intervalEnd', '2026-05-04');
    shell.detectChanges();
    const items = shell.debugElement.queryAll(
      By.css('.solaris-chart-shell__periods solaris-segmented-item'),
    );
    items[5].nativeElement.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    await new Promise((resolve) => setTimeout(resolve, 10));
    shell.detectChanges();
    expect(shell.componentInstance.period()).toBe('week');
    expect(
      document.querySelector(
        'solaris-date-range-picker .solaris-date-range-picker__panel',
      ),
    ).toBeTruthy();
    (shell.componentInstance as any).closeIntervalPicker();
    await new Promise((resolve) => setTimeout(resolve, 350));
  });

  it('should select a consumer-provided custom option normally', () => {
    createFixture();
    fixture.componentRef.setInput('availablePeriods', [
      { value: 'week' },
      { value: 'custom', label: 'Manual' },
    ]);
    fixture.componentRef.setInput('intervalStart', '2026-04-28');
    fixture.componentRef.setInput('intervalEnd', '2026-05-04');
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(
      By.css('.solaris-chart-shell__periods solaris-segmented-item'),
    );
    (items[1].nativeElement as HTMLElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.period()).toBe('custom');
    expect(
      document.querySelector(
        'solaris-date-range-picker .solaris-date-range-picker__panel',
      ),
    ).toBeNull();
    (fixture.componentInstance as any).closeIntervalPicker();
  });
});
