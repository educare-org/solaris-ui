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

import { nextIdFor } from '../../../../../core/utils/id';
import {
  localeFirstDay,
  todaySolarisDate,
} from '../../../../forms/date/model/date.utils';
import { SolarisVisuallyHiddenDirective } from '../../../../../services/accessibility/directives/visually-hidden.directive';
import { SolarisTranslateService } from '../../../../../services/translation';
import {
  addDaysToSolarisDate,
  parseSolarisDateParts,
  parseSolarisDateTimeMs,
  toSolarisDateInZone,
} from '../../model/calendar-datetime.utils';
import { expandSolarisRecurrence } from '../../model/recurrence.utils';
import type {
  SolarisCalendarEvent,
  SolarisCalendarTask,
  SolarisCalendarWeekStart,
  SolarisHoliday,
} from '../../model/calendar.types';
import type {
  SolarisYearViewDay,
  SolarisYearViewDensity,
  SolarisYearViewMonth,
  SolarisYearViewSize,
} from '../model/year-view.types';

const MAX_SPAN_DAYS = 500;
const MAX_DOTS = 3;

const CALENDAR_FALLBACKS: Record<string, Record<string, string>> = {
  en: {
    dayItems: '{{date}}, {{count}} items',
  },
  pt: {
    dayItems: '{{date}}, {{count}} itens',
  },
  es: {
    dayItems: '{{date}}, {{count}} eventos',
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

function pad2(value: number): string {
  return String(value).padStart(2, '0');
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

function yearOf(value: string): number {
  const parts = parseSolarisDateParts(value);
  if (parts !== null) return parts.year;
  const today = parseSolarisDateParts(todaySolarisDate());
  return today === null ? 1970 : today.year;
}

function shiftCivilMonth(value: string, delta: number): string | null {
  const parts = parseSolarisDateParts(value);
  if (parts === null) return null;
  const index = parts.year * 12 + (parts.month - 1) + delta;
  const year = Math.floor(index / 12);
  const month = (index % 12) + 1;
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const day = Math.min(parts.day, lastDay);
  return `${String(year).padStart(4, '0')}-${pad2(month)}-${pad2(day)}`;
}

function civilDateOf(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, '0')}-${pad2(month + 1)}-${pad2(day)}`;
}

function capitalizeFirst(value: string): string {
  if (value.length === 0) return value;
  return value.slice(0, 1).toUpperCase() + value.slice(1);
}

function monthCells(
  year: number,
  month: number,
  weekStart: number,
): string[][] {
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const prevDays = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const first = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const leading = (first - weekStart + 7) % 7;
  const cells: string[] = [];
  for (let index = 0; index < leading; index += 1) {
    cells.push(
      civilDateOf(prevYear, prevMonth, prevDays - leading + 1 + index),
    );
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(civilDateOf(year, month, day));
  }
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  let nextDay = 1;
  while (cells.length < 42) {
    cells.push(civilDateOf(nextYear, nextMonth, nextDay));
    nextDay += 1;
  }
  const weeks: string[][] = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }
  return weeks;
}

function visibleColumns(
  weeks: string[][],
  weekStart: number,
  showWeekends: boolean,
): string[][] {
  if (showWeekends) return weeks;
  return weeks.map((week) =>
    week.filter((_, index) => {
      const weekday = (weekStart + index) % 7;
      return weekday !== 0 && weekday !== 6;
    }),
  );
}

interface EventSpan {
  occurrenceStart: string;
  startCivil: string;
  endCivil: string;
}

function singleEventSpan(
  event: SolarisCalendarEvent,
  timeZone: string,
): EventSpan | null {
  const startMs = parseSolarisDateTimeMs(event.start);
  let startCivil: string | null = null;
  if (startMs !== null) {
    startCivil = toSolarisDateInZone(event.start, timeZone);
  } else if (parseSolarisDateParts(event.start) !== null) {
    startCivil = event.start;
  }
  if (startCivil === null) return null;
  if (event.end === undefined) {
    return { occurrenceStart: event.start, startCivil, endCivil: startCivil };
  }
  const endMs = parseSolarisDateTimeMs(event.end);
  const endCivil =
    endMs === null
      ? parseSolarisDateParts(event.end) !== null
        ? event.end
        : null
      : toSolarisDateInZone(event.end, timeZone);
  if (endCivil === null || endCivil < startCivil) return null;
  return { occurrenceStart: event.start, startCivil, endCivil };
}

function expandEventSpans(
  event: SolarisCalendarEvent,
  timeZone: string,
  rangeStart: string,
  rangeEnd: string,
): EventSpan[] {
  if (event.recurrence === undefined) {
    const single = singleEventSpan(event, timeZone);
    return single === null ? [] : [single];
  }
  const startMs = parseSolarisDateTimeMs(event.start);
  const startValid =
    startMs !== null || parseSolarisDateParts(event.start) !== null;
  if (!startValid) return [];
  const spans: EventSpan[] = [];
  for (const occurrence of expandSolarisRecurrence({
    start: event.start,
    end: event.end,
    recurrence: event.recurrence,
    timeZone,
    rangeStart,
    rangeEnd,
  })) {
    const occurrenceMs = parseSolarisDateTimeMs(occurrence.start);
    const startCivil =
      occurrenceMs === null
        ? occurrence.start
        : toSolarisDateInZone(occurrence.start, timeZone);
    if (startCivil === null) continue;
    const endMs = parseSolarisDateTimeMs(occurrence.end);
    const endCivil =
      endMs === null
        ? occurrence.start
        : (toSolarisDateInZone(occurrence.end, timeZone) ?? startCivil);
    spans.push({ occurrenceStart: occurrence.start, startCivil, endCivil });
  }
  return spans;
}

function spanDates(from: string, to: string): string[] {
  const dates: string[] = [];
  let current: string | null = from;
  let guard = 0;
  while (current !== null && current <= to && guard < MAX_SPAN_DAYS) {
    dates.push(current);
    current = addDaysToSolarisDate(current, 1);
    guard += 1;
  }
  return dates;
}

function taskDueCivil(
  task: SolarisCalendarTask,
  timeZone: string,
): string | null {
  if (parseSolarisDateParts(task.due) !== null) return task.due;
  if (parseSolarisDateTimeMs(task.due) === null) return null;
  return toSolarisDateInZone(task.due, timeZone);
}

@Component({
  selector: 'solaris-calendar-year-view',
  standalone: true,
  imports: [SolarisVisuallyHiddenDirective],
  templateUrl: './year-view.component.html',
  styleUrls: ['./year-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-calendar-year-view',
    '[attr.data-density]': 'density()',
    '[attr.data-size]': 'size()',
  },
})
export class SolarisCalendarYearViewComponent {
  readonly focusedDate = model<string>(todaySolarisDate());
  readonly events = input<SolarisCalendarEvent[]>([]);
  readonly tasks = input<SolarisCalendarTask[]>([]);
  readonly holidays = input<SolarisHoliday[]>([]);
  readonly timeZone = input<string>(defaultTimeZone());
  readonly locale = input.required<string>();
  readonly weekStartsOn = input<SolarisCalendarWeekStart>();
  readonly showWeekends = input(true);
  readonly density = input<SolarisYearViewDensity>('comfortable');
  readonly size = input<SolarisYearViewSize>('md');

  readonly daySelect = output<string>();

  private readonly instanceId = nextIdFor('solaris-year-view');
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  protected readonly announcement = signal('');
  protected readonly gridFocused = signal(false);

  protected readonly resolvedWeekStartsOn = computed(
    () => this.weekStartsOn() ?? localeFirstDay(this.locale()),
  );

  protected readonly viewYear = computed(() => yearOf(this.focusedDate()));

  protected readonly columns = computed(() => (this.showWeekends() ? 7 : 5));

  protected readonly weekdays = computed(() => {
    const formatter = new Intl.DateTimeFormat(this.locale(), {
      weekday: 'narrow',
      timeZone: 'UTC',
    });
    const sunday = new Date(Date.UTC(2023, 0, 1));
    const names = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(sunday);
      date.setUTCDate(sunday.getUTCDate() + index);
      return formatter.format(date);
    });
    const start = this.resolvedWeekStartsOn();
    const ordered = [...names.slice(start), ...names.slice(0, start)];
    if (this.showWeekends()) return ordered;
    return ordered.filter((_, index) => {
      const weekday = (start + index) % 7;
      return weekday !== 0 && weekday !== 6;
    });
  });

  protected readonly yearLabel = computed(() =>
    new Intl.DateTimeFormat(this.locale(), {
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(this.viewYear(), 0, 1))),
  );

  protected readonly counts = computed(() => {
    const totals = new Map<string, { total: number; holiday: boolean }>();
    const year = this.viewYear();
    const rangeStart = civilDateOf(year - 1, 11, 1);
    const rangeEnd = civilDateOf(year + 1, 1, 1);
    const bump = (date: string, holiday: boolean): void => {
      if (date < rangeStart || date >= rangeEnd) return;
      const entry = totals.get(date);
      if (entry === undefined) {
        totals.set(date, { total: 1, holiday });
      } else {
        entry.total += 1;
        entry.holiday = entry.holiday || holiday;
      }
    };
    const timeZone = this.timeZone();
    for (const event of this.events()) {
      for (const span of expandEventSpans(
        event,
        timeZone,
        rangeStart,
        rangeEnd,
      )) {
        for (const date of spanDates(span.startCivil, span.endCivil)) {
          bump(date, false);
        }
      }
    }
    for (const task of this.tasks()) {
      const due = taskDueCivil(task, timeZone);
      if (due !== null) bump(due, false);
    }
    for (const holiday of this.holidays()) {
      if (parseSolarisDateParts(holiday.date) === null) continue;
      bump(holiday.date, true);
    }
    return totals;
  });

  protected readonly months = computed<SolarisYearViewMonth[]>(() => {
    const year = this.viewYear();
    const weekStart = this.resolvedWeekStartsOn();
    const weekends = this.showWeekends();
    const totals = this.counts();
    const titleFormatter = new Intl.DateTimeFormat(this.locale(), {
      month: 'long',
      timeZone: 'UTC',
    });
    const labelFormatter = new Intl.DateTimeFormat(this.locale(), {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });
    return Array.from({ length: 12 }, (_, month) => {
      const prefix = `${String(year).padStart(4, '0')}-${pad2(month + 1)}`;
      const weeks = visibleColumns(
        monthCells(year, month, weekStart),
        weekStart,
        weekends,
      );
      return {
        year,
        month,
        label: labelFormatter.format(new Date(Date.UTC(year, month, 1))),
        title: capitalizeFirst(
          titleFormatter.format(new Date(Date.UTC(year, month, 1))),
        ),
        weeks: weeks.map((week) =>
          week.map((value) => {
            const entry = totals.get(value);
            return {
              value,
              total: entry?.total ?? 0,
              holiday: entry?.holiday ?? false,
              outside: !value.startsWith(prefix),
              color: entry !== undefined && entry.holiday ? 'warning' : null,
            } satisfies SolarisYearViewDay;
          }),
        ),
      };
    });
  });

  protected gridTemplate(): string {
    return `repeat(${this.columns()}, minmax(0, 1fr))`;
  }

  protected cellId(month: number, value: string): string {
    return `${this.instanceId}-m${month}-day-${value}`;
  }

  protected activeDescendantId(): string {
    return this.cellId(
      Number.parseInt(this.focusedDate().slice(5, 7), 10) - 1,
      this.focusedDate(),
    );
  }

  protected isActiveDay(value: string): boolean {
    return value === this.focusedDate();
  }

  protected isToday(value: string): boolean {
    return value === todaySolarisDate();
  }

  protected dayNumber(value: string): number {
    return parseSolarisDateParts(value)?.day ?? 0;
  }

  protected dotMarks(total: number): number[] {
    return Array.from({ length: Math.min(MAX_DOTS, Math.max(0, total)) });
  }

  private resolveText(key: string, params: Record<string, string>): string {
    const service = this.translateService;
    if (service) return service.translate(key, params);
    const templates = CALENDAR_FALLBACKS[languageOf(this.locale())];
    const fallback = CALENDAR_FALLBACKS['en'];
    return renderTemplate(templates[key] ?? fallback[key], params);
  }

  protected formatDay(value: string): string {
    return new Intl.DateTimeFormat(this.locale(), {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      timeZone: 'UTC',
    }).format(new Date(`${value}T00:00:00Z`));
  }

  protected dayAriaLabel(value: string, total: number): string {
    const formatted = this.formatDay(value);
    if (total === 0) return formatted;
    return this.resolveText('solaris.calendar.dayItems', {
      date: formatted,
      count: `${total}`,
    });
  }

  protected openDay(value: string, total: number): void {
    this.focusedDate.set(value);
    this.daySelect.emit(value);
    this.announcement.set(this.dayAriaLabel(value, total));
  }

  protected onGridFocus(): void {
    this.gridFocused.set(true);
  }

  protected onGridBlur(): void {
    this.gridFocused.set(false);
  }

  protected onGridKeydown(event: KeyboardEvent): void {
    const current = this.focusedDate();
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openDay(current, this.counts().get(current)?.total ?? 0);
      return;
    }
    const next = this.keyStep(current, event.key);
    if (next === null) return;
    event.preventDefault();
    this.focusedDate.set(next);
  }

  private keyStep(current: string, key: string): string | null {
    if (key === 'ArrowLeft') return this.stepVisible(current, -1);
    if (key === 'ArrowRight') return this.stepVisible(current, 1);
    if (key === 'ArrowUp') return this.stepVisible(current, -7);
    if (key === 'ArrowDown') return this.stepVisible(current, 7);
    if (key === 'Home') return this.weekEdge(current, 'start');
    if (key === 'End') return this.weekEdge(current, 'end');
    if (key === 'PageUp') return shiftCivilMonth(current, -1);
    if (key === 'PageDown') return shiftCivilMonth(current, 1);
    return null;
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

  private weekEdge(current: string, edge: 'start' | 'end'): string | null {
    const weekday = civilWeekday(current);
    if (weekday === null) return null;
    const start = this.resolvedWeekStartsOn();
    if (edge === 'start') {
      return this.stepVisible(current, -((weekday - start + 7) % 7));
    }
    return this.stepVisible(current, 6 - ((weekday - start + 7) % 7));
  }
}
