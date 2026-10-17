import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';

import { nextIdFor } from '../../../../../core';
import { SolarisButtonDirective } from '../../../../actions/button';
import { SolarisIconButtonDirective } from '../../../../actions/icon-button';
import { SolarisIconComponent } from '../../../../icon';
import { todaySolarisDate } from '../../../../forms/date/model/date.utils';
import { SolarisTooltipDirective } from '../../../../interaction/tooltip';
import { SolarisVisuallyHiddenDirective } from '../../../../../services/accessibility';
import { SolarisTranslateService } from '../../../../../services/translation';
import {
  addDaysToSolarisDate,
  defaultSolarisTimeZone,
  isSolarisWeekend,
  parseSolarisDateParts,
  parseSolarisDateTimeMs,
  toSolarisDateInZone,
} from '../../model/calendar-datetime.utils';
import { resolveCalendarFallback } from '../../model/strings/calendar-strings';
import {
  compareCivilDates,
  expandEventSpans,
  spanDates,
  taskDueCivil,
} from '../../model/calendar-span.utils';
import type {
  SolarisCalendarEvent,
  SolarisCalendarTask,
  SolarisHoliday,
} from '../../model/calendar.types';
import type {
  SolarisScheduleViewDensity,
  SolarisScheduleViewEventOpen,
  SolarisScheduleViewGroup,
  SolarisScheduleViewItem,
  SolarisScheduleViewSize,
} from '../model/schedule-view.types';

const MAX_WINDOW_DAYS = 31;

function validAnchor(value: string): string {
  if (parseSolarisDateParts(value) !== null) return value;
  return todaySolarisDate();
}

function normalizeWindow(value: number): number {
  if (!Number.isFinite(value)) return 7;
  return Math.min(MAX_WINDOW_DAYS, Math.max(1, Math.round(value)));
}

function itemWeight(item: SolarisScheduleViewItem): number {
  if (item.kind === 'holiday') return 0;
  if (item.kind === 'event' && item.allDay) return 1;
  if (item.kind === 'event') return 2;
  return 3;
}

function compareScheduleItems(
  first: SolarisScheduleViewItem,
  second: SolarisScheduleViewItem,
): number {
  const weight = itemWeight(first) - itemWeight(second);
  if (weight !== 0) return weight;
  if (first.sortKey !== second.sortKey) {
    if (first.sortKey < second.sortKey) return -1;
    return 1;
  }
  if (first.title < second.title) return -1;
  if (first.title > second.title) return 1;
  return 0;
}

@Component({
  selector: 'solaris-calendar-schedule-view',
  standalone: true,
  imports: [
    SolarisButtonDirective,
    SolarisIconButtonDirective,
    SolarisIconComponent,
    SolarisTooltipDirective,
    SolarisVisuallyHiddenDirective,
  ],
  templateUrl: './schedule-view.component.html',
  styleUrls: ['./schedule-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-calendar-schedule-view',
    '[attr.data-density]': 'density()',
    '[attr.data-size]': 'size()',
  },
})
export class SolarisCalendarScheduleViewComponent {
  readonly focusedDate = model<string>(todaySolarisDate());
  readonly events = input<SolarisCalendarEvent[]>([]);
  readonly tasks = input<SolarisCalendarTask[]>([]);
  readonly holidays = input<SolarisHoliday[]>([]);
  readonly timeZone = input<string>(defaultSolarisTimeZone());
  readonly locale = input.required<string>();
  readonly windowDays = input<number>(7);
  readonly density = input<SolarisScheduleViewDensity>('comfortable');
  readonly size = input<SolarisScheduleViewSize>('md');
  readonly selectedId = input<string | null>(null);

  readonly daySelect = output<string>();
  readonly eventOpen = output<SolarisScheduleViewEventOpen>();
  readonly taskToggle = output<string>();

  private readonly instanceId = nextIdFor('solaris-schedule-view');
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  protected readonly announcement = signal('');
  protected readonly listFocused = signal(false);
  protected readonly activeDate = signal<string | null>(null);

  protected readonly windowSize = computed(() =>
    normalizeWindow(this.windowDays()),
  );

  protected readonly anchor = computed(() => validAnchor(this.focusedDate()));

  protected readonly windowEnd = computed(
    () =>
      addDaysToSolarisDate(this.anchor(), this.windowSize()) ?? this.anchor(),
  );

  protected readonly groups = computed<SolarisScheduleViewGroup[]>(() => {
    const start = this.anchor();
    const end = this.windowEnd();
    const buckets = new Map<string, SolarisScheduleViewItem[]>();
    const push = (date: string, item: SolarisScheduleViewItem): void => {
      if (date < start || date >= end) return;
      const list = buckets.get(date);
      if (list === undefined) buckets.set(date, [item]);
      else list.push(item);
    };
    this.collectEvents(push, start, end);
    this.collectTasks(push);
    this.collectHolidays(push);
    const entries = Array.from(buckets.entries());
    entries.sort((first, second) => compareCivilDates(first[0], second[0]));
    return entries.map(([date, items]) => {
      items.sort(compareScheduleItems);
      return { date, items };
    });
  });

