import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';

import {
  SolarisCalendarMonthViewComponent,
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
  type SolarisMonthViewDensity,
  type SolarisMonthViewSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  MONTH_VIEW_SHOWCASE_BASIC_CODE,
  MONTH_VIEW_SHOWCASE_BREADCRUMBS,
  MONTH_VIEW_SHOWCASE_IMPORT_CODE,
  MONTH_VIEW_SHOWCASE_INSTALL_COMMANDS,
  MONTH_VIEW_SHOWCASE_PREV,
  MONTH_VIEW_SHOWCASE_SLUG,
  MONTH_VIEW_SHOWCASE_TOC_ITEMS,
  MONTH_VIEW_TRANSLATION_PREFIX,
} from '../model/month-view-showcase.data';

const SHOWCASE_EVENTS: SolarisCalendarEvent[] = [
  {
    id: 'standup',
    kind: 'event',
    title: 'Team standup',
    start: '2026-10-15T09:00:00-03:00',
    end: '2026-10-15T09:30:00-03:00',
    color: 'info',
    recurrence: { freq: 'weekly', byWeekday: [4], count: 4 },
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
    id: 'review',
    kind: 'event',
    title: 'Design review',
    start: '2026-10-15T17:00:00-03:00',
    end: '2026-10-15T18:00:00-03:00',
    color: 'violet',
  },
  {
    id: 'offsite',
    kind: 'event',
    title: 'Design offsite',
    start: '2026-10-20',
    end: '2026-10-22',
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

type DemoLocale = 'pt-BR' | 'en-US' | 'es';

@Component({
  standalone: true,
  imports: [
    SolarisCalendarMonthViewComponent,
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
  templateUrl: './month-view-showcase.html',
  styleUrls: ['./month-view-showcase.scss'],
})
export class MonthViewShowcasePage implements OnInit {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = MONTH_VIEW_SHOWCASE_BREADCRUMBS;
  protected readonly prev = MONTH_VIEW_SHOWCASE_PREV;
  protected readonly tocItems = MONTH_VIEW_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = MONTH_VIEW_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = MONTH_VIEW_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = MONTH_VIEW_SHOWCASE_BASIC_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: MONTH_VIEW_TRANSLATION_PREFIX,
      slug: MONTH_VIEW_SHOWCASE_SLUG,
      importCode: MONTH_VIEW_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly events = SHOWCASE_EVENTS;
  protected readonly tasks = SHOWCASE_TASKS;
  protected readonly holidays = signal<SolarisHoliday[]>([]);
  protected readonly focusedDate = signal('2026-10-15');
  protected readonly demoLocale = signal<DemoLocale>('pt-BR');
  protected readonly selectedSize = signal<SolarisMonthViewSize>('md');
  protected readonly selectedDensity =
    signal<SolarisMonthViewDensity>('comfortable');
  protected readonly log = signal('');

  protected readonly monthLabel = computed(() => {
    const parts = this.focusedDate().split('-').map(Number);
    return new Intl.DateTimeFormat(this.demoLocale(), {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(parts[0], parts[1] - 1, 1)));
  });

  protected readonly sizeDensityCode = computed(
    () =>
      `<solaris-calendar-month-view locale="${this.demoLocale()}" size="${this.selectedSize()}" density="${this.selectedDensity()}" [events]="events" />`,
  );

  async ngOnInit(): Promise<void> {
    await this.refreshHolidays();
  }

  protected async selectLocale(locale: unknown): Promise<void> {
    if (locale !== 'pt-BR' && locale !== 'en-US' && locale !== 'es') return;
    this.demoLocale.set(locale);
    await this.refreshHolidays();
  }

  protected shiftMonth(delta: number): void {
    const parts = this.focusedDate().split('-').map(Number);
    const index = parts[0] * 12 + (parts[1] - 1) + delta;
    const year = Math.floor(index / 12);
    const month = (index % 12) + 1;
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const day = Math.min(parts[2], lastDay);
    const padded = (value: number, length: number): string =>
      String(value).padStart(length, '0');
    this.focusedDate.set(
      `${padded(year, 4)}-${padded(month, 2)}-${padded(day, 2)}`,
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

  protected onMoreOpen(date: string): void {
    this.log.set(`more:${date}`);
  }

  protected onTaskToggle(id: string): void {
    this.log.set(`task:${id}`);
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
