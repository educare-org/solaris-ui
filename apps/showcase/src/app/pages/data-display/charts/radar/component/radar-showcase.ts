import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisRadarComponent,
  SolarisTableComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisRadarSeries,
  type SolarisTableColumn,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../../shared/showcase-page-utils';
import {
  RADAR_SHOWCASE_BASIC_CODE,
  RADAR_SHOWCASE_BREADCRUMBS,
  RADAR_SHOWCASE_EMPTY_CODE,
  RADAR_SHOWCASE_IMPORT_CODE,
  RADAR_SHOWCASE_MANY_CODE,
  RADAR_SHOWCASE_NEXT,
  RADAR_SHOWCASE_PREV,
  RADAR_SHOWCASE_SLUG,
  RADAR_SHOWCASE_TOC_ITEMS,
  RADAR_TRANSLATION_PREFIX,
} from '../model/radar-showcase.data';
import {
  RADAR_AXIS_IDS,
  RADAR_MANY_AXIS_IDS,
  RADAR_MANY_SERIES_VALUES,
  RADAR_SERIES_VALUES,
  type RadarAxisId,
  type RadarManyAxisId,
} from '../model/radar-showcase-examples.data';
import {
  PROP_ROWS,
  type RadarPropRow,
} from '../model/radar-showcase-props.data';

function toPascalCase(id: string): string {
  return id
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');
}

@Component({
  standalone: true,
  imports: [
    NgTemplateOutlet,
    SolarisCodeBlockComponent,
    SolarisPreviewCodeComponent,
    SolarisRadarComponent,
    SolarisTableComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
  ],
  templateUrl: './radar-showcase.html',
  styleUrls: ['./radar-showcase.scss'],
})
export class RadarShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = RADAR_SHOWCASE_BREADCRUMBS;
  protected readonly prev = RADAR_SHOWCASE_PREV;
  protected readonly next = RADAR_SHOWCASE_NEXT;
  protected readonly tocItems = RADAR_SHOWCASE_TOC_ITEMS;
  protected readonly installCommands = ['pnpm add @solaris-ui/angular'];
  protected readonly importCode = RADAR_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = RADAR_SHOWCASE_BASIC_CODE;
  protected readonly emptyCode = RADAR_SHOWCASE_EMPTY_CODE;
  protected readonly manyCode = RADAR_SHOWCASE_MANY_CODE;
  protected readonly log = signal('');

  protected readonly chartLocale = computed(() =>
    this.translateService.locale(),
  );

  private axisLabel(id: RadarAxisId): string {
    const key = `radar-view.examples.axis${id[0].toUpperCase()}${id.slice(1)}`;
    return this.translateService.translate(key);
  }

  private manyAxisLabel(id: RadarManyAxisId): string {
    const key = `radar-view.manySeries.axis${toPascalCase(id)}`;
    return this.translateService.translate(key);
  }

  protected readonly axes = computed<readonly string[]>(() =>
    RADAR_AXIS_IDS.map((id) => this.axisLabel(id)),
  );

  protected readonly manyAxes = computed<readonly string[]>(() =>
    RADAR_MANY_AXIS_IDS.map((id) => this.manyAxisLabel(id)),
  );

  protected readonly series = computed<readonly SolarisRadarSeries[]>(() => [
    {
      id: 'class-a',
      label: this.translateService.translate(
        'radar-view.examples.seriesClassA',
      ),
      values: RADAR_SERIES_VALUES['class-a'],
    },
    {
      id: 'class-b',
      label: this.translateService.translate(
        'radar-view.examples.seriesClassB',
      ),
      values: RADAR_SERIES_VALUES['class-b'],
    },
  ]);

  protected readonly manySeries = computed<readonly SolarisRadarSeries[]>(() =>
    ['class-a', 'class-b', 'class-c', 'class-d', 'class-e', 'class-f'].map(
      (id) => ({
        id,
        label: this.translateService.translate(
          `radar-view.manySeries.series${toPascalCase(id)}`,
        ),
        values: RADAR_MANY_SERIES_VALUES[id],
      }),
    ),
  );

  protected readonly propsColumns = computed(
    (): readonly SolarisTableColumn<RadarPropRow>[] => [
      {
        id: 'prop',
        header: this.translateService.translate('radar-view.props.colProp'),
        accessor: 'prop',
        width: '150px',
      },
      {
        id: 'type',
        header: this.translateService.translate('radar-view.props.colType'),
        accessor: 'type',
      },
      {
        id: 'values',
        header: this.translateService.translate('radar-view.props.colValues'),
        accessor: 'values',
      },
      {
        id: 'default',
        header: this.translateService.translate('radar-view.props.colDefault'),
        accessor: 'default',
        width: '150px',
      },
    ],
  );

  protected readonly propsRows = PROP_ROWS;

  protected onVertexSelect(event: {
    seriesId: string;
    axisIndex: number;
  }): void {
    this.log.set(`radar-vertex:${event.seriesId}:${event.axisIndex}`);
  }

  protected onSeriesToggle(id: string): void {
    this.log.set(`radar-toggle:${id}`);
  }

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: RADAR_TRANSLATION_PREFIX,
      slug: RADAR_SHOWCASE_SLUG,
      importCode: RADAR_SHOWCASE_IMPORT_CODE,
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
