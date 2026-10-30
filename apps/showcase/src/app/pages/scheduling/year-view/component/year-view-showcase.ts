import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';

import {
  SolarisCalendarMonthViewComponent,
  SolarisCalendarYearViewComponent,
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  builtInHolidays,
  preloadBuiltInHolidays,
  type SolarisCalendarEvent,
  type SolarisCalendarTask,
  type SolarisHoliday,
  type SolarisYearViewDensity,
  type SolarisYearViewSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  YEAR_VIEW_SHOWCASE_BASIC_CODE,
  YEAR_VIEW_SHOWCASE_BREADCRUMBS,
  YEAR_VIEW_SHOWCASE_IMPORT_CODE,
  YEAR_VIEW_SHOWCASE_INSTALL_COMMANDS,
  YEAR_VIEW_SHOWCASE_NEXT,
  YEAR_VIEW_SHOWCASE_PREV,
  YEAR_VIEW_SHOWCASE_SLUG,
  YEAR_VIEW_SHOWCASE_TOC_ITEMS,
  YEAR_VIEW_TRANSLATION_PREFIX,
} from '../model/year-view-showcase.data';

const SHOWCASE_EVENTS: SolarisCalendarEvent[] = [
  {
    id: 'standup',
    kind: 'event',
    title: 'Team standup',
    start: '2026-10-15T09:00:00-03:00',
    end: '2026-10-15T09:30:00-03:00',
    color: 'info',
    recurrence: { freq: 'weekly', byWeekday: [4], count: 12 },
  },
  {
    id: 'planning',
    kind: 'event',
    title: 'Sprint planning',
    start: '2026-10-15T14:00:00-03:00',
    end: '2026-10-15T16:00:00-03:00',
    color: 'primary',
  },
  {
    id: 'offsite',
    kind: 'event',
    title: 'Design offsite',
    start: '2026-07-20',
    end: '2026-07-22',
    allDay: true,
    color: 'accent',
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

type DemoLocale = 'pt-BR' | 'en-US' | 'es-419';

@Component({
  standalone: true,
  imports: [
    SolarisCalendarMonthViewComponent,
    SolarisCalendarYearViewComponent,
    SolarisCodeBlockComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
  ],
  templateUrl: './year-view-showcase.html',
  styleUrls: ['./year-view-showcase.scss'],
})
export class YearViewShowcasePage implements OnInit {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = YEAR_VIEW_SHOWCASE_BREADCRUMBS;
  protected readonly prev = YEAR_VIEW_SHOWCASE_PREV;
  protected readonly next = YEAR_VIEW_SHOWCASE_NEXT;
  protected readonly tocItems = YEAR_VIEW_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = YEAR_VIEW_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = YEAR_VIEW_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = YEAR_VIEW_SHOWCASE_BASIC_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: YEAR_VIEW_TRANSLATION_PREFIX,
      slug: YEAR_VIEW_SHOWCASE_SLUG,
      importCode: YEAR_VIEW_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly events = SHOWCASE_EVENTS;
  protected readonly tasks = SHOWCASE_TASKS;
  protected readonly holidays = signal<SolarisHoliday[]>([]);
  protected readonly focusedDate = signal('2026-10-15');
  protected readonly demoLocale = signal<DemoLocale>('pt-BR');
  protected readonly selectedSize = signal<SolarisYearViewSize>('md');
  protected readonly selectedDensity =
    signal<SolarisYearViewDensity>('comfortable');
  protected readonly log = signal('');

  protected readonly yearLabel = computed(() => {
    const parts = this.focusedDate().split('-').map(Number);
    return new Intl.DateTimeFormat(this.demoLocale(), {
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(parts[0], 0, 1)));
  });

  protected readonly sizeDensityCode = computed(
    () =>
      `<solaris-calendar-year-view locale="${this.demoLocale()}" size="${this.selectedSize()}" density="${this.selectedDensity()}" [events]="events" />`,
  );

  async ngOnInit(): Promise<void> {
    await this.refreshHolidays();
  }

  protected async selectLocale(locale: unknown): Promise<void> {
    if (locale !== 'pt-BR' && locale !== 'en-US' && locale !== 'es-419') return;
    this.demoLocale.set(locale);
    await this.refreshHolidays();
  }

  protected shiftYear(delta: number): void {
    const parts = this.focusedDate().split('-').map(Number);
    const padded = (value: number, length: number): string =>
      String(value).padStart(length, '0');
    this.focusedDate.set(
      `${padded(parts[0] + delta, 4)}-${padded(parts[1], 2)}-${padded(parts[2], 2)}`,
    );
  }

  protected goToday(): void {
    const now = new Date();
    const padded = (value: number, length: number): string =>
      String(value).padStart(length, '0');
    this.focusedDate.set(
      `${padded(now.getFullYear(), 4)}-${padded(now.getMonth() + 1, 2)}-${padded(now.getDate(), 2)}`,
    );
  }

  protected onDaySelect(date: string): void {
    this.log.set(`day:${date}`);
  }

  protected onEventOpen(event: { id: string; start: string }): void {
    this.log.set(`event:${event.id}@${event.start}`);
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

  private async refreshHolidays(): Promise<void> {
    const locale = this.demoLocale();
    await preloadBuiltInHolidays(locale);
    this.holidays.set(
      builtInHolidays().holidays(
        { start: '2026-01-01', end: '2026-12-31' },
        locale,
      ),
    );
  }
}
