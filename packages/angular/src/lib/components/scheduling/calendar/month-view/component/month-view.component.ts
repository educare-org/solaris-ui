import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  model,
  OnDestroy,
  output,
  signal,
} from '@angular/core';

import { nextIdFor } from '../../../../../core/utils/id';
import {
  getCalendarDays,
  localeFirstDay,
  todaySolarisDate,
} from '../../../../forms/date/model/date.utils';
import type { SolarisCalendarDay } from '../../../../forms/date/model/date.types';
import {
  SolarisPopoverDirective,
  SolarisPopoverTriggerDirective,
} from '../../../../interaction/popover';
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
  SolarisMonthViewDensity,
  SolarisMonthViewEventOpen,
  SolarisMonthViewItem,
  SolarisMonthViewSize,
} from '../model/month-view.types';

const MAX_SPAN_DAYS = 500;

const CALENDAR_FALLBACKS: Record<string, Record<string, string>> = {
  en: {
    more: '{{count}} more',
    dayItems: '{{date}}, {{count}} items',
    moreItems: '{{count}} more items on {{date}}',
    task: '{{title}}, task {{state}}',
    taskCompleted: 'completed',
    taskOpen: 'not completed',
  },
  pt: {
    more: 'Mais {{count}}',
    dayItems: '{{date}}, {{count}} itens',
    moreItems: '{{count}} itens a mais em {{date}}',
    task: '{{title}}, tarefa {{state}}',
    taskCompleted: 'concluída',
    taskOpen: 'não concluída',
  },
  es: {
    more: '{{count}} más',
    dayItems: '{{date}}, {{count}} eventos',
    moreItems: '{{count}} eventos más el {{date}}',
    task: '{{title}}, tarea {{state}}',
    taskCompleted: 'completada',
    taskOpen: 'no completada',
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

interface MonthRange {
  start: string;
  end: string;
}

interface EventSpan {
  occurrenceStart: string;
  startCivil: string;
  endCivil: string;
}

function defaultTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC';
  } catch {
    return 'UTC';
  }
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

function monthOf(value: string): { year: number; month: number } {
  const parts = parseSolarisDateParts(value);
  if (parts !== null) return { year: parts.year, month: parts.month - 1 };
  const today = parseSolarisDateParts(todaySolarisDate());
  if (today !== null) return { year: today.year, month: today.month - 1 };
  return { year: 1970, month: 0 };
}

function shiftCivilMonth(value: string, delta: number): string | null {
  const parts = parseSolarisDateParts(value);
  if (parts === null) return null;
  const index = parts.year * 12 + (parts.month - 1) + delta;
  const year = Math.floor(index / 12);
  const month = (index % 12) + 1;
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const day = Math.min(parts.day, lastDay);
  const paddedDay = String(day).padStart(2, '0');
  const paddedMonth = String(month).padStart(2, '0');
  return `${String(year).padStart(4, '0')}-${paddedMonth}-${paddedDay}`;
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
  range: MonthRange,
): EventSpan[] {
  if (event.recurrence === undefined) {
    const single = singleEventSpan(event, timeZone);
    return single === null ? [] : [single];
  }
  const startMs = parseSolarisDateTimeMs(event.start);
  const startValid =
    startMs !== null || parseSolarisDateParts(event.start) !== null;
  if (!startValid) return [];
  const occurrences = expandSolarisRecurrence({
    start: event.start,
    end: event.end,
    recurrence: event.recurrence,
    timeZone,
    rangeStart: range.start,
    rangeEnd: range.end,
  });
  const spans: EventSpan[] = [];
  for (const occurrence of occurrences) {
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
  if (!parseSolarisDateTimeMs(task.due)) return null;
  return toSolarisDateInZone(task.due, timeZone);
}

function itemWeight(item: SolarisMonthViewItem): number {
  if (item.kind === 'holiday') return 0;
  if (item.kind === 'event' && item.allDay) return 1;
  if (item.kind === 'event') return 2;
  return 3;
}

function compareMonthItems(
  first: SolarisMonthViewItem,
  second: SolarisMonthViewItem,
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
  selector: 'solaris-calendar-month-view',
  standalone: true,
  imports: [
    SolarisPopoverDirective,
    SolarisPopoverTriggerDirective,
    SolarisVisuallyHiddenDirective,
  ],
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-calendar-month-view',
    '[attr.data-density]': 'density()',
    '[attr.data-size]': 'size()',
  },
})
export class SolarisCalendarMonthViewComponent
  implements AfterViewInit, OnDestroy
{
  readonly focusedDate = model<string>(todaySolarisDate());
  readonly events = input<SolarisCalendarEvent[]>([]);
  readonly tasks = input<SolarisCalendarTask[]>([]);
  readonly holidays = input<SolarisHoliday[]>([]);
  readonly timeZone = input<string>(defaultTimeZone());
  readonly locale = input.required<string>();
  readonly weekStartsOn = input<SolarisCalendarWeekStart>();
  readonly showWeekends = input(true);
  readonly density = input<SolarisMonthViewDensity>('comfortable');
  readonly size = input<SolarisMonthViewSize>('md');
  readonly selectedId = input<string | null>(null);
  readonly maxVisiblePerDay = input(3);
  readonly moreLabel = input<string>();
  readonly moreLabelKey = input<string>();

  readonly daySelect = output<string>();
  readonly eventOpen = output<SolarisMonthViewEventOpen>();
  readonly moreOpen = output<string>();
  readonly taskToggle = output<string>();

  private readonly instanceId = nextIdFor('solaris-month-view');
  private readonly host = inject(ElementRef);
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  /**
   * Number of rows (chips + "more" button) that fit in the square cell.
   * `null` while unmeasured (SSR/tests): falls back to `maxVisiblePerDay`.
   */
  protected readonly fittedRows = signal<number | null>(null);
  private resizeObserver: ResizeObserver | null = null;
  private fitRaf: number | undefined;

  constructor() {
    effect(() => {
      this.columns();
      this.density();
      this.size();
      this.maxVisiblePerDay();
      this.buckets();
      this.scheduleFit();
    });
  }

  ngAfterViewInit(): void {
    this.scheduleFit();
    if (typeof ResizeObserver === 'undefined') return;
    this.resizeObserver = new ResizeObserver(() => {
      this.scheduleFit();
    });
    this.resizeObserver.observe(this.host.nativeElement as HTMLElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    if (
      this.fitRaf !== undefined &&
      typeof cancelAnimationFrame !== 'undefined'
    ) {
      cancelAnimationFrame(this.fitRaf);
      this.fitRaf = undefined;
    }
  }

  protected readonly announcement = signal('');
  protected readonly gridFocused = signal(false);

  protected readonly resolvedWeekStartsOn = computed(
    () => this.weekStartsOn() ?? localeFirstDay(this.locale()),
  );

  protected readonly viewMonth = computed(() => monthOf(this.focusedDate()));

  protected readonly allCells = computed<SolarisCalendarDay[]>(() =>
    getCalendarDays(this.viewMonth(), this.resolvedWeekStartsOn()),
  );

  protected readonly cells = computed<SolarisCalendarDay[]>(() => {
    if (this.showWeekends()) return this.allCells();
    return this.allCells().filter((cell) => !isWeekendCivil(cell.value));
  });

  protected readonly columns = computed(() => (this.showWeekends() ? 7 : 5));

  protected readonly rows = computed<SolarisCalendarDay[][]>(() => {
    const cells = this.cells();
    const width = this.columns();
    const weeks: SolarisCalendarDay[][] = [];
    for (let index = 0; index < cells.length; index += width) {
      weeks.push(cells.slice(index, index + width));
    }
    return weeks;
  });

  protected readonly weekdays = computed(() => {
    const formatter = new Intl.DateTimeFormat(this.locale(), {
      weekday: 'short',
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

  protected readonly monthLabel = computed(() => {
    const month = this.viewMonth();
    return new Intl.DateTimeFormat(this.locale(), {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(month.year, month.month, 1)));
  });

  protected readonly buckets = computed(() => {
    const buckets = new Map<string, SolarisMonthViewItem[]>();
    const cells = this.allCells();
    if (cells.length === 0) return buckets;
    const timeZone = this.timeZone();
    const range: MonthRange = {
      start: cells[0].value,
      end:
        addDaysToSolarisDate(cells[cells.length - 1].value, 1) ??
        cells[cells.length - 1].value,
    };
    const push = (date: string, item: SolarisMonthViewItem): void => {
      if (date < range.start || date >= range.end) return;
      const list = buckets.get(date);
      if (list === undefined) {
        buckets.set(date, [item]);
      } else {
        list.push(item);
      }
    };
    this.collectEvents(buckets, push, range, timeZone);
    this.collectTasks(buckets, push, timeZone);
    this.collectHolidays(buckets, push);
    for (const list of buckets.values()) {
      list.sort(compareMonthItems);
    }
    return buckets;
  });

  private collectEvents(
    buckets: Map<string, SolarisMonthViewItem[]>,
    push: (date: string, item: SolarisMonthViewItem) => void,
    range: MonthRange,
    timeZone: string,
  ): void {
    for (const event of this.events()) {
      const spans = expandEventSpans(event, timeZone, range);
      for (const span of spans) {
        const time = this.spanTime(span.occurrenceStart, span.startCivil);
        const sortKey = parseSolarisDateTimeMs(span.occurrenceStart) ?? 0;
        for (const date of spanDates(span.startCivil, span.endCivil)) {
          push(date, {
            kind: 'event',
            id: event.id,
            title: event.title,
            time,
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
    buckets: Map<string, SolarisMonthViewItem[]>,
    push: (date: string, item: SolarisMonthViewItem) => void,
    timeZone: string,
  ): void {
    for (const task of this.tasks()) {
      const due = taskDueCivil(task, timeZone);
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
    buckets: Map<string, SolarisMonthViewItem[]>,
    push: (date: string, item: SolarisMonthViewItem) => void,
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

  protected gridTemplate(): string {
    return `repeat(${this.columns()}, minmax(0, 1fr))`;
  }

  protected cellId(value: string): string {
    return `${this.instanceId}-day-${value}`;
  }

  protected activeDescendantId(): string | null {
    return this.cellId(this.focusedDate());
  }

  protected isActiveDay(value: string): boolean {
    return value === this.focusedDate();
  }

  protected isToday(value: string): boolean {
    return value === todaySolarisDate();
  }

  protected itemsFor(value: string): SolarisMonthViewItem[] {
    return this.buckets().get(value) ?? [];
  }

  protected visibleItems(value: string): SolarisMonthViewItem[] {
    const all = this.itemsFor(value);
    return all.slice(0, this.rowLimit(all.length));
  }

  protected hiddenItems(value: string): SolarisMonthViewItem[] {
    const all = this.itemsFor(value);
    return all.slice(this.rowLimit(all.length));
  }

  private rowLimit(total: number): number {
    const capacity = this.fittedRows();
    // Measured square cell wins: show everything that fits and only then
    // collapse the last row into the more button. While unmeasured
    // (SSR/tests) fall back to the consumer cap.
    if (capacity === null) return Math.max(0, this.maxVisiblePerDay());
    if (total <= capacity) return total;
    return Math.max(0, capacity - 1);
  }

  private scheduleFit(): void {
    if (typeof requestAnimationFrame === 'undefined') {
      this.fitToCell();
      return;
    }
    if (this.fitRaf !== undefined) cancelAnimationFrame(this.fitRaf);
    this.fitRaf = requestAnimationFrame(() => {
      this.fitRaf = undefined;
      this.fitToCell();
    });
  }

  private fitToCell(): void {
    if (typeof getComputedStyle === 'undefined') return;
    const host = this.host.nativeElement as HTMLElement | null;
    if (!host || typeof host.querySelector !== 'function') return;
    // The compact stylesheet drops the square cells: keep the consumer
    // `maxVisiblePerDay` cap there instead of fit-measuring.
    if (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(max-width: 480px)').matches
    ) {
      this.fittedRows.set(null);
      return;
    }
    const cell = host.querySelector(
      '.solaris-calendar-month-view__cell',
    ) as HTMLElement | null;
    if (!cell) return;
    const cellWidth = cell.getBoundingClientRect().width;
    if (!cellWidth) return;
    const cellStyles = getComputedStyle(cell);
    const padTop = Number.parseFloat(cellStyles.paddingTop) || 0;
    const padBottom = Number.parseFloat(cellStyles.paddingBottom) || 0;
    const cellGap = Number.parseFloat(cellStyles.rowGap || cellStyles.gap) || 0;
    const day = host.querySelector(
      '.solaris-calendar-month-view__day',
    ) as HTMLElement | null;
    const dayHeight = day?.getBoundingClientRect().height ?? 0;
    if (!dayHeight) return;
    const items = host.querySelector(
      '.solaris-calendar-month-view__items',
    ) as HTMLElement | null;
    const itemsStyles = items ? getComputedStyle(items) : null;
    const itemsGap = itemsStyles
      ? Number.parseFloat(itemsStyles.rowGap || itemsStyles.gap) || 0
      : 0;
    const chip = host.querySelector(
      '.solaris-calendar-month-view__chip',
    ) as HTMLElement | null;
    const chipHeight = chip?.getBoundingClientRect().height ?? 0;
    if (!chipHeight) return;
    // Square cell: height equals width (border-box), so derive capacity
    // from the measured width instead of the rendered (possibly stretched) height.
    const available = cellWidth - padTop - padBottom - dayHeight - cellGap;
    if (available <= 0) {
      this.fittedRows.set(1);
      return;
    }
    const capacity = Math.floor(
      (available + itemsGap) / (chipHeight + itemsGap),
    );
    this.fittedRows.set(Math.max(1, capacity));
  }

  protected itemKey(item: SolarisMonthViewItem): string {
    return `${item.kind}:${item.id ?? item.title}:${item.occurrenceStart}`;
  }

  protected isSelected(item: SolarisMonthViewItem): boolean {
    const selected = this.selectedId();
    return selected !== null && item.id === selected;
  }

  private resolveText(key: string, params: Record<string, string>): string {
    const service = this.translateService;
    if (service) return service.translate(key, params);
    const templates = CALENDAR_FALLBACKS[languageOf(this.locale())];
    const fallback = CALENDAR_FALLBACKS['en'];
    return renderTemplate(templates[key] ?? fallback[key], params);
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

  protected formatDay(value: string): string {
    return new Intl.DateTimeFormat(this.locale(), {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      timeZone: 'UTC',
    }).format(new Date(`${value}T00:00:00Z`));
  }

  protected dayAriaLabel(value: string): string {
    const formatted = this.formatDay(value);
    const count = this.itemsFor(value).length;
    if (count === 0) return formatted;
    return this.resolveText('solaris.calendar.dayItems', {
      date: formatted,
      count: `${count}`,
    });
  }

  protected chipAriaLabel(item: SolarisMonthViewItem): string {
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

  protected moreAriaLabel(value: string): string {
    const count = this.hiddenItems(value).length;
    return this.resolveText('solaris.calendar.moreItems', {
      count: `${count}`,
      date: this.formatDay(value),
    });
  }

  protected openDay(value: string): void {
    this.daySelect.emit(value);
    this.announcement.set(this.dayAriaLabel(value));
  }

  protected openEvent(item: SolarisMonthViewItem): void {
    if (item.id === null) return;
    this.eventOpen.emit({ id: item.id, start: item.occurrenceStart });
    this.announcement.set(this.chipAriaLabel(item));
  }

  protected openMore(value: string): void {
    this.moreOpen.emit(value);
    this.announcement.set(this.dayAriaLabel(value));
  }

  protected toggleTask(item: SolarisMonthViewItem): void {
    if (item.id === null) return;
    this.taskToggle.emit(item.id);
    this.announcement.set(this.chipAriaLabel(item));
  }

  protected activateItem(item: SolarisMonthViewItem): void {
    if (item.kind === 'task') {
      this.toggleTask(item);
    } else if (item.kind === 'event') {
      this.openEvent(item);
    } else {
      this.openDay(item.occurrenceStart);
    }
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
      target.closest('[data-chip]') !== null
    ) {
      return;
    }
    const current = this.focusedDate();
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openDay(current);
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
