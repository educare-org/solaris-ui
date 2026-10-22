import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  computed,
  inject,
  signal,
} from '@angular/core';

import {
  SolarisBadgeComponent,
  SolarisBadgeIconDirective,
  SolarisBarChartComponent,
  SolarisChartShellComponent,
  SolarisCodeBlockComponent,
  SolarisIconComponent,
  SolarisLineChartComponent,
  SolarisPreviewCodeComponent,
  SolarisSparklineComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisBarChartPointEvent,
  type SolarisChartDisplayMode,
  type SolarisChartPeriod,
  type SolarisChartSeries,
  type SolarisChartShellTrend,
  type SolarisChartView,
  type SolarisLineChartPointEvent,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../../shared/showcase-page-utils';
import {
  CHART_SHELL_SHOWCASE_BASIC_CODE,
  CHART_SHELL_SHOWCASE_BREADCRUMBS,
  CHART_SHELL_SHOWCASE_IMPORT_CODE,
  CHART_SHELL_SHOWCASE_NEXT,
  CHART_SHELL_SHOWCASE_PREV,
  CHART_SHELL_SHOWCASE_SLUG,
  CHART_SHELL_SHOWCASE_TOC_ITEMS,
  CHART_SHELL_TRANSLATION_PREFIX,
} from '../model/chart-shell-showcase.data';

const WEEK_POINTS: Readonly<
  Record<string, readonly { x: number; y: number }[]>
> = {
  automation: [
    { x: 28, y: 180 },
    { x: 29, y: 210 },
    { x: 30, y: 150 },
    { x: 1, y: 190 },
    { x: 2, y: 205 },
    { x: 3, y: 175 },
    { x: 4, y: 220 },
  ],
  queries: [
    { x: 28, y: 60 },
    { x: 29, y: 90 },
    { x: 30, y: 120 },
    { x: 1, y: 80 },
    { x: 2, y: 95 },
    { x: 3, y: 70 },
    { x: 4, y: 110 },
  ],
  system: [
    { x: 28, y: 40 },
    { x: 29, y: 45 },
    { x: 30, y: 50 },
    { x: 1, y: 42 },
    { x: 2, y: 48 },
    { x: 3, y: 44 },
    { x: 4, y: 52 },
  ],
};

const WEEK_SUBTITLES: readonly string[] = [
  '28 de abr. de 2026',
  '29 de abr. de 2026',
  '30 de abr. de 2026',
  '1 de mai. de 2026',
  '2 de mai. de 2026',
  '3 de mai. de 2026',
  '4 de mai. de 2026',
];

function buildMonthValues(
  base: number,
  step: number,
  wobble: number,
  days = 30,
): readonly number[] {
  return Array.from({ length: days }, (_, index) =>
    Math.round(
      base +
        step * index +
        wobble * Math.sin(index * 1.7) +
        wobble * 0.4 * Math.cos(index * 0.6),
    ),
  );
}

const MONTH_VALUES = {
  automation: buildMonthValues(820, 36, 90),
  queries: buildMonthValues(410, 17, 45),
  system: buildMonthValues(180, 8, 20),
} as const;

const MONTH_SUBTITLES: readonly string[] = Array.from(
  { length: 30 },
  (_, index) => `${index + 1} de abr. de 2026`,
);

interface ChartShellPeriodDataset {
  readonly xs: readonly (string | number)[];
  readonly xLabels?: readonly string[];
  readonly tooltipSubtitle?: string | readonly string[];
  readonly values: Readonly<
    Record<'automation' | 'queries' | 'system', readonly number[]>
  >;
  readonly reference: number;
}

const PERIOD_DATASETS: Readonly<
  Record<SolarisChartPeriod, ChartShellPeriodDataset>
> = {
  '1D': {
    xs: ['8h', '10h', '12h', '14h', '16h', '18h'],
    tooltipSubtitle: '4 de mai. de 2026',
    values: {
      automation: [38, 52, 47, 61, 55, 68],
      queries: [15, 22, 18, 26, 21, 29],
      system: [7, 9, 8, 11, 10, 12],
    },
    reference: 40,
  },
  '7D': {
    xs: [28, 29, 30, 1, 2, 3, 4],
    xLabels: ['28', '29', '30', '01', '02', '03', '04'],
    tooltipSubtitle: WEEK_SUBTITLES,
    values: {
      automation: WEEK_POINTS['automation'].map((point) => point.y),
      queries: WEEK_POINTS['queries'].map((point) => point.y),
      system: WEEK_POINTS['system'].map((point) => point.y),
    },
    reference: 120,
  },
  '1M': {
    xs: Array.from({ length: 30 }, (_, index) => index + 1),
    tooltipSubtitle: MONTH_SUBTITLES,
    values: {
      automation: MONTH_VALUES.automation,
      queries: MONTH_VALUES.queries,
      system: MONTH_VALUES.system,
    },
    reference: 1500,
  },
  '3M': {
    xs: [
      'S1',
      'S2',
      'S3',
      'S4',
      'S5',
      'S6',
      'S7',
      'S8',
      'S9',
      'S10',
      'S11',
      'S12',
    ],
    tooltipSubtitle: 'ago. → out. de 2026',
    values: {
      automation: [
        2100, 2380, 2260, 2510, 2740, 2690, 2930, 3110, 3280, 3440, 3610, 3850,
      ],
      queries: [
        1050, 1190, 1130, 1260, 1370, 1340, 1470, 1560, 1640, 1720, 1810, 1930,
      ],
      system: [380, 430, 410, 460, 500, 490, 540, 570, 600, 630, 660, 720],
    },
    reference: 3200,
  },
  YTD: {
    xs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    tooltipSubtitle: 'jan. → out. de 2026',
    xLabels: [
      'jan',
      'fev',
      'mar',
      'abr',
      'mai',
      'jun',
      'jul',
      'ago',
      'set',
      'out',
    ],
    values: {
      automation: [
        9200, 10400, 11800, 11200, 13100, 14500, 15900, 15200, 17100, 18600,
      ],
      queries: [4600, 5200, 5900, 5600, 6550, 7250, 7950, 7600, 8550, 9300],
      system: [1650, 1860, 2100, 2000, 2340, 2590, 2830, 2710, 3050, 3320],
    },
    reference: 14000,
  },
  all: {
    xs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    tooltipSubtitle: '2026',
    xLabels: [
      'jan',
      'fev',
      'mar',
      'abr',
      'mai',
      'jun',
      'jul',
      'ago',
      'set',
      'out',
      'nov',
      'dez',
    ],
    values: {
      automation: [
        8800, 9600, 11200, 12400, 13900, 15200, 16800, 18100, 19700, 21300,
        23100, 25400,
      ],
      queries: [
        4400, 4800, 5600, 6200, 6950, 7600, 8400, 9050, 9850, 10650, 11550,
        12700,
      ],
      system: [
        1580, 1730, 2010, 2230, 2500, 2730, 3020, 3260, 3540, 3830, 4140, 4570,
      ],
    },
    reference: 19000,
  },
};

const SERIES_LABEL_KEYS = {
  automation: 'chart-shell-view.examples.seriesAutomation',
  queries: 'chart-shell-view.examples.seriesQueries',
  system: 'chart-shell-view.examples.seriesSystem',
} as const;

const PERIOD_INTERVAL_KEYS: Readonly<Record<SolarisChartPeriod, string>> = {
  '1D': 'chart-shell-view.examples.interval1D',
  '7D': 'chart-shell-view.examples.interval7D',
  '1M': 'chart-shell-view.examples.interval1M',
  '3M': 'chart-shell-view.examples.interval3M',
  YTD: 'chart-shell-view.examples.intervalYTD',
  all: 'chart-shell-view.examples.intervalAll',
};

@Component({
  standalone: true,
  imports: [
    NgTemplateOutlet,
    SolarisBadgeComponent,
    SolarisBadgeIconDirective,
    SolarisBarChartComponent,
    SolarisChartShellComponent,
    SolarisIconComponent,
    SolarisLineChartComponent,
    SolarisSparklineComponent,
    SolarisCodeBlockComponent,
    SolarisPreviewCodeComponent,
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
  private readonly elementRef = inject(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly leaveTimers = new Map<
    string,
    ReturnType<typeof setTimeout>
  >();

  ngOnDestroy(): void {
    for (const timer of this.leaveTimers.values()) clearTimeout(timer);
    this.leaveTimers.clear();
    this.document.body.style.overflow = '';
  }

  protected readonly breadcrumbs = CHART_SHELL_SHOWCASE_BREADCRUMBS;
  protected readonly prev = CHART_SHELL_SHOWCASE_PREV;
  protected readonly next = CHART_SHELL_SHOWCASE_NEXT;
  protected readonly tocItems = CHART_SHELL_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = ['pnpm add @solaris-ui/angular'];
  protected readonly importCode = CHART_SHELL_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = CHART_SHELL_SHOWCASE_BASIC_CODE;

  protected readonly view = signal<SolarisChartView>('line');
  protected readonly period = signal<SolarisChartPeriod>('7D');
  protected readonly displayMode = signal<SolarisChartDisplayMode>('timeline');
  protected readonly hiddenIds = signal<readonly string[]>([]);
  // Linhas em saída animada: continuam na tabela até o fade terminar.
  protected readonly leavingIds = signal<readonly string[]>([]);
  protected readonly loading = signal(false);
  protected readonly fullscreenOpen = signal(false);
  protected readonly log = signal('');

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

  protected readonly isWeeklyWindow = computed(
    () => this.period() === '7D' || this.period() === '1D',
  );

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

  protected readonly usersSpark = computed<readonly number[]>(() =>
    this.isWeeklyWindow()
      ? [820, 940, 880, 1010, 990, 1120, 1240]
      : [820, 940, 1010, 990, 1120, 1240, 1310, 1290, 1420, 1560, 1680, 1839],
  );

  protected readonly churnSpark = computed<readonly number[]>(() =>
    this.isWeeklyWindow()
      ? [22, 21, 23, 20, 19, 18, 17]
      : [32, 30, 29, 31, 27, 26, 25, 24, 23, 22, 21, 19],
  );

  protected readonly usersValue = computed(() =>
    this.formatCompact(this.usersSpark()[this.usersSpark().length - 1] ?? 0),
  );

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

  protected readonly churnValue = computed(() =>
    this.formatCompact(this.churnSpark()[this.churnSpark().length - 1] ?? 0),
  );

  private formatCompact(value: number): string {
    return new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(
      value,
    );
  }

  protected readonly intervalLabel = computed(() => {
    const key = PERIOD_INTERVAL_KEYS[this.period()];
    const translated = this.translateService.translate(key);
    return translated !== key ? translated : this.period();
  });

  // Rótulos "naturais" por período — o consumidor configura como quiser via
  // `availablePeriods` (rótulo, valores extras, desabilitados).
  // `all` é minúsculo no tipo, mas as chaves usam `All` maiúsculo.
  protected readonly periodOptions = computed(() =>
    (['1D', '7D', '1M', '3M', 'YTD', 'all'] as const).map((value) => ({
      value,
      label: this.translateService.translate(
        `chart-shell-view.examples.periodLabel${value === 'all' ? 'All' : value}`,
      ),
    })),
  );

  protected isLeaving(id: string): boolean {
    return this.leavingIds().includes(id);
  }

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
      // Volta imediata: cancela a saída e reexibe (com animação de entrada).
      this.leavingIds.update((ids) => ids.filter((entry) => entry !== id));
      this.hiddenIds.update((ids) => ids.filter((entry) => entry !== id));
    } else {
      // Saída fluida: mantém a linha visível por 220ms e só então oculta.
      this.leavingIds.update((ids) => (ids.includes(id) ? ids : [...ids, id]));
      this.leaveTimers.set(
        id,
        setTimeout(() => {
          this.leaveTimers.delete(id);
          this.hiddenIds.update((ids) =>
            ids.includes(id) ? ids : [...ids, id],
          );
          this.leavingIds.update((ids) => ids.filter((entry) => entry !== id));
        }, 220),
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

  protected onDisplayModeChange(mode: SolarisChartDisplayMode): void {
    this.displayMode.set(mode);
    this.log.set(`display:${mode}`);
  }

  protected onActionRequest(action: string): void {
    if (action === 'fullscreen') {
      if (this.fullscreenOpen()) {
        this.closeFullscreen();
      } else {
        this.openFullscreen();
      }
      return;
    }
    this.log.set(`action:${action}`);
  }

  private openFullscreen(): void {
    this.fullscreenOpen.set(true);
    this.log.set('action:fullscreen');
    this.document.body.style.overflow = 'hidden';
    if (typeof window === 'undefined') return;
    window.setTimeout(() => {
      const host = this.elementRef.nativeElement as HTMLElement;
      host
        .querySelector<HTMLElement>('.chart-shell-showcase__fullscreen-close')
        ?.focus();
    }, 0);
  }

  protected closeFullscreen(): void {
    this.fullscreenOpen.set(false);
    this.document.body.style.overflow = '';
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
