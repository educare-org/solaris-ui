import { DOCUMENT } from '@angular/common';
import { Component, computed, inject } from '@angular/core';

import {
  SolarisBadgeComponent,
  SolarisBarChartComponent,
  SolarisCardComponent,
  SolarisCardContentDirective,
  SolarisCardDescriptionDirective,
  SolarisCardHeaderDirective,
  SolarisCardTitleDirective,
  SolarisCodeBlockComponent,
  SolarisLineChartComponent,
  SolarisPreviewCodeComponent,
  SolarisSparklineComponent,
  SolarisTableComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisChartSeries,
  type SolarisTableColumn,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../../shared/showcase-page-utils';
import {
  CHART_CARDS_SHOWCASE_BREADCRUMBS,
  CHART_CARDS_SHOWCASE_CHANNELS_CODE,
  CHART_CARDS_SHOWCASE_IMPORT_CODE,
  CHART_CARDS_SHOWCASE_NEXT,
  CHART_CARDS_SHOWCASE_PREV,
  CHART_CARDS_SHOWCASE_REVENUE_CODE,
  CHART_CARDS_SHOWCASE_SLUG,
  CHART_CARDS_SHOWCASE_TARGET_CODE,
  CHART_CARDS_SHOWCASE_TOC_ITEMS,
  CHART_CARDS_TRANSLATION_PREFIX,
} from '../model/cards-showcase.data';
import {
  PROP_ROWS,
  type ChartCardPropRow,
} from '../model/cards-showcase-props.data';

const REVENUE_SPARK: readonly number[] = [820, 940, 880, 1010, 990, 1120, 1240];

const CHANNEL_MONTHS: readonly string[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
];

const CHANNEL_VALUES = {
  online: [42, 51, 48, 63, 58, 71],
  retail: [28, 33, 31, 38, 36, 44],
  partners: [15, 18, 17, 22, 21, 26],
} as const;

const TARGET_ACTUAL = [
  88, 96, 112, 124, 139, 152, 168, 181, 197, 213, 231, 254,
];

@Component({
  standalone: true,
  imports: [
    SolarisBadgeComponent,
    SolarisBarChartComponent,
    SolarisCardComponent,
    SolarisCardContentDirective,
    SolarisCardDescriptionDirective,
    SolarisCardHeaderDirective,
    SolarisCardTitleDirective,
    SolarisCodeBlockComponent,
    SolarisLineChartComponent,
    SolarisPreviewCodeComponent,
    SolarisSparklineComponent,
    SolarisTableComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
  ],
  templateUrl: './cards-showcase.html',
  styleUrls: ['./cards-showcase.scss'],
})
export class ChartCardsShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = CHART_CARDS_SHOWCASE_BREADCRUMBS;
  protected readonly prev = CHART_CARDS_SHOWCASE_PREV;
  protected readonly next = CHART_CARDS_SHOWCASE_NEXT;
  protected readonly tocItems = CHART_CARDS_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = ['pnpm add @solaris-ui/angular'];
  protected readonly importCode = CHART_CARDS_SHOWCASE_IMPORT_CODE;
  protected readonly revenueCode = CHART_CARDS_SHOWCASE_REVENUE_CODE;
  protected readonly channelsCode = CHART_CARDS_SHOWCASE_CHANNELS_CODE;
  protected readonly targetCode = CHART_CARDS_SHOWCASE_TARGET_CODE;

  protected readonly revenueSpark = REVENUE_SPARK;

  protected readonly channelSeries = computed<readonly SolarisChartSeries[]>(
    () => [
      {
        id: 'online',
        label: this.translateService.translate(
          'chart-cards-view.recipes.channelOnline',
        ),
        points: CHANNEL_MONTHS.map((month, index) => ({
          x: month,
          y: CHANNEL_VALUES.online[index] ?? null,
        })),
      },
      {
        id: 'retail',
        label: this.translateService.translate(
          'chart-cards-view.recipes.channelRetail',
        ),
        color: 'accent',
        points: CHANNEL_MONTHS.map((month, index) => ({
          x: month,
          y: CHANNEL_VALUES.retail[index] ?? null,
        })),
      },
      {
        id: 'partners',
        label: this.translateService.translate(
          'chart-cards-view.recipes.channelPartners',
        ),
        color: 'success',
        points: CHANNEL_MONTHS.map((month, index) => ({
          x: month,
          y: CHANNEL_VALUES.partners[index] ?? null,
        })),
      },
    ],
  );

  protected readonly channelTotals = computed(() =>
    this.channelSeries().map((entry) => ({
      id: entry.id,
      label: entry.label,
      total: entry.points.reduce(
        (sum, point) =>
          typeof point.y === 'number' && Number.isFinite(point.y)
            ? sum + point.y
            : sum,
        0,
      ),
    })),
  );

  protected readonly targetSeries = computed<readonly SolarisChartSeries[]>(
    () => [
      {
        id: 'actual',
        label: this.translateService.translate(
          'chart-cards-view.recipes.seriesActual',
        ),
        points: TARGET_ACTUAL.map((value, index) => ({
          x: index + 1,
          y: value,
        })),
      },
    ],
  );

  protected readonly targetReference = [{ value: 200, label: 'Goal' }];

  protected readonly propsColumns = computed(
    (): readonly SolarisTableColumn<ChartCardPropRow>[] => [
      {
        id: 'prop',
        header: this.translateService.translate(
          'chart-cards-view.props.colProp',
        ),
        accessor: 'prop',
        width: '200px',
      },
      {
        id: 'type',
        header: this.translateService.translate(
          'chart-cards-view.props.colType',
        ),
        accessor: 'type',
      },
      {
        id: 'values',
        header: this.translateService.translate(
          'chart-cards-view.props.colValues',
        ),
        accessor: 'values',
      },
      {
        id: 'default',
        header: this.translateService.translate(
          'chart-cards-view.props.colDefault',
        ),
        accessor: 'default',
        width: '200px',
      },
    ],
  );

  protected readonly propsRows = PROP_ROWS;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: CHART_CARDS_TRANSLATION_PREFIX,
      slug: CHART_CARDS_SHOWCASE_SLUG,
      importCode: CHART_CARDS_SHOWCASE_IMPORT_CODE,
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
