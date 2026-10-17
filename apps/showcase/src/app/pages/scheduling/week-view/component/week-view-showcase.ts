import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';

import {
  SolarisCalendarWeekViewComponent,
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  builtInHolidays,
  preloadBuiltInHolidays,
  type SolarisCalendarEvent,
  type SolarisCalendarEventCreateProposal,
  type SolarisCalendarEventMoveProposal,
  type SolarisCalendarEventResizeProposal,
  type SolarisCalendarTask,
  type SolarisHoliday,
  type SolarisWeekViewDensity,
  type SolarisWeekViewSize,
  type SolarisWeekViewVisibleDays,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  WEEK_VIEW_SHOWCASE_BASIC_CODE,
  WEEK_VIEW_SHOWCASE_BREADCRUMBS,
  WEEK_VIEW_SHOWCASE_DRAG_CODE,
  WEEK_VIEW_SHOWCASE_IMPORT_CODE,
  WEEK_VIEW_SHOWCASE_INSTALL_COMMANDS,
  WEEK_VIEW_SHOWCASE_NEXT,
  WEEK_VIEW_SHOWCASE_PREV,
  WEEK_VIEW_SHOWCASE_SLUG,
  WEEK_VIEW_SHOWCASE_TOC_ITEMS,
  WEEK_VIEW_TRANSLATION_PREFIX,
} from '../model/week-view-showcase.data';

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
    start: '2026-10-15T10:00:00-03:00',
    end: '2026-10-15T12:00:00-03:00',
    color: 'primary',
  },
  {
    id: 'review',
    kind: 'event',
    title: 'Design review',
    start: '2026-10-15T10:30:00-03:00',
    end: '2026-10-15T11:30:00-03:00',
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
type DemoDays = '1' | '3' | '4' | '7';

@Component({
  standalone: true,
  imports: [
    SolarisCalendarWeekViewComponent,
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
  templateUrl: './week-view-showcase.html',
  styleUrls: ['./week-view-showcase.scss'],
})
export class WeekViewShowcasePage implements OnInit {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = WEEK_VIEW_SHOWCASE_BREADCRUMBS;
  protected readonly prev = WEEK_VIEW_SHOWCASE_PREV;
  protected readonly next = WEEK_VIEW_SHOWCASE_NEXT;
  protected readonly tocItems = WEEK_VIEW_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = WEEK_VIEW_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = WEEK_VIEW_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = WEEK_VIEW_SHOWCASE_BASIC_CODE;
  protected readonly dragCode = WEEK_VIEW_SHOWCASE_DRAG_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: WEEK_VIEW_TRANSLATION_PREFIX,
      slug: WEEK_VIEW_SHOWCASE_SLUG,
      importCode: WEEK_VIEW_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly events = SHOWCASE_EVENTS;
  protected readonly tasks = SHOWCASE_TASKS;
  protected readonly holidays = signal<SolarisHoliday[]>([]);
  protected readonly focusedDate = signal('2026-10-15');
  protected readonly demoLocale = signal<DemoLocale>('pt-BR');
  protected readonly demoDays = signal<DemoDays>('7');
  protected readonly demoAllDay = signal<'on' | 'off'>('on');
  protected readonly selectedSize = signal<SolarisWeekViewSize>('md');
  protected readonly selectedDensity =
    signal<SolarisWeekViewDensity>('comfortable');
  protected readonly log = signal('');
  protected readonly dragLog = signal('');

  protected readonly visibleDays = computed(
    () => Number(this.demoDays()) as SolarisWeekViewVisibleDays,
  );

  protected readonly showAllDay = computed(() => this.demoAllDay() === 'on');

  protected readonly rangeLabel = computed(() => {
    const parts = this.focusedDate().split('-').map(Number);
    return new Intl.DateTimeFormat(this.demoLocale(), {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(parts[0], parts[1] - 1, 1)));
  });

  protected readonly sizeDensityCode = computed(
    () =>
      `<solaris-calendar-week-view locale="${this.demoLocale()}" size="${this.selectedSize()}" density="${this.selectedDensity()}" [visibleDays]="${this.visibleDays()}" [events]="events" />`,
  );

  async ngOnInit(): Promise<void> {
    await this.refreshHolidays();
  }

  protected async selectLocale(locale: unknown): Promise<void> {
    if (locale !== 'pt-BR' && locale !== 'en-US' && locale !== 'es') return;
    this.demoLocale.set(locale);
    await this.refreshHolidays();
  }

  protected selectDays(days: unknown): void {
    if (days !== '1' && days !== '3' && days !== '4' && days !== '7') return;
    this.demoDays.set(days);
  }

  protected selectAllDay(value: unknown): void {
    if (value !== 'on' && value !== 'off') return;
    this.demoAllDay.set(value);
  }

  protected shiftRange(delta: number): void {
    const parts = this.focusedDate().split('-').map(Number);
    const base = new Date(
      Date.UTC(parts[0], parts[1] - 1, parts[2] + delta * this.visibleDays()),
    );
    const padded = (value: number, length: number): string =>
      String(value).padStart(length, '0');
    this.focusedDate.set(
      `${padded(base.getUTCFullYear(), 4)}-${padded(base.getUTCMonth() + 1, 2)}-${padded(base.getUTCDate(), 2)}`,
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

  protected onSlotSelect(slot: { date: string; time: string }): void {
    this.log.set(`slot:${slot.date}@${slot.time}`);
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

  protected onEventCreate(proposal: SolarisCalendarEventCreateProposal): void {
    this.dragLog.set(`create:${proposal.start}→${proposal.end}`);
  }

  protected onEventMove(proposal: SolarisCalendarEventMoveProposal): void {
    this.dragLog.set(
      `move:${proposal.id}@${proposal.start}→${proposal.end}#${proposal.occurrenceScope}`,
    );
  }

  protected onEventResize(proposal: SolarisCalendarEventResizeProposal): void {
    this.dragLog.set(
      `resize:${proposal.id}@${proposal.start}→${proposal.end}#${proposal.occurrenceScope}`,
    );
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
