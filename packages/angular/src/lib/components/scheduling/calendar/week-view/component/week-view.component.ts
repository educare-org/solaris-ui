import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';

import { nextIdFor } from '../../../../../core/utils/id';
import {
  localeFirstDay,
  todaySolarisDate,
} from '../../../../forms/date/model/date.utils';
import {
  SolarisPopoverDirective,
  SolarisPopoverTriggerDirective,
} from '../../../../interaction/popover';
import { SolarisTooltipDirective } from '../../../../interaction/tooltip';
import { SolarisVisuallyHiddenDirective } from '../../../../../services/accessibility/directives/visually-hidden.directive';
import { SolarisTranslateService } from '../../../../../services/translation';
import {
  addDaysToSolarisDate,
  getZonedWall,
  parseSolarisDateParts,
  parseSolarisDateTimeMs,
  resolveSolarisWallTimeMs,
  toSolarisDateInZone,
} from '../../model/calendar-datetime.utils';
import { expandSolarisRecurrence } from '../../model/recurrence.utils';
import type {
  SolarisCalendarEvent,
  SolarisCalendarTask,
  SolarisCalendarWeekStart,
  SolarisHoliday,
} from '../../model/calendar.types';
import {
  clipSpanToDay,
  layoutOverlappingSpans,
} from '../model/week-view-layout.utils';
import type {
  SolarisWeekViewAllDayItem,
  SolarisWeekViewBlock,
  SolarisWeekViewDensity,
  SolarisWeekViewEventOpen,
  SolarisWeekViewSize,
  SolarisWeekViewSlotSelect,
  SolarisWeekViewVisibleDays,
} from '../model/week-view.types';

const MS_PER_DAY = 86_400_000;
const HOURS_PER_DAY = 24;
const NOW_REFRESH_MS = 60_000;

const CALENDAR_FALLBACKS: Record<string, Record<string, string>> = {
  en: {
    more: '{{count}} more',
    dayItems: '{{date}}, {{count}} items',
    moreItems: '{{count}} more items on {{date}}',
    task: '{{title}}, task {{state}}',
    taskCompleted: 'completed',
    taskOpen: 'not completed',
    allDay: 'All day',
    nowLine: 'Current time',
    timedEvent: '{{timeRange}}, {{title}}',
    timeSlot: '{{date}} at {{time}}',
  },
  pt: {
    more: 'Mais {{count}}',
    dayItems: '{{date}}, {{count}} itens',
    moreItems: '{{count}} itens a mais em {{date}}',
    task: '{{title}}, tarefa {{state}}',
    taskCompleted: 'concluída',
    taskOpen: 'não concluída',
    allDay: 'Dia inteiro',
    nowLine: 'Hora atual',
    timedEvent: '{{timeRange}}, {{title}}',
    timeSlot: '{{date}} às {{time}}',
  },
  es: {
    more: '{{count}} más',
    dayItems: '{{date}}, {{count}} eventos',
    moreItems: '{{count}} eventos más el {{date}}',
    task: '{{title}}, tarea {{state}}',
    taskCompleted: 'completada',
    taskOpen: 'no completada',
    allDay: 'Todo el día',
    nowLine: 'Hora actual',
    timedEvent: '{{timeRange}}, {{title}}',
    timeSlot: '{{date}} a las {{time}}',
  },
};

function languageOf(locale: string): string {
  const base = locale.split('-')[0].toLowerCase();
  if (base === 'pt' || base === 'es') return base;
  return 'en';
}

function renderTemplate(
  template: string,
  params: Record<string, string>,
): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) => {
    const value = params[key];
    return value === undefined ? match : value;
  });
}

function defaultTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC';
  } catch {
    return 'UTC';
  }
}

function reducedMotionPreferred(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function civilWeekday(value: string): number | null {
  const parts = parseSolarisDateParts(value);
  if (parts === null) return null;
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day)).getUTCDay();
}

function isWeekendCivil(value: string): boolean {
  const weekday = civilWeekday(value);
  return weekday === 0 || weekday === 6;
}