  private collectEvents(
    push: (date: string, item: SolarisScheduleViewItem) => void,
    rangeStart: string,
    rangeEnd: string,
  ): void {
    const timeZone = this.timeZone();
    for (const event of this.events()) {
      for (const span of expandEventSpans(
        event,
        timeZone,
        rangeStart,
        rangeEnd,
      )) {
        const time = this.spanTime(span.occurrenceStart, span.startCivil);
        const sortKey = parseSolarisDateTimeMs(span.occurrenceStart) ?? 0;
        for (const date of spanDates(span.startCivil, span.endCivil)) {
          push(date, {
            kind: 'event',
            id: event.id,
            title: event.title,
            time: time !== null && date === span.startCivil ? time : null,
            sortKey,
            allDay:
              event.allDay === true ||
              parseSolarisDateTimeMs(span.occurrenceStart) === null,
            color: event.color ?? 'info',
            completed: false,
            occurrenceStart: span.occurrenceStart,
          });
        }
      }
    }
  }

  private spanTime(occurrenceStart: string, startCivil: string): string | null {
    const instant = parseSolarisDateTimeMs(occurrenceStart);
    if (instant === null) return null;
    const rendered = toSolarisDateInZone(occurrenceStart, this.timeZone());
    if (rendered !== startCivil) return null;
    return new Intl.DateTimeFormat(this.locale(), {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: this.timeZone(),
    }).format(new Date(instant));
  }

  private collectTasks(
    push: (date: string, item: SolarisScheduleViewItem) => void,
  ): void {
    for (const task of this.tasks()) {
      const due = taskDueCivil(task, this.timeZone());
      if (due === null) continue;
      push(due, {
        kind: 'task',
        id: task.id,
        title: task.title,
        time: null,
        sortKey: 0,
        allDay: true,
        color: task.completed ? 'success' : 'info',
        completed: task.completed,
        occurrenceStart: due,
      });
    }
  }

  private collectHolidays(
    push: (date: string, item: SolarisScheduleViewItem) => void,
  ): void {
    for (const holiday of this.holidays()) {
      if (parseSolarisDateParts(holiday.date) === null) continue;
      push(holiday.date, {
        kind: 'holiday',
        id: null,
        title: holiday.name,
        time: null,
        sortKey: 0,
        allDay: true,
        color: 'warning',
        completed: false,
        occurrenceStart: holiday.date,
      });
    }
  }

  protected readonly rangeLabel = computed(() => {
    const last =
      addDaysToSolarisDate(this.anchor(), this.windowSize() - 1) ??
      this.anchor();
    return `${this.formatDayShort(this.anchor())} – ${this.formatDayShort(last)}`;
  });

  protected readonly activeGroupId = computed<string | null>(() => {
    const groups = this.groups();
    if (groups.length === 0) return null;
    const active = this.activeDate();
    const match =
      groups.find((group) => group.date === active) ??
      groups.find((group) => group.date === this.anchor()) ??
      groups[0];
    return this.groupId(match.date);
  });

  protected groupId(date: string): string {
    return `${this.instanceId}-day-${date}`;
  }

  protected itemKey(item: SolarisScheduleViewItem): string {
    return `${item.kind}:${item.id ?? item.title}:${item.occurrenceStart}`;
  }

  protected isSelected(item: SolarisScheduleViewItem): boolean {
    const selected = this.selectedId();
    return selected !== null && item.id === selected;
  }

  protected isToday(date: string): boolean {
    return date === todaySolarisDate();
  }

  protected isWeekend(date: string): boolean {
    return isSolarisWeekend(date);
  }

  private resolveText(key: string, params: Record<string, string>): string {
    const service = this.translateService;
    if (service) return service.translate(key, params);
    return resolveCalendarFallback(this.locale(), key, params);
  }

  protected previousLabel(): string {
    return this.resolveText('solaris.calendar.previousDays', {
      count: `${this.windowSize()}`,
    });
  }

  protected nextLabel(): string {
    return this.resolveText('solaris.calendar.nextDays', {
      count: `${this.windowSize()}`,
    });
  }

  protected todayLabel(): string {
    return this.resolveText('solaris.calendar.today', {});
  }

  protected emptyTitle(): string {
    return this.resolveText('solaris.calendar.scheduleEmpty', {});
  }

  protected emptyHint(): string {
    return this.resolveText('solaris.calendar.scheduleEmptyHint', {});
  }

  protected formatDay(date: string): string {
    return new Intl.DateTimeFormat(this.locale(), {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      timeZone: 'UTC',
    }).format(new Date(`${date}T00:00:00Z`));
  }

