import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisCodeBlockComponent,
  SolarisPieChartComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTableComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisChartSlice,
  type SolarisPieChartVariant,
  type SolarisTableColumn,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../../shared/showcase-page-utils';
import {
  PIE_CHART_SHOWCASE_BASIC_CODE,
  PIE_CHART_SHOWCASE_BREADCRUMBS,
  PIE_CHART_SHOWCASE_EMPTY_CODE,
  PIE_CHART_SHOWCASE_GAUGE_CODE,
  PIE_CHART_SHOWCASE_IMPORT_CODE,
  PIE_CHART_SHOWCASE_NEXT,
  PIE_CHART_SHOWCASE_PREV,
  PIE_CHART_SHOWCASE_SLUG,
  PIE_CHART_SHOWCASE_TOC_ITEMS,
  PIE_CHART_TRANSLATION_PREFIX,
} from '../model/pie-chart-showcase.data';
import {
  DETAIL_SHARES,
  ENROLLMENT_IDS,
  ENROLLMENT_VALUES,
} from '../model/pie-chart-showcase-examples.data';
import {
  PROP_ROWS,
  type PieChartPropRow,
} from '../model/pie-chart-showcase-props.data';

@Component({
  standalone: true,
  imports: [
    NgTemplateOutlet,
    SolarisCodeBlockComponent,
    SolarisPieChartComponent,
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
  templateUrl: './pie-chart-showcase.html',
  styleUrls: ['./pie-chart-showcase.scss'],
})
export class PieChartShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = PIE_CHART_SHOWCASE_BREADCRUMBS;
  protected readonly prev = PIE_CHART_SHOWCASE_PREV;
  protected readonly next = PIE_CHART_SHOWCASE_NEXT;
  protected readonly tocItems = PIE_CHART_SHOWCASE_TOC_ITEMS;
  protected readonly installCommands = ['pnpm add @solaris-ui/angular'];
  protected readonly importCode = PIE_CHART_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = PIE_CHART_SHOWCASE_BASIC_CODE;
  protected readonly gaugeCode = PIE_CHART_SHOWCASE_GAUGE_CODE;
  protected readonly emptyCode = PIE_CHART_SHOWCASE_EMPTY_CODE;
  protected readonly variant = signal<SolarisPieChartVariant>('donut');
  protected readonly log = signal('');
  protected readonly selectedSlice = signal<string | null>(null);

  protected readonly chartLocale = computed(() =>
    this.translateService.locale(),
  );

  private sliceLabel(id: (typeof ENROLLMENT_IDS)[number]): string {
    return this.translateService.translate(
      `pie-chart-view.examples.series${id[0].toUpperCase()}${id.slice(1)}`,
    );
  }

  protected readonly slices = computed<readonly SolarisChartSlice[]>(() =>
    ENROLLMENT_IDS.slice(0, 4).map((id) => ({
      id,
      label: this.sliceLabel(id),
      value: ENROLLMENT_VALUES[id],
    })),
  );

  protected readonly groupedSlices = computed<readonly SolarisChartSlice[]>(
    () =>
      ENROLLMENT_IDS.map((id) => ({
        id,
        label: this.sliceLabel(id),
        value: ENROLLMENT_VALUES[id],
      })),
  );

  protected readonly gaugeSlices = computed<readonly SolarisChartSlice[]>(
    () => [
      {
        id: 'attendance',
        label: this.translateService.translate(
          'pie-chart-view.gauge.seriesAttendance',
        ),
        value: 87,
      },
    ],
  );

  protected readonly scoreSlices = computed<readonly SolarisChartSlice[]>(
    () => [
      {
        id: 'score',
        label: this.translateService.translate(
          'pie-chart-view.scoreRing.seriesScore',
        ),
        value: 7.5,
      },
    ],
  );

  protected readonly drillDetail = computed(() => {
    const id = this.selectedSlice();
    if (id === null) return null;
    const slice = this.groupedSlices().find((entry) => entry.id === id);
    if (!slice) return null;
    const classKeys = ['classA', 'classB', 'classC'] as const;
    const rows = DETAIL_SHARES.map((share, index) => ({
      class: this.translateService.translate(
        `pie-chart-view.drillDown.${classKeys[index]}`,
      ),
      students: Math.round(slice.value * share),
    }));
    return { label: slice.label, value: slice.value, rows };
  });

  protected readonly detailColumns = computed(
    (): readonly SolarisTableColumn<{ class: string; students: number }>[] => [
      {
        id: 'class',
        header: this.translateService.translate(
          'pie-chart-view.drillDown.colClass',
        ),
        accessor: 'class',
      },
      {
        id: 'students',
        header: this.translateService.translate(
          'pie-chart-view.drillDown.colStudents',
        ),
        accessor: 'students',
        width: '130px',
      },
    ],
  );

  protected readonly propsColumns = computed(
    (): readonly SolarisTableColumn<PieChartPropRow>[] => [
      {
        id: 'prop',
        header: this.translateService.translate('pie-chart-view.props.colProp'),
        accessor: 'prop',
        width: '150px',
      },
      {
        id: 'type',
        header: this.translateService.translate('pie-chart-view.props.colType'),
        accessor: 'type',
      },
      {
        id: 'values',
        header: this.translateService.translate(
          'pie-chart-view.props.colValues',
        ),
        accessor: 'values',
      },
      {
        id: 'default',
        header: this.translateService.translate(
          'pie-chart-view.props.colDefault',
        ),
        accessor: 'default',
        width: '150px',
      },
    ],
  );

  protected readonly propsRows = PROP_ROWS;

  protected onSliceSelect(id: string): void {
    this.selectedSlice.set(id);
    this.log.set(`pie-slice:${id}`);
  }

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: PIE_CHART_TRANSLATION_PREFIX,
      slug: PIE_CHART_SHOWCASE_SLUG,
      importCode: PIE_CHART_SHOWCASE_IMPORT_CODE,
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