function normalizeVisibleDays(value: unknown): SolarisWeekViewVisibleDays {
  if (value === 1 || value === 3 || value === 4 || value === 7) return value;
  return 7;
}

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function allDayWeight(item: SolarisWeekViewAllDayItem): number {
  if (item.kind === 'holiday') return 0;
  if (item.kind === 'event') return 1;
  return 2;
}

interface WeekDayColumn {
  date: string;
  blocks: SolarisWeekViewBlock[];
  allDay: SolarisWeekViewAllDayItem[];
  nowTop: number | null;
}

interface TimedPart {
  id: string;
  title: string;
  color: SolarisWeekViewBlock['color'];
  occurrenceStart: string;
  startMs: number;
  endMs: number;
}

interface FocusedSlot {
  date: string;
  hour: number;
}

@Component({
  selector: 'solaris-calendar-week-view',
  standalone: true,
  imports: [
    SolarisPopoverDirective,
    SolarisPopoverTriggerDirective,
    SolarisTooltipDirective,
    SolarisVisuallyHiddenDirective,
  ],
  templateUrl: './week-view.component.html',
  styleUrls: ['./week-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-calendar-week-view',
    '[attr.data-density]': 'density()',
    '[attr.data-size]': 'size()',
    '[attr.data-days]': 'laneCount()',
  },
})
export class SolarisCalendarWeekViewComponent implements OnInit, OnDestroy {
  readonly focusedDate = model<string>(todaySolarisDate());
  readonly visibleDays = input<SolarisWeekViewVisibleDays>(7);
  readonly events = input<SolarisCalendarEvent[]>([]);
  readonly tasks = input<SolarisCalendarTask[]>([]);
  readonly holidays = input<SolarisHoliday[]>([]);
  readonly timeZone = input<string>(defaultTimeZone());
  readonly locale = input.required<string>();
  readonly weekStartsOn = input<SolarisCalendarWeekStart>();
  readonly showWeekends = input(true);
  readonly density = input<SolarisWeekViewDensity>('comfortable');
  readonly size = input<SolarisWeekViewSize>('md');
  readonly selectedId = input<string | null>(null);
  readonly maxVisiblePerDay = input(3);
  readonly showAllDay = input(true);
  readonly moreLabel = input<string>();
  readonly moreLabelKey = input<string>();

  readonly daySelect = output<string>();
  readonly slotSelect = output<SolarisWeekViewSlotSelect>();
  readonly eventOpen = output<SolarisWeekViewEventOpen>();
  readonly moreOpen = output<string>();
  readonly taskToggle = output<string>();

