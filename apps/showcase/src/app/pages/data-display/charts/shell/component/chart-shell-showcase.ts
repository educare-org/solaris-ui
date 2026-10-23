import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { Component, OnDestroy, computed, inject, signal } from '@angular/core';

import {
  SolarisBarChartComponent,
  SolarisButtonDirective,
  SolarisChartShellComponent,
  SolarisCodeBlockComponent,
  SolarisDialogService,
  SolarisHeatmapComponent,
  SolarisLineChartComponent,
  SolarisPieChartComponent,
  SolarisPreviewCodeComponent,
  SolarisRadarComponent,
  SolarisTabComponent,
  SolarisTableComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisBarChartPointEvent,
  type SolarisChartDisplayMode,
  type SolarisChartPeriod,
  type SolarisChartSeries,
  type SolarisChartShellDensity,
  type SolarisChartShellSize,
  type SolarisChartShellTrend,
  type SolarisChartShellViewOption,
  type SolarisChartView,
  type SolarisHeatmapRow,
  type SolarisLineChartPointEvent,
  type SolarisRadarSeries,
  type SolarisTableColumn,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../../shared/showcase-page-utils';
import { ChartShellFullscreenDialogComponent } from './chart-shell-fullscreen-dialog.component';
import {
  CHART_SHELL_SHOWCASE_BASIC_CODE,
  CHART_SHELL_SHOWCASE_BREADCRUMBS,
  CHART_SHELL_SHOWCASE_DISPLAY_CODE,
  CHART_SHELL_SHOWCASE_ERROR_CODE,
  CHART_SHELL_SHOWCASE_IMPORT_CODE,
  CHART_SHELL_SHOWCASE_LOADING_CODE,
  CHART_SHELL_SHOWCASE_NEXT,
  CHART_SHELL_SHOWCASE_PREV,
  CHART_SHELL_SHOWCASE_SLUG,
  CHART_SHELL_SHOWCASE_STATES_CODE,
  CHART_SHELL_SHOWCASE_TOC_ITEMS,
  CHART_SHELL_SHOWCASE_VIEWS_CODE,
  CHART_SHELL_TRANSLATION_PREFIX,
} from '../model/chart-shell-showcase.data';
import {
  PROP_ROWS,
  type ChartShellPropRow,
} from '../model/chart-shell-showcase-props.data';

import {
  PERIOD_DATASETS,
  PERIOD_INTERVAL_KEYS,
  SERIES_LABEL_KEYS,
} from '../model/chart-shell-showcase-examples.data';

@Component({
  standalone: true,
  imports: [
    NgTemplateOutlet,
    SolarisBarChartComponent,
    SolarisButtonDirective,
    SolarisChartShellComponent,
    SolarisHeatmapComponent,
    SolarisLineChartComponent,
    SolarisPieChartComponent,
    SolarisPreviewCodeComponent,
    SolarisRadarComponent,
    SolarisCodeBlockComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTableComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
  ],
  templateUrl: './chart-shell-showcase.html',
  styleUrls: ['./chart-shell-showcase.scss'],
})
export class ChartShellShowcasePage implements OnDestroy {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);
  private readonly dialogService = inject(SolarisDialogService);
  private readonly leaveTimers = new Map<
    string,
    ReturnType<typeof setTimeout>
  >();

  ngOnDestroy(): void {
    for (const timer of this.leaveTimers.values()) clearTimeout(timer);
    this.leaveTimers.clear();
  }

  protected readonly breadcrumbs = CHART_SHELL_SHOWCASE_BREADCRUMBS;
  protected readonly prev = CHART_SHELL_SHOWCASE_PREV;
  protected readonly next = CHART_SHELL_SHOWCASE_NEXT;
  protected readonly tocItems = CHART_SHELL_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = ['pnpm add @solaris-ui/angular'];
  protected readonly importCode = CHART_SHELL_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = CHART_SHELL_SHOWCASE_BASIC_CODE;
  protected readonly viewsCode = CHART_SHELL_SHOWCASE_VIEWS_CODE;
  protected readonly displayCode = CHART_SHELL_SHOWCASE_DISPLAY_CODE;
  protected readonly statesCode = CHART_SHELL_SHOWCASE_STATES_CODE;
  protected readonly loadingCode = CHART_SHELL_SHOWCASE_LOADING_CODE;
  protected readonly errorCode = CHART_SHELL_SHOWCASE_ERROR_CODE;

  protected readonly view = signal<SolarisChartView>('line');
  protected readonly period = signal<SolarisChartPeriod>('week');
  protected readonly displayMode = signal<SolarisChartDisplayMode>('timeline');
  protected readonly viewsTab = signal<SolarisChartView>('line');
  protected readonly displayTab = signal<SolarisChartDisplayMode>('timeline');
  protected readonly stateTab = signal<'empty' | 'loading' | 'error'>('empty');
  protected readonly hiddenIds = signal<readonly string[]>([]);
  protected readonly leavingIds = signal<readonly string[]>([]);
  protected readonly loading = signal(false);
  protected readonly log = signal('');
  protected readonly stateLog = signal('');

  protected readonly selectedSize = signal<SolarisChartShellSize>('md');
  protected readonly selectedDensity =
    signal<SolarisChartShellDensity>('normal');

  protected readonly sizeDensityCode = computed(() =>
    [
      '<solaris-chart-shell',
      '  locale="pt-BR"',
      `  [title]="'chart-shell-view.examples.title' | translate"`,
      '  [series]="series()"',
      `  size="${this.selectedSize()}"`,
      `  density="${this.selectedDensity()}"`,
      '/>',
    ].join('\n'),
  );

  protected readonly dataset = computed(() => PERIOD_DATASETS[this.period()]);

  protected readonly series = computed<readonly SolarisChartSeries[]>(() => {
    const hidden = new Set(this.hiddenIds());
    const dataset = this.dataset();
    return (
      Object.keys(SERIES_LABEL_KEYS) as (keyof typeof SERIES_LABEL_KEYS)[]
    ).map((id) => ({
      id,
      label: this.translateService.translate(SERIES_LABEL_KEYS[id]),
      points: dataset.xs.map((x, index) => ({
        x,
        y: dataset.values[id][index] ?? null,
      })),
      hidden: hidden.has(id) ? true : undefined,
    }));
  });

  protected readonly visibleSeries = computed(() =>
    this.series().filter((entry) => entry.hidden !== true),
  );

  protected readonly heroValue = computed(() => {
    const total = this.visibleSeries().reduce(
      (sum, entry) =>
        sum +
        entry.points.reduce(
          (partial, point) =>
            typeof point.y === 'number' && Number.isFinite(point.y)
              ? partial + point.y
              : partial,
          0,
        ),
      0,
    );
    return this.formatCompact(total);
  });

  protected readonly referenceLines = computed(() => [
    {
      value: this.dataset().reference,
      label: this.translateService.translate(
        'chart-shell-view.examples.lineAverage',
      ),
    },
  ]);

  protected readonly xLabels = computed<readonly string[] | undefined>(
    () => this.dataset().xLabels as readonly string[] | undefined,
  );

  protected readonly tooltipSubtitle = computed(
    () =>
      this.dataset().tooltipSubtitle as string | readonly string[] | undefined,
  );

  protected seriesTotal(entry: SolarisChartSeries): string {
    const total = entry.points.reduce(
      (sum, point) =>
        typeof point.y === 'number' && Number.isFinite(point.y)
          ? sum + point.y
          : sum,
      0,
    );
    return this.formatCompact(total);
  }

  protected readonly stateCode = computed(() => {
    switch (this.stateTab()) {
      case 'loading':
        return this.loadingCode;
      case 'error':
        return this.errorCode;
      default:
        return this.statesCode;
    }
  });

  protected readonly heroDelta = computed(() => {
    const totals = this.seriesTotals();
    const first = totals[0] ?? 0;
    const last = totals.at(-1) ?? 0;
    if (first <= 0) return '+0,0%';
    const ratio = ((last - first) / first) * 100;
    const formatted = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      signDisplay: 'exceptZero',
    }).format(ratio);
    return `${formatted}%`;
  });

  protected readonly heroDeltaDirection = computed<SolarisChartShellTrend>(
    () => {
      const totals = this.seriesTotals();
      const first = totals[0] ?? 0;
      const last = totals.at(-1) ?? 0;
      if (last > first) return 'up';
      if (last < first) return 'down';
      return 'flat';
    },
  );

  private seriesTotals(): readonly number[] {
    const entries = this.visibleSeries();
    const length = Math.max(0, ...entries.map((entry) => entry.points.length));
    return Array.from({ length }, (_, index) =>
      entries.reduce((sum, entry) => {
        const value = entry.points[index]?.y;
        return typeof value === 'number' && Number.isFinite(value)
          ? sum + value
          : sum;
      }, 0),
    );
  }

  private formatCompact(value: number): string {
    return new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(
      value,
    );
  }

  protected readonly stateError = computed(() =>
    this.translateService.translate('chart-shell-view.states.errorMessage'),
  );

  protected readonly intervalLabel = computed(() => {
    const key = PERIOD_INTERVAL_KEYS[this.period()];
    const translated = this.translateService.translate(key);
    return translated !== key ? translated : this.period();
  });

  protected readonly periodOptions = computed(() => {
    const labels: Record<SolarisChartPeriod, string> = {
      day: this.translateService.translate(
        'chart-shell-view.examples.periodLabelDay',
      ),
      week: this.translateService.translate(
        'chart-shell-view.examples.periodLabelWeek',
      ),
      month: this.translateService.translate(
        'chart-shell-view.examples.periodLabelMonth',
      ),
      quarter: this.translateService.translate(
        'chart-shell-view.examples.periodLabelQuarter',
      ),
      year: this.translateService.translate(
        'chart-shell-view.examples.periodLabelYear',
      ),
      all: this.translateService.translate(
        'chart-shell-view.examples.periodLabelAll',
      ),
    };
    return (['day', 'week', 'month', 'quarter', 'year', 'all'] as const).map(
      (value) => ({ value, label: labels[value] }),
    );
  });

  protected readonly combosView = signal<SolarisChartView>('heatmap');

  protected readonly combosViews: readonly SolarisChartShellViewOption[] = [
    { value: 'line' },
    { value: 'bar' },
    { value: 'heatmap' },
    { value: 'radar' },
  ];

  protected readonly combosColumns = computed<readonly string[]>(() =>
    this.dataset().xs.map((x) => String(x)),
  );

  protected readonly heatmapRows = computed<readonly SolarisHeatmapRow[]>(() =>
    this.visibleSeries().map((entry) => ({
      id: entry.id,
      label: entry.label,
      values: entry.points.map((point) => point.y),
    })),
  );

  protected readonly radarAxes = computed<readonly string[]>(() =>
    this.dataset()
      .xs.slice(0, 6)
      .map((x) => String(x)),
  );

  protected readonly radarSeries = computed<readonly SolarisRadarSeries[]>(() =>
    this.visibleSeries().map((entry) => ({
      id: entry.id,
      label: entry.label,
      color: entry.color,
      values: entry.points.slice(0, 6).map((point) => point.y),
    })),
  );

  protected readonly fullscreenDescription = computed(() =>
    this.translateService.translate('chart-shell-view.fullscreen.description'),
  );

  protected readonly combosCode = computed(() =>
    [
      '<solaris-chart-shell',
      '  locale="pt-BR"',
      '  [view]="combosView()"',
      '  [availableViews]="combosViews"',
      '  [series]="series()"',
      '  (viewChange)="combosView.set($event)"',
      '>',
      '  @if (combosView() === "heatmap") {',
      '    <solaris-heatmap [rows]="heatmapRows()" [columns]="combosColumns()" locale="pt-BR" />',
      '  } @else if (combosView() === "radar") {',
      '    <solaris-radar [axes]="radarAxes()" [series]="radarSeries()" locale="pt-BR" />',
      '  }',
      '</solaris-chart-shell>',
    ].join('\n'),
  );

  protected isLeaving(id: string): boolean {
    return this.leavingIds().includes(id);
  }

  protected readonly propsColumns = computed(
    (): readonly SolarisTableColumn<ChartShellPropRow>[] => [
      {
        id: 'prop',
        header: this.translateService.translate(
          'chart-shell-view.props.colProp',
        ),
        accessor: 'prop',
        width: '150px',
      },
      {
        id: 'type',
        header: this.translateService.translate(
          'chart-shell-view.props.colType',
        ),
        accessor: 'type',
      },
      {
        id: 'values',
        header: this.translateService.translate(
          'chart-shell-view.props.colValues',
        ),
        accessor: 'values',
      },
      {
        id: 'default',
        header: this.translateService.translate(
          'chart-shell-view.props.colDefault',
        ),
        accessor: 'default',
        width: '150px',
      },
    ],
  );

  protected readonly propsRows = PROP_ROWS;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: CHART_SHELL_TRANSLATION_PREFIX,
      slug: CHART_SHELL_SHOWCASE_SLUG,
      importCode: CHART_SHELL_SHOWCASE_IMPORT_CODE,
    },
  );

  protected onViewChange(view: SolarisChartView): void {
    this.view.set(view);
    this.log.set(`view:${view}`);
  }

  protected onCombosViewChange(view: SolarisChartView): void {
    this.combosView.set(view);
    this.log.set(`view:${view}`);
  }

  protected onPeriodChange(period: SolarisChartPeriod): void {
    this.period.set(period);
    this.log.set(`period:${period}`);
  }

  protected onSeriesToggle(id: string): void {
    const hidden = this.hiddenIds().includes(id);
    const pending = this.leaveTimers.get(id);
    if (pending !== undefined) {
      clearTimeout(pending);
      this.leaveTimers.delete(id);
    }
    if (hidden) {
      this.leavingIds.update((ids) => ids.filter((entry) => entry !== id));
      this.hiddenIds.update((ids) => ids.filter((entry) => entry !== id));
    } else {
      this.leavingIds.update((ids) => (ids.includes(id) ? ids : [...ids, id]));
      this.leaveTimers.set(
        id,
        setTimeout(() => {
          this.leaveTimers.delete(id);
          this.hiddenIds.update((ids) =>
            ids.includes(id) ? ids : [...ids, id],
          );
          this.leavingIds.update((ids) => ids.filter((entry) => entry !== id));
        }, 300),
      );
    }
    this.log.set(`toggle:${id}`);
  }

  protected onPointSelect(event: SolarisLineChartPointEvent): void {
    this.log.set(`point:${event.seriesId}:${event.index}`);
  }

  protected onBarPointSelect(event: SolarisBarChartPointEvent): void {
    this.onPointSelect(event);
  }

  protected onSliceSelect(id: string): void {
    this.log.set(`slice:${id}`);
  }

  protected onDisplayModeChange(mode: SolarisChartDisplayMode): void {
    this.displayMode.set(mode);
    this.log.set(`display:${mode}`);
  }

  protected onRetry(): void {
    this.stateLog.set('retry');
  }

  protected onActionRequest(action: string): void {
    if (action === 'fullscreen') {
      this.openFullscreenDialog();
      return;
    }
    this.log.set(`action:${action}`);
  }

  private openFullscreenDialog(): void {
    this.log.set('action:fullscreen');
    this.dialogService.openComponent(ChartShellFullscreenDialogComponent, {
      title: this.translateService.translate('chart-shell-view.examples.title'),
      description: this.fullscreenDescription(),
      width: 'min(1120px, calc(100vw - 2rem))',
      data: {
        title: this.translateService.translate(
          'chart-shell-view.examples.title',
        ),
        description: this.fullscreenDescription(),
        intervalLabel: this.intervalLabel(),
        heroValue: this.heroValue(),
        heroLabel: this.translateService.translate(
          'chart-shell-view.examples.heroLabel',
        ),
        heroDelta: this.heroDelta(),
        heroDeltaDirection: this.heroDeltaDirection(),
        series: [...this.visibleSeries()],
        locale: 'pt-BR',
      },
    });
  }

  protected toggleLoading(): void {
    this.loading.update((value) => !value);
  }

  protected copyPageAsMarkdown(): void {
    this.pageActions.copyPageAsMarkdown();
  }

  protected downloadPageAsMarkdown(): void {
    this.pageActions.downloadPageAsMarkdown();
  }

  protected openInChatGpt(): void {
    this.pageActions.openInChatGpt();
  }

  protected openInClaude(): void {
    this.pageActions.openInClaude();
  }
}
