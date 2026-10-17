import { DOCUMENT } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';

import {
  SolarisCalendarComponent,
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  builtInHolidays,
  preloadBuiltInHolidays,
  type SolarisCalendarEvent,
  type SolarisCalendarTask,
  type SolarisCalendarView,
  type SolarisHoliday,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  SHELL_SHOWCASE_BASIC_CODE,
  SHELL_SHOWCASE_BREADCRUMBS,
  SHELL_SHOWCASE_IMPORT_CODE,
  SHELL_SHOWCASE_INSTALL_COMMANDS,
  SHELL_SHOWCASE_NEXT,
  SHELL_SHOWCASE_PREV,
  SHELL_SHOWCASE_SLUG,
  SHELL_SHOWCASE_TOC_ITEMS,
  SHELL_TRANSLATION_PREFIX,
} from '../model/shell-showcase.data';

const SHOWCASE_EVENTS: SolarisCalendarEvent[] = [
  {
    id: 'standup',
    kind: 'event',
    title: 'Team standup',
    start: '2026-10-15T09:00:00-03:00',
    end: '2026-10-15T09:30:00-03:00',
    color: 'info',
  },
  {
    id: 'planning',
    kind: 'event',
    title: 'Sprint planning',
    start: '2026-10-15T14:00:00-03:00',
    end: '2026-10-15T16:00:00-03:00',
    color: 'primary',
  },
];

const SHOWCASE_TASKS: SolarisCalendarTask[] = [
  {
    id: 'report',
    kind: 'task',
    title: 'Send status report',
    due: '2026-10-16',
    completed: false,
  },
];

@Component({
  standalone: true,
  imports: [
    SolarisCalendarComponent,
    SolarisCodeBlockComponent,
    SolarisPreviewCodeComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
  ],
  templateUrl: './shell-showcase.html',
  styleUrls: ['./shell-showcase.scss'],
})
export class ShellShowcasePage implements OnInit {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = SHELL_SHOWCASE_BREADCRUMBS;
  protected readonly prev = SHELL_SHOWCASE_PREV;
  protected readonly next = SHELL_SHOWCASE_NEXT;
  protected readonly tocItems = SHELL_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = SHELL_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = SHELL_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = SHELL_SHOWCASE_BASIC_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: SHELL_TRANSLATION_PREFIX,
      slug: SHELL_SHOWCASE_SLUG,
      importCode: SHELL_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly events = SHOWCASE_EVENTS;
  protected readonly tasks = SHOWCASE_TASKS;
  protected readonly holidays = signal<SolarisHoliday[]>([]);
  protected readonly view = signal<SolarisCalendarView>('month');
  protected readonly focusedDate = signal('2026-10-15');
  protected readonly log = signal('');

  ngOnInit(): void {
    void this.loadHolidays();
  }

  protected onDaySelect(date: string): void {
    this.log.set(`day:${date}`);
  }

  protected onViewChange(view: SolarisCalendarView): void {
    this.view.set(view);
    this.log.set(`view:${view}`);
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

  private async loadHolidays(): Promise<void> {
    await preloadBuiltInHolidays('pt-BR');
    this.holidays.set(
      builtInHolidays().holidays(
        { start: '2026-01-01', end: '2026-12-31' },
        'pt-BR',
      ),
    );
  }
}
