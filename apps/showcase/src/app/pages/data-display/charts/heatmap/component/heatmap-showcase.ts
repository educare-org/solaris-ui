import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisCodeBlockComponent,
  SolarisHeatmapComponent,
  SolarisPreviewCodeComponent,
  SolarisTableComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisHeatmapCellEvent,
  type SolarisHeatmapRow,
  type SolarisTableColumn,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../../shared/showcase-page-utils';
import {
  HEATMAP_SHOWCASE_BASIC_CODE,
  HEATMAP_SHOWCASE_BREADCRUMBS,
  HEATMAP_SHOWCASE_EMPTY_CODE,
  HEATMAP_SHOWCASE_IMPORT_CODE,
  HEATMAP_SHOWCASE_NEXT,
  HEATMAP_SHOWCASE_PREV,
  HEATMAP_SHOWCASE_SCALE_CODE,
  HEATMAP_SHOWCASE_SLUG,
  HEATMAP_SHOWCASE_TOC_ITEMS,
  HEATMAP_TRANSLATION_PREFIX,
} from '../model/heatmap-showcase.data';
import {
  HEATMAP_DAY_IDS,
  HEATMAP_SCALE_CLASS_IDS,
  HEATMAP_SCALE_COLUMNS,
  HEATMAP_SCALE_VALUES,
  HEATMAP_SLOTS,
  HEATMAP_VALUES,
  type HeatmapDayId,
} from '../model/heatmap-showcase-examples.data';
import {
  PROP_ROWS,
  type HeatmapPropRow,
} from '../model/heatmap-showcase-props.data';

@Component({
  standalone: true,
  imports: [
    NgTemplateOutlet,
    SolarisCodeBlockComponent,
    SolarisHeatmapComponent,
    SolarisPreviewCodeComponent,
    SolarisTableComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
  ],
  templateUrl: './heatmap-showcase.html',
  styleUrls: ['./heatmap-showcase.scss'],
})
export class HeatmapShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = HEATMAP_SHOWCASE_BREADCRUMBS;
  protected readonly prev = HEATMAP_SHOWCASE_PREV;
  protected readonly next = HEATMAP_SHOWCASE_NEXT;
  protected readonly tocItems = HEATMAP_SHOWCASE_TOC_ITEMS;
  protected readonly installCommands = ['pnpm add @solaris-ui/angular'];
  protected readonly importCode = HEATMAP_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = HEATMAP_SHOWCASE_BASIC_CODE;
  protected readonly emptyCode = HEATMAP_SHOWCASE_EMPTY_CODE;
  protected readonly scaleCode = HEATMAP_SHOWCASE_SCALE_CODE;
  protected readonly log = signal('');

  protected readonly chartLocale = computed(() =>
    this.translateService.locale(),
  );

  private dayLabel(id: HeatmapDayId): string {
    const key = `heatmap-view.examples.day${id[0].toUpperCase()}${id.slice(1)}`;
    return this.translateService.translate(key);
  }

  protected readonly columns = [...HEATMAP_SLOTS];

  protected readonly rows = computed<readonly SolarisHeatmapRow[]>(() =>
    HEATMAP_DAY_IDS.map((id) => ({
      id,
      label: this.dayLabel(id),
      values: HEATMAP_VALUES[id],
    })),
  );

  protected readonly scaleColumns = [...HEATMAP_SCALE_COLUMNS];

  protected readonly scaleRows = computed<readonly SolarisHeatmapRow[]>(() =>
    HEATMAP_SCALE_CLASS_IDS.map((id) => ({
      id,
      label: this.translateService.translate(
        `heatmap-view.scale.series${id[0].toUpperCase()}${id.slice(1)}`,
      ),
      values: HEATMAP_SCALE_VALUES[id],
    })),
  );

  protected readonly propsColumns = computed(
    (): readonly SolarisTableColumn<HeatmapPropRow>[] => [
      {
        id: 'prop',
        header: this.translateService.translate('heatmap-view.props.colProp'),
        accessor: 'prop',
        width: '150px',
      },
      {
        id: 'type',
        header: this.translateService.translate('heatmap-view.props.colType'),
        accessor: 'type',
      },
      {
        id: 'values',
        header: this.translateService.translate('heatmap-view.props.colValues'),
        accessor: 'values',
      },
      {
        id: 'default',
        header: this.translateService.translate(
          'heatmap-view.props.colDefault',
        ),
        accessor: 'default',
        width: '150px',
      },
    ],
  );

  protected readonly propsRows = PROP_ROWS;

  protected onCellSelect(event: SolarisHeatmapCellEvent): void {
    this.log.set(`heat-cell:${event.rowId}:${event.columnIndex}`);
  }

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: HEATMAP_TRANSLATION_PREFIX,
      slug: HEATMAP_SHOWCASE_SLUG,
      importCode: HEATMAP_SHOWCASE_IMPORT_CODE,
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
