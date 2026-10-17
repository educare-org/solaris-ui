import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

import {
  SolarisCalendarMonthViewComponent,
  SolarisCalendarScheduleViewComponent,
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  builtInHolidays,
  preloadBuiltInHolidays,
  type SolarisCalendarEvent,
  type SolarisHoliday,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  PRINT_SHOWCASE_BASIC_CODE,
  PRINT_SHOWCASE_BREADCRUMBS,
  PRINT_SHOWCASE_IMPORT_CODE,
  PRINT_SHOWCASE_INSTALL_COMMANDS,
  PRINT_SHOWCASE_NEXT,
  PRINT_SHOWCASE_PREV,
  PRINT_SHOWCASE_SLUG,
  PRINT_SHOWCASE_TOC_ITEMS,
  PRINT_TRANSLATION_PREFIX,
} from '../model/print-showcase.data';

const SHOWCASE_EVENTS: SolarisCalendarEvent[] = [
  {
    id: 'standup',
    kind: 'event',
    title: 'Team standup',
    start: '2026-10-15T09:00:00-03:00',
    end: '2026-10-15T09:30:00-03:00',
    color: 'info',
  },
];

@Component({
  standalone: true,
  imports: [
    SolarisCalendarMonthViewComponent,
    SolarisCalendarScheduleViewComponent,
    SolarisCodeBlockComponent,
    SolarisPreviewCodeComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
  ],
  templateUrl: './print-showcase.html',
  styleUrls: ['./print-showcase.scss'],
})
export class PrintShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = PRINT_SHOWCASE_BREADCRUMBS;
  protected readonly prev = PRINT_SHOWCASE_PREV;
  protected readonly next = PRINT_SHOWCASE_NEXT;
  protected readonly tocItems = PRINT_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = PRINT_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = PRINT_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = PRINT_SHOWCASE_BASIC_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: PRINT_TRANSLATION_PREFIX,
      slug: PRINT_SHOWCASE_SLUG,
      importCode: PRINT_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly events = SHOWCASE_EVENTS;
  protected readonly holidays = signal<SolarisHoliday[]>([]);
  protected readonly focusedDate = signal('2026-10-15');

  constructor() {
    void preloadBuiltInHolidays('pt-BR').then(() => {
      this.holidays.set(
        builtInHolidays().holidays(
          { start: '2026-10-01', end: '2026-10-31' },
          'pt-BR',
        ),
      );
    });
  }

  protected printPreview(): void {
    window.print();
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
