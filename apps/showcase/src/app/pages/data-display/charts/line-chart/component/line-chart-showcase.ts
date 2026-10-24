import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisCodeBlockComponent,
  SolarisLineChartComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTableComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisChartSeries,
  type SolarisLineChartDensity,
  type SolarisLineChartPointEvent,
  type SolarisLineChartSize,
  type SolarisTableColumn,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../../shared/showcase-page-utils';
import {
  LINE_CHART_SHOWCASE_BASIC_CODE,
  LINE_CHART_SHOWCASE_BREADCRUMBS,
  LINE_CHART_SHOWCASE_GAPS_CODE,
  LINE_CHART_SHOWCASE_IMPORT_CODE,
  LINE_CHART_SHOWCASE_INTERPOLATION_CODE,
  LINE_CHART_SHOWCASE_NEXT,
  LINE_CHART_SHOWCASE_PREV,
  LINE_CHART_SHOWCASE_SLUG,
  LINE_CHART_SHOWCASE_TOC_ITEMS,
  LINE_CHART_TRANSLATION_PREFIX,
} from '../model/line-chart-showcase.data';

const WEEK_XS: readonly string[] = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
];

const WEEK_VALUES: Readonly<
  Record<'automation' | 'queries', readonly number[]>
> = {
  automation: [180, 210, 150, 190, 205, 175, 220],
  queries: [60, 90, 120, 80, 95, 70, 110],
};

const SERIES_LABEL_KEYS = {
  automation: 'line-chart-view.examples.seriesAutomation',
  queries: 'line-chart-view.examples.seriesQueries',
} as const;

interface LineChartPropRow {
  readonly prop: string;
  readonly type: string;
  readonly values: string;
  readonly default: string;
}

const PROP_ROWS: readonly LineChartPropRow[] = [
  {
    prop: 'series',
    type: 'SolarisChartSeries[]',
    values: '—',
    default: 'required',
  },
  { prop: 'locale', type: 'string', values: 'BCP-47', default: 'required' },
  {
    prop: 'interpolation',
    type: 'SolarisChartInterpolation',
    values: 'smooth | linear',
    default: 'smooth',
  },
  { prop: 'step', type: 'boolean', values: '—', default: 'false' },
  { prop: 'area', type: 'boolean', values: '—', default: 'true' },
  { prop: 'showDots', type: 'boolean', values: '—', default: 'true' },
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
    prop: 'tooltipSubtitle',
    type: 'string | string[]',
    values: '—',
    default: 'undefined',
  },
  {
    prop: 'yFormat',
    type: '(value: number) => string',
    values: '—',
    default: 'compact Intl',
  },
  {
    prop: 'size',
    type: 'SolarisLineChartSize',
    values: 'sm | md | lg',
    default: 'md',
  },
  {
    prop: 'density',
    type: 'SolarisLineChartDensity',
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
    SolarisCodeBlockComponent,
    SolarisLineChartComponent,
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
  templateUrl: './line-chart-showcase.html',
  styleUrls: ['./line-chart-showcase.scss'],
})
export class LineChartShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = LINE_CHART_SHOWCASE_BREADCRUMBS;
  protected readonly prev = LINE_CHART_SHOWCASE_PREV;
  protected readonly next = LINE_CHART_SHOWCASE_NEXT;
  protected readonly tocItems = LINE_CHART_SHOWCASE_TOC_ITEMS;
  protected readonly installCommands = ['pnpm add @solaris-ui/angular'];
  protected readonly importCode = LINE_CHART_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = LINE_CHART_SHOWCASE_BASIC_CODE;
  protected readonly interpolationCode = LINE_CHART_SHOWCASE_INTERPOLATION_CODE;
  protected readonly gapsCode = LINE_CHART_SHOWCASE_GAPS_CODE;
  protected readonly log = signal('');
  protected readonly interpolationTab = signal<'smooth' | 'linear' | 'step'>(
    'smooth',
  );
  protected readonly interpolation = computed<'smooth' | 'linear'>(() =>
    this.interpolationTab() === 'linear' ? 'linear' : 'smooth',
  );
  protected readonly step = computed(() => this.interpolationTab() === 'step');

  protected readonly selectedSize = signal<SolarisLineChartSize>('md');
  protected readonly selectedDensity =
    signal<SolarisLineChartDensity>('normal');

  protected readonly sizeDensityCode = computed(() =>
    [
      '<solaris-line-chart',
      '  locale="pt-BR"',
      '  [series]="series()"',
      `  size="${this.selectedSize()}"`,
      `  density="${this.selectedDensity()}"`,
      '/>',
    ].join('\n'),
  );

  protected readonly series = computed<readonly SolarisChartSeries[]>(() =>
    (Object.keys(SERIES_LABEL_KEYS) as (keyof typeof SERIES_LABEL_KEYS)[]).map(
      (id) => ({
        id,
        label: this.translateService.translate(SERIES_LABEL_KEYS[id]),
        points: WEEK_XS.map((x, index) => ({
          x,
          y: WEEK_VALUES[id][index] ?? null,
        })),
      }),
    ),
  );

  protected readonly referenceLines = computed(() => [
    {
      value: 120,
      label: this.translateService.translate(
        'line-chart-view.examples.average',
      ),
    },
  ]);

  protected readonly gapSeries = computed<readonly SolarisChartSeries[]>(() =>
    (Object.keys(SERIES_LABEL_KEYS) as (keyof typeof SERIES_LABEL_KEYS)[]).map(
      (id) => ({
        id,
        label: this.translateService.translate(SERIES_LABEL_KEYS[id]),
        points: WEEK_XS.map((x, index) => ({
          x,
          y:
            index === 2 || index === 5
              ? null
              : (WEEK_VALUES[id][index] ?? null),
        })),
      }),
    ),
  );

  protected readonly propsColumns = computed(
    (): readonly SolarisTableColumn<LineChartPropRow>[] => [
      {
        id: 'prop',
        header: this.translateService.translate(
          'line-chart-view.props.colProp',
        ),
        accessor: 'prop',
        width: '150px',
      },
      {
        id: 'type',
        header: this.translateService.translate(
          'line-chart-view.props.colType',
        ),
        accessor: 'type',
      },
      {
        id: 'values',
        header: this.translateService.translate(
          'line-chart-view.props.colValues',
        ),
        accessor: 'values',
      },
      {
        id: 'default',
        header: this.translateService.translate(
          'line-chart-view.props.colDefault',
        ),
        accessor: 'default',
        width: '110px',
      },
    ],
  );

  protected readonly propsRows = PROP_ROWS;

  protected onPointSelect(event: SolarisLineChartPointEvent): void {
    this.log.set(`point:${event.seriesId}:${event.index}`);
  }

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: LINE_CHART_TRANSLATION_PREFIX,
      slug: LINE_CHART_SHOWCASE_SLUG,
      importCode: LINE_CHART_SHOWCASE_IMPORT_CODE,
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