  private readonly instanceId = nextIdFor('solaris-week-view');
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  protected readonly announcement = signal('');
  protected readonly gridFocused = signal(false);
  protected readonly nowMs = signal(Date.now());
  protected readonly focusedSlot = signal<FocusedSlot>({
    date: '',
    hour: 9,
  });
  private nowTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    effect(() => {
      const focus = this.focusedDate();
      if (!this.visibleDates().includes(focus)) return;
      const slot = this.focusedSlot();
      if (slot.date !== focus) this.focusedSlot.set({ ...slot, date: focus });
    });
  }

  ngOnInit(): void {
    if (reducedMotionPreferred()) return;
    this.nowTimer = setInterval(() => {
      this.nowMs.set(Date.now());
    }, NOW_REFRESH_MS);
  }

  ngOnDestroy(): void {
    if (this.nowTimer !== null) {
      clearInterval(this.nowTimer);
      this.nowTimer = null;
    }
  }

  protected readonly normalizedDays = computed(() =>
    normalizeVisibleDays(this.visibleDays()),
  );

  protected readonly resolvedWeekStartsOn = computed(
    () => this.weekStartsOn() ?? localeFirstDay(this.locale()),
  );

  protected readonly anchorDate = computed(() => {
    if (this.normalizedDays() === 7) {
      const weekday = civilWeekday(this.focusedDate());
      if (weekday === null) return this.focusedDate();
      const back = (weekday - this.resolvedWeekStartsOn() + 7) % 7;
      return (
        addDaysToSolarisDate(this.focusedDate(), -back) ?? this.focusedDate()
      );
    }
    return this.focusedDate();
  });

  protected readonly visibleDates = computed(() => {
    const count = this.normalizedDays();
    if (count === 7) return this.weekDates();
    const dates: string[] = [];
    let candidate: string | null = this.anchorDate();
    for (let guard = 0; guard < count + 8; guard += 1) {
      if (candidate === null || dates.length >= count) break;
      if (this.showWeekends() || !isWeekendCivil(candidate)) {
        dates.push(candidate);
      }
      candidate = addDaysToSolarisDate(candidate, 1);
    }
    return dates;
  });

  private weekDates(): string[] {
    const dates: string[] = [];
    let candidate: string | null = this.anchorDate();
    for (let guard = 0; guard < 7; guard += 1) {
      if (candidate === null) break;
      if (this.showWeekends() || !isWeekendCivil(candidate)) {
        dates.push(candidate);
      }
      candidate = addDaysToSolarisDate(candidate, 1);
    }
    return dates;
  }

  protected readonly hours = computed(() =>
    Array.from({ length: HOURS_PER_DAY }, (_, hour) => hour),
  );

  protected readonly todayInZone = computed(
    () => toSolarisDateInZone(this.nowMs(), this.timeZone()) ?? '',
  );

  protected readonly columns = computed<WeekDayColumn[]>(() => {
    const dates = this.visibleDates();
    const timeZone = this.timeZone();
    const result: WeekDayColumn[] = dates.map((date) => ({
      date,
      blocks: [],
      allDay: [],
      nowTop: null,
    }));
    if (dates.length === 0) return result;
    this.collectTimed(result, timeZone);
    this.collectAllDay(result, timeZone);
    this.applyNowLine(result, timeZone);
    return result;
  });

  protected readonly rangeLabel = computed(() => {
    const dates = this.visibleDates();
    if (dates.length === 0) return '';
    return `${this.formatDay(dates[0])} – ${this.formatDay(dates[dates.length - 1])}`;
  });

  protected readonly activeSlot = computed<FocusedSlot>(() => {
    const dates = this.visibleDates();
    const slot = this.focusedSlot();
    if (dates.includes(slot.date)) return slot;
    return { date: dates[0] ?? '', hour: slot.hour };
  });

  protected readonly laneCount = computed(() => this.visibleDates().length);

  protected readonly nowTop = computed<number | null>(() => {
    for (const column of this.columns()) {
      if (column.nowTop !== null) return column.nowTop;
    }
    return null;
  });

  private dayStartMs(date: string, timeZone: string): number | null {
    const parts = parseSolarisDateParts(date);
    if (parts === null) return null;
    return resolveSolarisWallTimeMs(timeZone, {
      ...parts,
      hour: 0,
      minute: 0,
      second: 0,
    });
  }

  private dayEndMs(date: string, timeZone: string): number | null {
    const next = addDaysToSolarisDate(date, 1);
    if (next === null) return null;
    const start = this.dayStartMs(next, timeZone);
    if (start !== null) return start;
    const fallback = this.dayStartMs(date, timeZone);
    return fallback === null ? null : fallback + MS_PER_DAY;
  }

  private timedOccurrences(
    event: SolarisCalendarEvent,
    rangeStart: string,
    rangeEnd: string,
    timeZone: string,
  ): Array<{ start: string; startMs: number; endMs: number }> {
    if (event.recurrence !== undefined) {
      const found: Array<{ start: string; startMs: number; endMs: number }> =
        [];
      for (const occurrence of expandSolarisRecurrence({
        start: event.start,
        end: event.end,
        recurrence: event.recurrence,
        timeZone,
        rangeStart,
        rangeEnd,
        exceptionDates: event.recurrenceExceptionDates,
      })) {
        const startMs = parseSolarisDateTimeMs(occurrence.start);
        const endMs = parseSolarisDateTimeMs(occurrence.end);
        if (startMs === null || endMs === null) continue;
        found.push({ start: occurrence.start, startMs, endMs });
      }
      return found;
    }
    const startMs = parseSolarisDateTimeMs(event.start);
    const endMs = parseSolarisDateTimeMs(event.end);
    if (startMs === null || endMs === null) return [];
    return [{ start: event.start, startMs, endMs }];
  }

  private isAllDayEvent(event: SolarisCalendarEvent): boolean {
    return (
      event.allDay === true || parseSolarisDateTimeMs(event.start) === null
    );
  }

  private eventSpanDates(
    event: SolarisCalendarEvent,
    timeZone: string,
  ): string[] {
    const startMs = parseSolarisDateTimeMs(event.start);
    const startCivil =
      startMs === null
        ? event.start
        : toSolarisDateInZone(event.start, timeZone);
    if (startCivil === null || parseSolarisDateParts(startCivil) === null) {
      return [];
    }
    const endMs =
      event.end === undefined ? null : parseSolarisDateTimeMs(event.end);
    const endCivil =
      endMs === null
        ? startCivil
        : (toSolarisDateInZone(event.end, timeZone) ?? startCivil);
    if (endCivil < startCivil) return [];
    const dates: string[] = [];
    let current: string | null = startCivil;
    for (let guard = 0; guard < 500; guard += 1) {
      if (current === null || current > endCivil) break;
      dates.push(current);
      current = addDaysToSolarisDate(current, 1);
    }
    return dates;
  }

  private collectTimed(result: WeekDayColumn[], timeZone: string): void {
    if (result.length === 0) return;
    const rangeStart = result[0].date;
    const rangeEnd =
      addDaysToSolarisDate(result[result.length - 1].date, 1) ??
      result[result.length - 1].date;
    const byDate = new Map<string, TimedPart[]>();
    for (const event of this.events()) {
      if (this.isAllDayEvent(event)) continue;
      for (const occurrence of this.timedOccurrences(
        event,
        rangeStart,
        rangeEnd,
        timeZone,
      )) {
        this.clipToColumns(byDate, result, event, occurrence, timeZone);
      }
    }
    for (const column of result) {
      const parts = (byDate.get(column.date) ?? [])
        .slice()
        .sort(
          (first, second) =>
            first.startMs - second.startMs ||
            first.endMs - second.endMs ||
            (first.title < second.title
              ? -1
              : first.title > second.title
                ? 1
                : 0),
        );
      const placements = layoutOverlappingSpans(parts);
      const start = this.dayStartMs(column.date, timeZone);
      const end = this.dayEndMs(column.date, timeZone);
      if (start === null || end === null || end <= start) continue;
      column.blocks = parts.map((part, index) => ({
        id: part.id,
        title: part.title,
        color: part.color,
        occurrenceStart: part.occurrenceStart,
        startMs: part.startMs,
        endMs: part.endMs,
        column: placements[index].column,
        columns: placements[index].columns,
      }));
    }
  }

  private clipToColumns(
    byDate: Map<string, TimedPart[]>,
    result: WeekDayColumn[],
    event: SolarisCalendarEvent,
    occurrence: { start: string; startMs: number; endMs: number },
    timeZone: string,
  ): void {
    for (const column of result) {
      const start = this.dayStartMs(column.date, timeZone);
      const end = this.dayEndMs(column.date, timeZone);
      if (start === null || end === null) continue;
      const clipped = clipSpanToDay(
        occurrence.startMs,
        occurrence.endMs,
        start,
        end,
      );
      if (clipped === null) continue;
      const list = byDate.get(column.date);
      const part: TimedPart = {
        id: event.id,
        title: event.title,
        color: event.color ?? 'info',
        occurrenceStart: occurrence.start,
        startMs: clipped.startMs,
        endMs: clipped.endMs,
      };
      if (list === undefined) byDate.set(column.date, [part]);
      else list.push(part);
    }
  }

  private collectAllDay(result: WeekDayColumn[], timeZone: string): void {
    if (!this.showAllDay()) return;
    const push = (date: string, item: SolarisWeekViewAllDayItem): void => {
      const column = result.find((entry) => entry.date === date);
      if (column === undefined) return;
      column.allDay.push(item);
    };
    for (const event of this.events()) {
      if (!this.isAllDayEvent(event)) continue;
      for (const date of this.eventSpanDates(event, timeZone)) {
        push(date, {
          kind: 'event',
          id: event.id,
          title: event.title,
          time: this.allDayTime(event.start),
          allDay: true,
          color: event.color ?? 'info',
          completed: false,
          occurrenceStart: event.start,
        });
      }
    }
    for (const task of this.tasks()) {
      const due = this.taskDue(task, timeZone);
      if (due === null) continue;
      push(due, {
        kind: 'task',
        id: task.id,
        title: task.title,
        time: null,
        allDay: true,
        color: task.completed ? 'success' : 'info',
        completed: task.completed,
        occurrenceStart: due,
      });
    }
    for (const holiday of this.holidays()) {
      if (parseSolarisDateParts(holiday.date) === null) continue;
      push(holiday.date, {
        kind: 'holiday',
        id: null,
        title: holiday.name,
        time: null,
        allDay: true,
        color: 'warning',
        completed: false,
        occurrenceStart: holiday.date,
      });
    }
    for (const column of result) {
      column.allDay.sort(
        (first, second) =>
          allDayWeight(first) - allDayWeight(second) ||
          (first.title < second.title
            ? -1
            : first.title > second.title
              ? 1
              : 0),
      );
    }
  }

  private allDayTime(start: string): string | null {
    const instant = parseSolarisDateTimeMs(start);
    if (instant === null) return null;
    return this.formatTime(instant);
  }

  private taskDue(task: SolarisCalendarTask, timeZone: string): string | null {
    if (parseSolarisDateParts(task.due) !== null) return task.due;
    if (parseSolarisDateTimeMs(task.due) === null) return null;
    return toSolarisDateInZone(task.due, timeZone);
  }

  private applyNowLine(result: WeekDayColumn[], timeZone: string): void {
    const today = this.todayInZone();
    const now = this.nowMs();
    for (const column of result) {
      if (column.date !== today) continue;
      const start = this.dayStartMs(column.date, timeZone);
      const end = this.dayEndMs(column.date, timeZone);
      if (start === null || end === null || end <= start) continue;
      if (now < start || now > end) continue;
      column.nowTop = ((now - start) / (end - start)) * 100;
    }
  }

  protected columnTemplate(): string {
    return `var(--solaris-calendar-week-view-gutter) repeat(${this.visibleDates().length}, minmax(0, 1fr))`;
  }

  protected laneTemplate(): string {
    return `repeat(${this.visibleDates().length}, minmax(0, 1fr))`;
  }

  protected slotId(date: string, hour: number): string {
    return `${this.instanceId}-slot-${date}-${pad2(hour)}`;
  }

  protected blockId(block: SolarisWeekViewBlock): string {
    return `${this.instanceId}-block-${block.id}-${block.startMs}`;
  }

  protected activeSlotId(): string {
    const slot = this.activeSlot();
    return this.slotId(slot.date, slot.hour);
  }

  protected isToday(date: string): boolean {
    return date === this.todayInZone();
  }

  protected hourLabel(hour: number): string {
    return new Intl.DateTimeFormat(this.locale(), {
      hour: 'numeric',
      hourCycle: 'h12',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(2026, 0, 1, hour)));
  }

  protected weekdayName(date: string): string {
    return new Intl.DateTimeFormat(this.locale(), {
      weekday: 'short',
      timeZone: 'UTC',
    }).format(new Date(`${date}T00:00:00Z`));
  }

  protected dayNumber(date: string): number {
    return parseSolarisDateParts(date)?.day ?? 0;
  }

  protected formatTime(instantMs: number): string {
    return new Intl.DateTimeFormat(this.locale(), {
      hour: 'numeric',
      minute: '2-digit',
      hourCycle: 'h12',
      timeZone: this.timeZone(),
    }).format(new Date(instantMs));
  }

  protected formatDay(value: string): string {
    return new Intl.DateTimeFormat(this.locale(), {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      timeZone: 'UTC',
    }).format(new Date(`${value}T00:00:00Z`));
  }

  protected blockTop(block: SolarisWeekViewBlock, date: string): number {
    const start = this.dayStartMs(date, this.timeZone());
    const end = this.dayEndMs(date, this.timeZone());
    if (start === null || end === null || end <= start) return 0;
    return ((block.startMs - start) / (end - start)) * 100;
  }

  protected blockHeight(block: SolarisWeekViewBlock, date: string): number {
    const start = this.dayStartMs(date, this.timeZone());
    const end = this.dayEndMs(date, this.timeZone());
    if (start === null || end === null || end <= start) return 0;
    return ((block.endMs - block.startMs) / (end - start)) * 100;
  }

  protected blockLeft(block: SolarisWeekViewBlock): number {
    return (block.column / block.columns) * 100;
  }

  protected blockWidth(block: SolarisWeekViewBlock): string {
    if (block.columns <= 1) return '100%';
    return `calc(${100 / block.columns}% - var(--solaris-calendar-week-view-block-gap))`;
  }

  protected isSelectedBlock(block: SolarisWeekViewBlock): boolean {
    const selected = this.selectedId();
    return selected !== null && block.id === selected;
  }

  protected isSelectedAllDay(item: SolarisWeekViewAllDayItem): boolean {
    const selected = this.selectedId();
    return selected !== null && item.id === selected;
  }

  protected visibleAllDay(date: string): SolarisWeekViewAllDayItem[] {
    const column = this.columns().find((entry) => entry.date === date);
    const all = column?.allDay ?? [];
    return all.slice(0, Math.max(0, this.maxVisiblePerDay()));
  }

  protected hiddenAllDay(date: string): SolarisWeekViewAllDayItem[] {
    const column = this.columns().find((entry) => entry.date === date);
    const all = column?.allDay ?? [];
    return all.slice(Math.max(0, this.maxVisiblePerDay()));
  }

  protected allDayItems(date: string): SolarisWeekViewAllDayItem[] {
    return this.columns().find((entry) => entry.date === date)?.allDay ?? [];
  }

  protected allDayKey(item: SolarisWeekViewAllDayItem): string {
    return `${item.kind}:${item.id ?? item.title}:${item.occurrenceStart}`;
  }

  private resolveText(key: string, params: Record<string, string>): string {
    const service = this.translateService;
    if (service) return service.translate(key, params);
    const templates = CALENDAR_FALLBACKS[languageOf(this.locale())];
    const fallback = CALENDAR_FALLBACKS['en'];
    return renderTemplate(templates[key] ?? fallback[key], params);
  }

  protected allDayLabel(): string {
    return this.resolveText('solaris.calendar.allDay', {});
  }

  protected nowLineLabel(): string {
    return this.resolveText('solaris.calendar.nowLine', {});
  }

  protected moreText(count: number): string {
    const direct = this.moreLabel();
    if (direct !== undefined) return direct;
    const params = { count: `${count}` };
    const key = this.moreLabelKey();
    if (key !== undefined && this.translateService) {
      return this.translateService.translate(key, params);
    }
    return this.resolveText('solaris.calendar.more', params);
  }

  protected dayAriaLabel(date: string): string {
    const formatted = this.formatDay(date);
    const count =
      (this.columns().find((entry) => entry.date === date)?.blocks.length ??
        0) + this.allDayItems(date).length;
    if (count === 0) return formatted;
    return this.resolveText('solaris.calendar.dayItems', {
      date: formatted,
      count: `${count}`,
    });
  }

  protected slotAriaLabel(date: string, hour: number): string {
    return this.resolveText('solaris.calendar.timeSlot', {
      date: this.formatDay(date),
      time: this.hourLabel(hour),
    });
  }

  protected slotTime(hour: number): string {
    return `${pad2(hour)}:00`;
  }

  protected blockAriaLabel(block: SolarisWeekViewBlock): string {
    return this.resolveText('solaris.calendar.timedEvent', {
      timeRange: `${this.formatTime(block.startMs)} – ${this.formatTime(block.endMs)}`,
      title: block.title,
    });
  }

  protected allDayAriaLabel(item: SolarisWeekViewAllDayItem): string {
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

  protected moreAriaLabel(date: string): string {
    const count = this.hiddenAllDay(date).length;
    return this.resolveText('solaris.calendar.moreItems', {
      count: `${count}`,
      date: this.formatDay(date),
    });
  }

  protected openDay(date: string): void {
    this.daySelect.emit(date);
    this.announcement.set(this.dayAriaLabel(date));
  }

  protected selectSlot(date: string, hour: number): void {
    const time = this.slotTime(hour);
    this.slotSelect.emit({ date, time });
    this.announcement.set(this.slotAriaLabel(date, hour));
  }

  protected openEvent(block: SolarisWeekViewBlock): void {
    this.eventOpen.emit({ id: block.id, start: block.occurrenceStart });
    this.announcement.set(this.blockAriaLabel(block));
  }

  protected openMore(date: string): void {
    this.moreOpen.emit(date);
    this.announcement.set(this.dayAriaLabel(date));
  }

  protected activateAllDay(
    item: SolarisWeekViewAllDayItem,
    date: string,
  ): void {
    if (item.kind === 'task') {
      this.toggleTask(item);
      return;
    }
    if (item.kind === 'event' && item.id !== null) {
      this.eventOpen.emit({ id: item.id, start: item.occurrenceStart });
      this.announcement.set(this.allDayAriaLabel(item));
      return;
    }
    this.openDay(date);
  }

  protected toggleTask(item: SolarisWeekViewAllDayItem): void {
    if (item.id === null) return;
    this.taskToggle.emit(item.id);
    this.announcement.set(this.allDayAriaLabel(item));
  }

  protected onGridFocus(): void {
    this.gridFocused.set(true);
  }

  protected onGridBlur(): void {
    this.gridFocused.set(false);
  }

  protected onGridKeydown(event: KeyboardEvent): void {
    const target = event.target;
    if (
      target instanceof HTMLElement &&
      target.closest('[data-event]') !== null
    ) {
      return;
    }
    const slot = this.activeSlot();
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectSlot(slot.date, slot.hour);
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.moveFocus(slot, -1, 0);
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.moveFocus(slot, 1, 0);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.moveFocus(slot, 0, -1);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.moveFocus(slot, 0, 1);
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      this.jumpEdge('start', slot.hour);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      this.jumpEdge('end', slot.hour);
      return;
    }
    if (event.key === 'PageUp') {
      event.preventDefault();
      this.moveFocus(slot, -7, 0);
      return;
    }
    if (event.key === 'PageDown') {
      event.preventDefault();
      this.moveFocus(slot, 7, 0);
    }
  }

  private moveFocus(
    slot: FocusedSlot,
    dayDelta: number,
    hourDelta: number,
  ): void {
    const hour = Math.min(
      HOURS_PER_DAY - 1,
      Math.max(0, slot.hour + hourDelta),
    );
    if (dayDelta === 0) {
      this.focusedSlot.set({ ...slot, hour });
      return;
    }
    const date = this.stepVisible(slot.date, dayDelta);
    if (date === null) {
      this.focusedSlot.set({ ...slot, hour });
      return;
    }
    this.focusedSlot.set({ date, hour });
    this.focusedDate.set(date);
  }

  private jumpEdge(edge: 'start' | 'end', hour: number): void {
    const dates = this.visibleDates();
    if (dates.length === 0) return;
    const date = edge === 'start' ? dates[0] : dates[dates.length - 1];
    this.focusedSlot.set({ date, hour });
    this.focusedDate.set(date);
  }

  private stepVisible(current: string, delta: number): string | null {
    const direction = delta < 0 ? -1 : 1;
    let candidate = addDaysToSolarisDate(current, delta);
    for (let guard = 0; guard < 9; guard += 1) {
      if (candidate === null) return null;
      if (this.showWeekends() || !isWeekendCivil(candidate)) return candidate;
      candidate = addDaysToSolarisDate(candidate, direction);
    }
    return null;
  }

  protected nowText(): string {
    const wall = getZonedWall(this.timeZone(), this.nowMs());
    return `${this.nowLineLabel()} ${pad2(wall.hour)}:${pad2(wall.minute)}`;
  }
}
