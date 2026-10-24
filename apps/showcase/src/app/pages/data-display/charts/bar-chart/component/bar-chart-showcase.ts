import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisBarChartComponent,
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTableComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisBarChartDensity,
  type SolarisBarChartLayout,
  type SolarisBarChartPointEvent,
  type SolarisBarChartSize,
  type SolarisChartSeries,
  type SolarisTableColumn,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../../shared/showcase-page-utils';
import {
  BAR_CHART_SHOWCASE_BASIC_CODE,
  BAR_CHART_SHOWCASE_BREADCRUMBS,
  BAR_CHART_SHOWCASE_DIVERGING_CODE,
  BAR_CHART_SHOWCASE_EMPTY_CODE,
  BAR_CHART_SHOWCASE_HORIZONTAL_CODE,
  BAR_CHART_SHOWCASE_IMPORT_CODE,
  BAR_CHART_SHOWCASE_NEXT,
  BAR_CHART_SHOWCASE_PREV,
  BAR_CHART_SHOWCASE_SLUG,
  BAR_CHART_SHOWCASE_TOC_ITEMS,
  BAR_CHART_SHOWCASE_VALUES_CODE,
  BAR_CHART_TRANSLATION_PREFIX,
} from '../model/bar-chart-showcase.data';

const WEEK_DAY_IDS: readonly string[] = [
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sun',
];

const WEEK_VALUES: Readonly<
  Record<'automation' | 'queries' | 'system', readonly number[]>
> = {
  automation: [180, 210, 150, 190, 205, 175, 220],
  queries: [60, 90, 120, 80, 95, 70, 110],
  system: [40, 45, 50, 42, 48, 44, 52],
};

const SERIES_LABEL_KEYS = {
  automation: 'bar-chart-view.examples.seriesAutomation',
  queries: 'bar-chart-view.examples.seriesQueries',
  system: 'bar-chart-view.examples.seriesSystem',
} as const;

const DIVERGING_VALUES: Readonly<
  Record<'income' | 'expenses', readonly number[]>
> = {
  income: [180, 210, 150, 190, 205, 175, 220],
  expenses: [-60, -90, -120, -80, -95, -70, -110],
};

const DIVERGING_LABEL_KEYS = {
  income: 'bar-chart-view.examples.seriesIncome',
  expenses: 'bar-chart-view.examples.seriesExpenses',
} as const;

interface BarChartPropRow {
  readonly prop: string;
  readonly type: string;
  readonly values: string;
  readonly default: string;
}

const PROP_ROWS: readonly BarChartPropRow[] = [
  {
    prop: 'series',
    type: 'SolarisChartSeries[]',
    values: '—',
    default: 'required',
  },
  { prop: 'locale', type: 'string', values: 'BCP-47', default: 'required' },
  {
    prop: 'orientation',
    type: 'SolarisBarChartOrientation',
    values: 'vertical | horizontal',
    default: 'vertical',
  },
  {
    prop: 'layout',
    type: 'SolarisBarChartLayout',
    values: 'grouped | stacked | stacked-100',
    default: 'grouped',
  },
  {
    prop: 'barRadius',
    type: 'number',
    values: 'px ≥ 0',
    default: 'token radius-sm',
  },
  {
    prop: 'referenceLines',
    type: 'SolarisChartReferenceLine[]',
    values: '—',
    default: '[]',
  },
  {
    prop: 'xLabels',
    type: 'string[]',
    values: '—',
    default: 'point label ?? x',
  },
  {
    prop: 'valueFormat',
    type: '(value: number) => string',
    values: '—',
    default: 'compact Intl',
  },
  {
    prop: 'showValues',
    type: 'boolean',
    values: 'true | false',
    default: 'false',
  },
  {
    prop: 'size',
    type: 'SolarisBarChartSize',
    values: 'sm | md | lg',
    default: 'md',
  },
  {
    prop: 'density',
    type: 'SolarisBarChartDensity',
    values: 'compact | normal | comfortable',
    default: 'theme',
  },
  {
    prop: 'ariaLabel | ariaLabelKey',
    type: 'string',
    values: '—',
    default: 'synthesized summary',
  },
];

