import { By } from '@angular/platform-browser';
import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { SolarisTranslateService } from '../../../../../services/translation';
import { SolarisChartShellComponent } from '../component/chart-shell.component';
import type {
  SolarisChartPeriod,
  SolarisChartSeries,
  SolarisChartView,
} from '../../model/chart.types';

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

  it('should expose defaults on the host', () => {
    const el = createFixture();
    expect(el.getAttribute('data-size')).toBe('md');
    expect(el.getAttribute('data-view')).toBe('line');
    expect(el.hasAttribute('data-loading')).toBe(false);
  });

  it('should render one legend button per series with pressed state', () => {
    const el = createFixture();
    const buttons = legendButtons(el);
    expect(buttons).toHaveLength(2);
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
    expect(buttons[1].hasAttribute('data-hidden')).toBe(true);
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
    const views: SolarisChartView[] = [];
    fixture.componentInstance.viewChange.subscribe((view) =>
      views.push(view as SolarisChartView),
    );
    selectView('bar');
    expect(views).toEqual(['bar']);
    expect(el.getAttribute('data-view')).toBe('bar');
  });

  it('should ignore unknown or unavailable views', () => {
    const el = createFixture();
    selectView('radar');
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

  it('should render the period filter with six options by default', () => {
    const el = createFixture();
    expect(el.querySelectorAll('solaris-segmented-item')).toHaveLength(6);
  });

  it('should update the period model through the filter', () => {
    createFixture();
    const periods: SolarisChartPeriod[] = [];
    fixture.componentInstance.periodChange.subscribe((period) =>
      periods.push(period as SolarisChartPeriod),
    );
    const items = fixture.debugElement.queryAll(
      By.css('solaris-segmented-item'),
    );
    items[2].nativeElement.click();
    fixture.detectChanges();
    expect(periods).toEqual(['1M']);
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
      { value: '7D', label: 'Semana!' },
      { value: '1M', labelKey: 'solaris.chart.period1M' },
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
      By.css('solaris-segmented-control'),
    );
    control.triggerEventHandler('valueChange', 'never');
    fixture.detectChanges();
    expect(
      fixture.debugElement
        .query(By.css('solaris-segmented-control'))
        .componentInstance.value(),
    ).toBe('7D');
  });

  it('should ignore valid but unavailable periods', () => {
    createFixture();
    fixture.componentRef.setInput('availablePeriods', [
      { value: '7D' },
      { value: '1D' },
    ]);
    fixture.detectChanges();
    const control = fixture.debugElement.query(
      By.css('solaris-segmented-control'),
    );
    control.triggerEventHandler('valueChange', '1M');
    fixture.detectChanges();
    expect(control.componentInstance.value()).toBe('7D');
  });

  it('should hide toolbar blocks behind show flags', () => {
    const el = createFixture();
    fixture.componentRef.setInput('showViewSwitcher', false);
    fixture.componentRef.setInput('showPeriodFilter', false);
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
});
