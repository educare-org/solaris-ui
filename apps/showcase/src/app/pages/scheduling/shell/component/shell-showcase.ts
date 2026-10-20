import { DOCUMENT } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';

import {
  SolarisCalendarComponent,
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  SolarisVisuallyHiddenDirective,
  builtInHolidays,
  preloadBuiltInHolidays,
  resolveSolarisEventDelete,
  resolveSolarisEventSave,
  type SolarisCalendarEvent,
  type SolarisCalendarEventCreateProposal,
  type SolarisCalendarEventMoveProposal,
  type SolarisCalendarEventResizeProposal,
  type SolarisCalendarTask,
  type SolarisCalendarView,
  type SolarisEventDeleteRequest,
  type SolarisEventSaveRequest,
  type SolarisHoliday,
  type SolarisMonthViewTaskMove,
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

function todayLocalDate(): string {
  const now = new Date();
  const pad = (value: number): string => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

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
    SolarisVisuallyHiddenDirective,
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

  protected readonly events = signal<SolarisCalendarEvent[]>([
    ...SHOWCASE_EVENTS,
  ]);
  protected readonly tasks = signal<SolarisCalendarTask[]>([...SHOWCASE_TASKS]);
  protected readonly holidays = signal<SolarisHoliday[]>([]);
  protected readonly view = signal<SolarisCalendarView>('month');
  protected readonly focusedDate = signal(todayLocalDate());
  protected readonly timeZone = signal('America/Sao_Paulo');
  protected readonly log = signal('');

  ngOnInit(): void {
    void this.loadHolidays();
  }

  protected onDaySelect(date: string): void {
    this.log.set(`day:${date}`);
  }

  protected onSlotSelect(slot: { date: string; time: string }): void {
    this.log.set(`slot:${slot.date}:${slot.time}`);
  }

  protected onEventOpen(open: { id: string; start: string }): void {
    this.log.set(`event:${open.id}@${open.start}`);
  }

  protected onEventSave(
    input: SolarisEventSaveRequest | SolarisCalendarEvent | SolarisCalendarTask,
  ): void {
    const request: SolarisEventSaveRequest =
      typeof input === 'object' &&
      input !== null &&
      'event' in input &&
      'scope' in input
        ? (input as SolarisEventSaveRequest)
        : {
            event: input as SolarisCalendarEvent | SolarisCalendarTask,
            scope: 'all',
            occurrenceStart: null,
          };
    const draft = request.event;
    if (draft.kind === 'task') {
      this.tasks.update((tasks) =>
        tasks.some((task) => task.id === draft.id)
          ? tasks.map((task) => (task.id === draft.id ? draft : task))
          : [...tasks, draft],
      );
      this.log.set(`save:${draft.id}:${draft.title}`);
      return;
    }
    const source = this.events().find((item) => item.id === draft.id) ?? null;
    if (
      source?.recurrence !== undefined &&
      request.scope !== 'all' &&
      request.occurrenceStart !== null
    ) {
      const resolved = resolveSolarisEventSave(
        source,
        request.occurrenceStart,
        draft,
        request.scope,
        this.timeZone(),
      );
      if (resolved === null) {
        this.log.set(`save:${draft.id}:invalid`);
        return;
      }
      const resolvedIds = new Set(resolved.map((item) => item.id));
      this.events.update((events) => {
        const kept = events.filter(
          (item) => item.id !== source.id && !resolvedIds.has(item.id),
        );
        return [...kept, ...resolved];
      });
      this.log.set(`save:${draft.id}:${draft.title}`);
      return;
    }
    this.events.update((events) =>
      events.some((event) => event.id === draft.id)
        ? events.map((event) => (event.id === draft.id ? draft : event))
        : [...events, draft],
    );
    this.log.set(`save:${draft.id}:${draft.title}`);
  }

  protected onEventDelete(request: SolarisEventDeleteRequest): void {
    const source = this.events().find((item) => item.id === request.eventId);
    if (!source) {
      this.log.set(`delete:${request.eventId}:${request.scope}:missing`);
      return;
    }
    const resolved = resolveSolarisEventDelete(
      source,
      request.occurrenceStart,
      request.scope,
      this.timeZone(),
    );
    if (resolved.action === 'remove') {
      this.events.update((items) =>
        items.filter((item) => item.id !== source.id),
      );
      this.log.set(`delete:${request.eventId}:${request.scope}:removed`);
    } else {
      this.events.update((items) =>
        items.map((item) => (item.id === source.id ? resolved.event : item)),
      );
      this.log.set(`delete:${request.eventId}:${request.scope}:updated`);
    }
  }

  protected onEventCreate(proposal: SolarisCalendarEventCreateProposal): void {
    this.log.set(`create:${proposal.start}`);
  }

  protected onEventMove(proposal: SolarisCalendarEventMoveProposal): void {
    this.events.update((events) =>
      events.map((event) =>
        event.id === proposal.id
          ? { ...event, start: proposal.start, end: proposal.end }
          : event,
      ),
    );
    this.log.set(`move:${proposal.id}`);
  }

  protected onEventResize(proposal: SolarisCalendarEventResizeProposal): void {
    this.events.update((events) =>
      events.map((event) =>
        event.id === proposal.id
          ? { ...event, start: proposal.start, end: proposal.end }
          : event,
      ),
    );
    this.log.set(`resize:${proposal.id}`);
  }

  protected onTaskToggle(id: string): void {
    this.tasks.update((tasks) =>
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
    this.log.set(`task:${id}`);
  }

  protected onTaskMove(move: SolarisMonthViewTaskMove): void {
    this.tasks.update((tasks) =>
      tasks.map((task) =>
        task.id === move.id ? { ...task, due: move.due } : task,
      ),
    );
    this.log.set(`task-move:${move.id}`);
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
