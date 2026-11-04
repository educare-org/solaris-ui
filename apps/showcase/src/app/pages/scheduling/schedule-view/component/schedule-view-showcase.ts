import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';

import {
  SolarisCalendarScheduleViewComponent,
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
  type SolarisScheduleViewDensity,
  type SolarisScheduleViewSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  SCHEDULE_VIEW_SHOWCASE_BASIC_CODE,
  SCHEDULE_VIEW_SHOWCASE_BREADCRUMBS,
  SCHEDULE_VIEW_SHOWCASE_IMPORT_CODE,
  SCHEDULE_VIEW_SHOWCASE_INSTALL_COMMANDS,
  SCHEDULE_VIEW_SHOWCASE_NEXT,
  SCHEDULE_VIEW_SHOWCASE_PREV,
  SCHEDULE_VIEW_SHOWCASE_SLUG,
  SCHEDULE_VIEW_SHOWCASE_TOC_ITEMS,
  SCHEDULE_VIEW_TRANSLATION_PREFIX,
} from '../model/schedule-view-showcase.data';

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

function buildStressEvents(total: number): SolarisCalendarEvent[] {
  return Array.from({ length: total }, (_, index) => {
    const slot = index % 60;
    const day = (slot % 28) + 1;
    const month = slot < 30 ? '10' : '11';
    const padded = (value: number): string => String(value).padStart(2, '0');
    return {
      id: `stress-${index}`,
      kind: 'event',
      title: `Stress event ${index + 1}`,
      start: `2026-${month}-${padded(day)}T10:00:00-03:00`,
      end: `2026-${month}-${padded(day)}T11:00:00-03:00`,
      color: 'info',
    } as SolarisCalendarEvent;
  });
}

type DemoLocale = 'pt-BR' | 'en-US' | 'es-419';
type DemoWindow = '7' | '14';
type DemoDataset = 'sample' | 'stress';

@Component({
  standalone: true,
  imports: [
    SolarisCalendarScheduleViewComponent,
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
  templateUrl: './schedule-view-showcase.html',
  styleUrls: ['./schedule-view-showcase.scss'],
})
export class ScheduleViewShowcasePage implements OnInit {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = SCHEDULE_VIEW_SHOWCASE_BREADCRUMBS;
  protected readonly prev = SCHEDULE_VIEW_SHOWCASE_PREV;
  protected readonly next = SCHEDULE_VIEW_SHOWCASE_NEXT;
  protected readonly tocItems = SCHEDULE_VIEW_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = SCHEDULE_VIEW_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = SCHEDULE_VIEW_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = SCHEDULE_VIEW_SHOWCASE_BASIC_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: SCHEDULE_VIEW_TRANSLATION_PREFIX,
      slug: SCHEDULE_VIEW_SHOWCASE_SLUG,
      importCode: SCHEDULE_VIEW_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly holidays = signal<SolarisHoliday[]>([]);
  protected readonly focusedDate = signal('2026-10-15');
  protected readonly demoLocale = signal<DemoLocale>('pt-BR');
  protected readonly demoWindow = signal<DemoWindow>('7');
  protected readonly demoDataset = signal<DemoDataset>('sample');
  protected readonly selectedSize = signal<SolarisScheduleViewSize>('md');
  protected readonly selectedDensity =
    signal<SolarisScheduleViewDensity>('comfortable');
  protected readonly log = signal('');

  protected readonly windowDays = computed(() =>
    this.demoWindow() === '14' ? 14 : 7,
  );

  protected readonly events = computed(() =>
    this.demoDataset() === 'stress' ? buildStressEvents(1000) : SHOWCASE_EVENTS,
  );

  protected readonly tasks = computed(() =>
    this.demoDataset() === 'stress' ? [] : SHOWCASE_TASKS,
  );

  protected readonly sizeDensityCode = computed(
    () =>
      `<solaris-calendar-schedule-view locale="${this.demoLocale()}" size="${this.selectedSize()}" density="${this.selectedDensity()}" [windowDays]="${this.windowDays()}" [events]="events" />`,
  );

  async ngOnInit(): Promise<void> {
    await this.refreshHolidays();
  }

  protected async selectLocale(locale: unknown): Promise<void> {
    if (locale !== 'pt-BR' && locale !== 'en-US' && locale !== 'es-419') return;
    this.demoLocale.set(locale);
    await this.refreshHolidays();
  }

  protected selectWindow(window: unknown): void {
    if (window !== '7' && window !== '14') return;
    this.demoWindow.set(window);
  }

  protected selectDataset(dataset: unknown): void {
    if (dataset !== 'sample' && dataset !== 'stress') return;
    this.demoDataset.set(dataset);
  }

  protected onDaySelect(date: string): void {
    this.log.set(`day:${date}`);
  }

  protected onEventOpen(event: { id: string; start: string }): void {
    this.log.set(`event:${event.id}@${event.start}`);
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