@Component({
  standalone: true,
  imports: [
    NgTemplateOutlet,
    SolarisBarChartComponent,
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
  templateUrl: './bar-chart-showcase.html',
  styleUrls: ['./bar-chart-showcase.scss'],
})
export class BarChartShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = BAR_CHART_SHOWCASE_BREADCRUMBS;
  protected readonly prev = BAR_CHART_SHOWCASE_PREV;
  protected readonly next = BAR_CHART_SHOWCASE_NEXT;
  protected readonly tocItems = BAR_CHART_SHOWCASE_TOC_ITEMS;
  protected readonly installCommands = ['pnpm add @solaris-ui/angular'];
  protected readonly importCode = BAR_CHART_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = BAR_CHART_SHOWCASE_BASIC_CODE;
  protected readonly horizontalCode = BAR_CHART_SHOWCASE_HORIZONTAL_CODE;
  protected readonly valuesCode = BAR_CHART_SHOWCASE_VALUES_CODE;
  protected readonly divergingCode = BAR_CHART_SHOWCASE_DIVERGING_CODE;
  protected readonly emptyCode = BAR_CHART_SHOWCASE_EMPTY_CODE;
  protected readonly layout = signal<SolarisBarChartLayout>('grouped');
  protected readonly log = signal('');

  protected readonly selectedSize = signal<SolarisBarChartSize>('md');
  protected readonly selectedDensity = signal<SolarisBarChartDensity>('normal');

  protected readonly sizeDensityCode = computed(() =>
    [
      '<solaris-bar-chart',
      '  [locale]="chartLocale()"',
      '  [series]="series()"',
      '  layout="grouped"',
      `  size="${this.selectedSize()}"`,
      `  density="${this.selectedDensity()}"`,
      '/>',
    ].join('\n'),
  );

  protected readonly chartLocale = computed(() =>
    this.translateService.locale(),
  );

  protected readonly dayLabels = computed<readonly string[]>(() =>
    WEEK_DAY_IDS.map((id) =>
      this.translateService.translate(`bar-chart-view.examples.days.${id}`),
    ),
  );

  protected readonly series = computed<readonly SolarisChartSeries[]>(() =>
    (Object.keys(SERIES_LABEL_KEYS) as (keyof typeof SERIES_LABEL_KEYS)[]).map(
      (id) => ({
        id,
        label: this.translateService.translate(SERIES_LABEL_KEYS[id]),
        points: this.dayLabels().map((label, index) => ({
          x: label,
          y: WEEK_VALUES[id][index] ?? null,
        })),
      }),
    ),
  );

  protected readonly referenceLines = computed(() => [
    {
      value: 120,
      label: this.translateService.translate('bar-chart-view.examples.average'),
    },
  ]);

  protected readonly divergingSeries = computed<readonly SolarisChartSeries[]>(
    () =>
      (
        Object.keys(
          DIVERGING_LABEL_KEYS,
        ) as (keyof typeof DIVERGING_LABEL_KEYS)[]
      ).map((id) => ({
        id,
        label: this.translateService.translate(DIVERGING_LABEL_KEYS[id]),
        points: this.dayLabels().map((label, index) => ({
          x: label,
          y: DIVERGING_VALUES[id][index] ?? null,
        })),
      })),
  );

  protected readonly propsColumns = computed(
    (): readonly SolarisTableColumn<BarChartPropRow>[] => [
      {
        id: 'prop',
        header: this.translateService.translate('bar-chart-view.props.colProp'),
        accessor: 'prop',
        width: '150px',
      },
      {
        id: 'type',
        header: this.translateService.translate('bar-chart-view.props.colType'),
        accessor: 'type',
      },
      {
        id: 'values',
        header: this.translateService.translate(
          'bar-chart-view.props.colValues',
        ),
        accessor: 'values',
      },
      {
        id: 'default',
        header: this.translateService.translate(
          'bar-chart-view.props.colDefault',
        ),
        accessor: 'default',
        width: '110px',
      },
    ],
  );

  protected readonly propsRows = PROP_ROWS;

  protected onPointSelect(event: SolarisBarChartPointEvent): void {
    this.log.set(`bar-point:${event.seriesId}:${event.index}`);
  }

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: BAR_CHART_TRANSLATION_PREFIX,
      slug: BAR_CHART_SHOWCASE_SLUG,
      importCode: BAR_CHART_SHOWCASE_IMPORT_CODE,
    },
  );

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
