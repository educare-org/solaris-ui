import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisChartShellComponent,
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisChartPeriod,
  type SolarisChartSeries,
  type SolarisChartView,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
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

const BASE_SERIES: readonly SolarisChartSeries[] = [
  {
    id: 'automation',
    label: 'Task Automation',
    points: [
      { x: 28, y: 180 },
      { x: 29, y: 210 },
      { x: 30, y: 150 },
      { x: 1, y: 190 },
    ],
  },
  {
    id: 'queries',
    label: 'User Queries',
    points: [
      { x: 28, y: 60 },
      { x: 29, y: 90 },
      { x: 30, y: 120 },
      { x: 1, y: 80 },
    ],
  },
  {
    id: 'system',
    label: 'System Actions',
    points: [
      { x: 28, y: 40 },
      { x: 29, y: 45 },
      { x: 30, y: 50 },
      { x: 1, y: 42 },
    ],
  },
];

@Component({
  standalone: true,
  imports: [
    SolarisChartShellComponent,
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
export class ChartShellShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = CHART_SHELL_SHOWCASE_BREADCRUMBS;
  protected readonly prev = CHART_SHELL_SHOWCASE_PREV;
  protected readonly next = CHART_SHELL_SHOWCASE_NEXT;
  protected readonly tocItems = CHART_SHELL_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = ['pnpm add @solaris-ui/angular'];
  protected readonly importCode = CHART_SHELL_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = CHART_SHELL_SHOWCASE_BASIC_CODE;

  protected readonly view = signal<SolarisChartView>('line');
  protected readonly period = signal<SolarisChartPeriod>('7D');
  protected readonly hiddenIds = signal<readonly string[]>([]);
  protected readonly loading = signal(false);
  protected readonly log = signal('');

  protected readonly series = computed<readonly SolarisChartSeries[]>(() => {
    const hidden = new Set(this.hiddenIds());
    return BASE_SERIES.map((entry) =>
      hidden.has(entry.id) ? { ...entry, hidden: true } : entry,
    );
  });

  protected readonly intervalLabel = computed(() => {
    const key = `chart-shell-view.examples.interval${this.period()}`;
    const translated = this.translateService.translate(key);
    return translated !== key ? translated : this.period();
  });

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
    this.hiddenIds.update((ids) =>
      ids.includes(id) ? ids.filter((entry) => entry !== id) : [...ids, id],
    );
    this.log.set(`toggle:${id}`);
  }

  protected onActionRequest(action: string): void {
    this.log.set(`action:${action}`);
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
