import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisBadgeComponent,
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisSparklineComponent,
  SolarisTabComponent,
  SolarisTableComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisSparklineDensity,
  type SolarisSparklineSize,
  type SolarisTableColumn,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../../shared/showcase-page-utils';
import {
  SPARKLINE_SHOWCASE_BASIC_CODE,
  SPARKLINE_SHOWCASE_BREADCRUMBS,
  SPARKLINE_SHOWCASE_CARD_CODE,
  SPARKLINE_SHOWCASE_EMPTY_CODE,
  SPARKLINE_SHOWCASE_GAPS_CODE,
  SPARKLINE_SHOWCASE_IMPORT_CODE,
  SPARKLINE_SHOWCASE_KPI_CODE,
  SPARKLINE_SHOWCASE_NEXT,
  SPARKLINE_SHOWCASE_PREV,
  SPARKLINE_SHOWCASE_SLUG,
  SPARKLINE_SHOWCASE_TOC_ITEMS,
  SPARKLINE_TRANSLATION_PREFIX,
} from '../model/sparkline-showcase.data';
import {
  PROP_ROWS,
  type SparklinePropRow,
} from '../model/sparkline-showcase-props.data';

@Component({
  standalone: true,
  imports: [
    SolarisBadgeComponent,
    SolarisCodeBlockComponent,
    SolarisPreviewCodeComponent,
    SolarisSparklineComponent,
    SolarisTabComponent,
    SolarisTableComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
  ],
  templateUrl: './sparkline-showcase.html',
  styleUrls: ['./sparkline-showcase.scss'],
})
export class SparklineShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = SPARKLINE_SHOWCASE_BREADCRUMBS;
  protected readonly prev = SPARKLINE_SHOWCASE_PREV;
  protected readonly next = SPARKLINE_SHOWCASE_NEXT;
  protected readonly tocItems = SPARKLINE_SHOWCASE_TOC_ITEMS;
  protected readonly installCommands = ['pnpm add @solaris-ui/angular'];
  protected readonly importCode = SPARKLINE_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = SPARKLINE_SHOWCASE_BASIC_CODE;
  protected readonly kpiCode = SPARKLINE_SHOWCASE_KPI_CODE;
  protected readonly cardCode = SPARKLINE_SHOWCASE_CARD_CODE;
  protected readonly gapsCode = SPARKLINE_SHOWCASE_GAPS_CODE;
  protected readonly emptyCode = SPARKLINE_SHOWCASE_EMPTY_CODE;

  protected readonly selectedSize = signal<SolarisSparklineSize>('md');
  protected readonly selectedDensity =
    signal<SolarisSparklineDensity>('normal');

  protected readonly sizeDensityCode = computed(() =>
    [
      '<solaris-sparkline',
      '  appearance="card"',
      '  [points]="usersSpark"',
      '  title="Active users"',
      '  value="12,480"',
      '  delta="+12.4%"',
      `  size="${this.selectedSize()}"`,
      `  density="${this.selectedDensity()}"`,
      '  ariaLabel="Active users trend, rising"',
      '/>',
    ].join('\n'),
  );

  protected readonly risingPoints: readonly number[] = [3, 5, 4, 8, 7, 10];
  protected readonly fallingPoints: readonly number[] = [10, 8, 9, 5, 4, 3];
  protected readonly gapPoints: readonly (number | null | undefined)[] = [
    3,
    null,
    5,
    4,
    undefined,
    8,
  ];
  protected readonly usersSpark: readonly number[] = [
    820, 940, 880, 1010, 990, 1120, 1240,
  ];
  protected readonly churnSpark: readonly number[] = [
    22, 21, 23, 20, 19, 18, 17,
  ];
  protected readonly emptyPoints: readonly number[] = [];

  protected readonly propsColumns = computed(
    (): readonly SolarisTableColumn<SparklinePropRow>[] => [
      {
        id: 'prop',
        header: this.translateService.translate('sparkline-view.props.colProp'),
        accessor: 'prop',
        width: '150px',
      },
      {
        id: 'type',
        header: this.translateService.translate('sparkline-view.props.colType'),
        accessor: 'type',
      },
      {
        id: 'values',
        header: this.translateService.translate(
          'sparkline-view.props.colValues',
        ),
        accessor: 'values',
      },
      {
        id: 'default',
        header: this.translateService.translate(
          'sparkline-view.props.colDefault',
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
      translationPrefix: SPARKLINE_TRANSLATION_PREFIX,
      slug: SPARKLINE_SHOWCASE_SLUG,
      importCode: SPARKLINE_SHOWCASE_IMPORT_CODE,
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