  protected formatDayShort(date: string): string {
    return new Intl.DateTimeFormat(this.locale(), {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    }).format(new Date(`${date}T00:00:00Z`));
  }

  protected dayNumber(date: string): number {
    return parseSolarisDateParts(date)?.day ?? 0;
  }

  protected weekdayName(date: string): string {
    return new Intl.DateTimeFormat(this.locale(), {
      weekday: 'short',
      timeZone: 'UTC',
    }).format(new Date(`${date}T00:00:00Z`));
  }

  protected dayAriaLabel(date: string, count: number): string {
    const formatted = this.formatDay(date);
    if (count === 0) return formatted;
    return this.resolveText('solaris.calendar.dayItems', {
      date: formatted,
      count: `${count}`,
    });
  }

  protected itemAriaLabel(item: SolarisScheduleViewItem): string {
    if (item.kind === 'task') {
      const state = this.resolveText(
        item.completed
          ? 'solaris.calendar.taskCompleted'
          : 'solaris.calendar.taskOpen',
        {},
      );
      return this.resolveText('solaris.calendar.task', {
        title: item.title,
        state,
      });
    }
    if (item.time === null) return item.title;
    return `${item.time} ${item.title}`;
  }

  protected openDay(date: string): void {
    this.activeDate.set(date);
    this.daySelect.emit(date);
    const count =
      this.groups().find((group) => group.date === date)?.items.length ?? 0;
    this.announcement.set(this.dayAriaLabel(date, count));
  }

  protected openEvent(item: SolarisScheduleViewItem): void {
    if (item.id === null) return;
    this.eventOpen.emit({ id: item.id, start: item.occurrenceStart });
    this.announcement.set(this.itemAriaLabel(item));
  }

  protected toggleTask(item: SolarisScheduleViewItem): void {
    if (item.id === null) return;
    this.taskToggle.emit(item.id);
    this.announcement.set(this.itemAriaLabel(item));
  }

  protected activateItem(item: SolarisScheduleViewItem, date: string): void {
    if (item.kind === 'task') {
      this.toggleTask(item);
    } else if (item.kind === 'event') {
      this.openEvent(item);
    } else {
      this.openDay(date);
    }
  }

  protected shiftWindow(delta: number): void {
    const next =
      addDaysToSolarisDate(this.anchor(), delta * this.windowSize()) ??
      this.anchor();
    this.focusedDate.set(next);
    this.activeDate.set(null);
    this.announcement.set(this.rangeLabel());
  }

  protected goToday(): void {
    this.focusedDate.set(todaySolarisDate());
    this.activeDate.set(null);
    this.announcement.set(this.rangeLabel());
  }

  protected onListFocus(): void {
    this.listFocused.set(true);
  }

  protected onListBlur(): void {
    this.listFocused.set(false);
  }

  protected onListKeydown(event: KeyboardEvent): void {
    const target = event.target;
    if (
      target instanceof HTMLElement &&
      target.closest('[data-item]') !== null
    ) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openDay(this.keyboardDate());
      return;
    }
    const next = this.keyboardStep(event.key);
    if (next === null) return;
    event.preventDefault();
    if (next === 'previous-window') {
      this.shiftWindow(-1);
      return;
    }
    if (next === 'next-window') {
      this.shiftWindow(1);
      return;
    }
    this.activeDate.set(next);
    const count =
      this.groups().find((group) => group.date === next)?.items.length ?? 0;
    this.announcement.set(this.dayAriaLabel(next, count));
  }

  private keyboardDate(): string {
    const groups = this.groups();
    if (groups.length === 0) return this.anchor();
    const active = this.activeDate();
    if (active !== null && groups.some((group) => group.date === active)) {
      return active;
    }
    const anchored = groups.find((group) => group.date === this.anchor());
    return (anchored ?? groups[0]).date;
  }

  private keyboardStep(key: string): string | null {
    if (
      key === 'ArrowDown' ||
      key === 'ArrowRight' ||
      key === 'ArrowUp' ||
      key === 'ArrowLeft'
    ) {
      return this.stepGroup(
        key === 'ArrowDown' || key === 'ArrowRight' ? 1 : -1,
      );
    }
    if (key === 'Home') return this.groupEdge('start');
    if (key === 'End') return this.groupEdge('end');
    if (key === 'PageUp') return 'previous-window';
    if (key === 'PageDown') return 'next-window';
    return null;
  }

  private stepGroup(delta: number): string | null {
    const groups = this.groups();
    if (groups.length === 0) return null;
    const current = this.keyboardDate();
    const index = groups.findIndex((group) => group.date === current);
    const next =
      groups[Math.min(groups.length - 1, Math.max(0, index + delta))];
    return next.date;
  }

  private groupEdge(edge: 'start' | 'end'): string | null {
    const groups = this.groups();
    if (groups.length === 0) return null;
    const edgeGroup = edge === 'start' ? groups.at(0) : groups.at(-1);
    return edgeGroup?.date ?? null;
  }
}
