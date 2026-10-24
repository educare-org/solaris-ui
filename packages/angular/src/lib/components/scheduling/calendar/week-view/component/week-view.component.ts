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
  OnInit,
  output,
  signal,
  viewChildren,
} from '@angular/core';

import { nextIdFor } from '../../../../../core';
import {
  localeFirstDay,
  todaySolarisDate,
} from '../../../../forms/date/model/date.utils';
import {
  SolarisPopoverDirective,
  SolarisPopoverTriggerDirective,
} from '../../../../interaction/popover';
import { SolarisTooltipDirective } from '../../../../interaction/tooltip';
import { SolarisVisuallyHiddenDirective } from '../../../../../services/accessibility';
import { SolarisTranslateService } from '../../../../../services/translation';
import {
  addDaysToSolarisDate,
  defaultSolarisTimeZone,
  getZonedWall,
  isSolarisWeekend,
  parseSolarisDateParts,
  parseSolarisDateTimeMs,
  resolveSolarisWallTimeMs,
  solarisCivilWeekday,
  toSolarisDateInZone,
} from '../../model/calendar-datetime.utils';
import { resolveCalendarFallback } from '../../model/strings/calendar-strings';
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
  SolarisCalendarEventCreateProposal,
  SolarisCalendarEventMoveProposal,
  SolarisCalendarEventResizeProposal,
} from '../../model/calendar-drag.types';
import {
  buildMonthCreateProposal,
  buildMonthMoveProposal,
  buildWeekCreateProposal,
  buildWeekMoveProposal,
  buildWeekResizeProposal,
  diffSolarisCivilDays,
  normalizeDragSnapStep,
  snapMinutesToStep,
} from '../../model/calendar-drag.utils';
import type {
  SolarisWeekDayColumn,
  SolarisWeekDragCandidate,
  SolarisWeekDragSession,
  SolarisWeekFocusedSlot,
  SolarisWeekGhostSegment,
  SolarisWeekTimedPart,
  SolarisWeekViewAllDayItem,
  SolarisWeekViewBlock,
  SolarisWeekViewDensity,
  SolarisWeekViewEventOpen,
  SolarisWeekViewSize,
  SolarisWeekViewSlotSelect,
  SolarisWeekViewVisibleDays,
} from '../model/week-view.types';
import {
  allDayWeight,
  normalizeVisibleDays,
  reducedMotionPreferred,
  WEEK_VIEW_DRAG_ACTIVATION_PX,
  WEEK_VIEW_HOURS_PER_DAY,
  WEEK_VIEW_MS_PER_DAY,
  WEEK_VIEW_NOW_REFRESH_MS,
  weekViewPad2,
} from '../model/week-view.utils';

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
    '[attr.data-size]': 'size()',
    '[attr.data-days]': 'laneCount()',
    '[attr.data-density]': 'density()',
    class: 'solaris-calendar-week-view',
    '[attr.data-dragging]': 'dragSession() ? "" : null',
    '[attr.data-resizing]': 'resizeActive() ? "" : null',
  },
})
export class SolarisCalendarWeekViewComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  readonly visibleDays = input<SolarisWeekViewVisibleDays>(7);
  readonly density = input<SolarisWeekViewDensity>('comfortable');
  readonly weekStartsOn = input<SolarisCalendarWeekStart>();
  readonly size = input<SolarisWeekViewSize>('md');
  readonly events = input<SolarisCalendarEvent[]>([]);
  readonly selectedId = input<string | null>(null);
  readonly tasks = input<SolarisCalendarTask[]>([]);
  readonly timeZone = input<string>(defaultSolarisTimeZone());
  readonly focusedDate = model<string>(todaySolarisDate());
  readonly holidays = input<SolarisHoliday[]>([]);
  readonly dragDisabled = input(false);
  readonly maxVisiblePerDay = input(3);
  readonly snapStepMinutes = input(30);
  readonly moreLabelKey = input<string>();
  readonly showWeekends = input(true);
  readonly showAllDay = input(true);
  readonly moreLabel = input<string>();
  readonly locale = input.required<string>();

  readonly moreOpen = output<string>();
  readonly daySelect = output<string>();
  readonly taskToggle = output<string>();
  readonly eventOpen = output<SolarisWeekViewEventOpen>();
  readonly slotSelect = output<SolarisWeekViewSlotSelect>();
  readonly eventMove = output<SolarisCalendarEventMoveProposal>();
  readonly eventResize = output<SolarisCalendarEventResizeProposal>();
  readonly eventCreate = output<SolarisCalendarEventCreateProposal>();

  private readonly instanceId = nextIdFor('solaris-week-view');
  private readonly host = inject(ElementRef);
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  protected readonly announcement = signal('');
  protected readonly gridFocused = signal(false);
  protected readonly fittedAllDayRows = signal<number | null>(null);
  private allDayResizeObserver: ResizeObserver | null = null;
  private allDayFitRaf: number | undefined;
  protected readonly nowMs = signal(Date.now());
  protected readonly focusedSlot = signal<SolarisWeekFocusedSlot>({
    date: '',
    hour: 9,
  });
  private nowTimer: ReturnType<typeof setInterval> | null = null;

  protected readonly dragSession = signal<SolarisWeekDragSession | null>(null);
  private readonly blockTooltips = viewChildren(SolarisTooltipDirective);
  private dragCandidate: SolarisWeekDragCandidate | null = null;
  private dragSuppressClick = false;
  private dragMoveListener: ((event: PointerEvent) => void) | null = null;
  private dragUpListener: ((event: PointerEvent) => void) | null = null;
  private dragCancelListener: (() => void) | null = null;
  private dragKeyListener: ((event: KeyboardEvent) => void) | null = null;

  protected readonly normalizedStep = computed(() =>
    normalizeDragSnapStep(this.snapStepMinutes()),
  );

  protected resizeActive(): boolean {
    return this.dragSession()?.mode === 'resize';
  }

  constructor() {
    effect(() => {
      const focus = this.focusedDate();
      if (!this.visibleDates().includes(focus)) return;
      const slot = this.focusedSlot();
      if (slot.date !== focus) this.focusedSlot.set({ ...slot, date: focus });
    });
    effect(() => {
      this.columns();
      this.density();
      this.size();
      this.maxVisiblePerDay();
      this.scheduleAllDayFit();
    });
  }

  ngOnInit(): void {
    if (reducedMotionPreferred()) return;
    this.nowTimer = setInterval(() => {
      this.nowMs.set(Date.now());
    }, WEEK_VIEW_NOW_REFRESH_MS);
  }

  ngAfterViewInit(): void {
    this.scheduleAllDayFit();
    if (typeof ResizeObserver === 'undefined') return;
    this.allDayResizeObserver = new ResizeObserver(() => {
      this.scheduleAllDayFit();
    });
    this.allDayResizeObserver.observe(this.host.nativeElement as HTMLElement);
  }

  ngOnDestroy(): void {
    if (this.nowTimer !== null) {
      clearInterval(this.nowTimer);
      this.nowTimer = null;
    }
    this.detachDragListeners();
    this.allDayResizeObserver?.disconnect();
    this.allDayResizeObserver = null;
    if (
      this.allDayFitRaf !== undefined &&
      typeof cancelAnimationFrame !== 'undefined'
    ) {
      cancelAnimationFrame(this.allDayFitRaf);
      this.allDayFitRaf = undefined;
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
      const weekday = solarisCivilWeekday(this.focusedDate());
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
      if (this.showWeekends() || !isSolarisWeekend(candidate)) {
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
      if (this.showWeekends() || !isSolarisWeekend(candidate)) {
        dates.push(candidate);
      }
      candidate = addDaysToSolarisDate(candidate, 1);
    }
    return dates;
  }

  protected readonly hours = computed(() =>
    Array.from({ length: WEEK_VIEW_HOURS_PER_DAY }, (_, hour) => hour),
  );

  protected readonly todayInZone = computed(
    () => toSolarisDateInZone(this.nowMs(), this.timeZone()) ?? '',
  );

  protected readonly columns = computed<SolarisWeekDayColumn[]>(() => {
    const dates = this.visibleDates();
    const timeZone = this.timeZone();
    const result: SolarisWeekDayColumn[] = dates.map((date) => ({
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
    const first = dates.at(0);
    const last = dates.at(-1);
    if (first === undefined || last === undefined) return '';
    return `${this.formatDay(first)} – ${this.formatDay(last)}`;
  });

  protected readonly activeSlot = computed<SolarisWeekFocusedSlot>(() => {
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
    return fallback === null ? null : fallback + WEEK_VIEW_MS_PER_DAY;
  }

  private timedOccurrences(
    event: SolarisCalendarEvent,
    rangeStart: string,
    rangeEnd: string,
    timeZone: string,
  ): Array<{ start: string; end: string; startMs: number; endMs: number }> {
    if (event.recurrence !== undefined) {
      const found: Array<{
        start: string;
        end: string;
        startMs: number;
        endMs: number;
      }> = [];
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
        found.push({
          start: occurrence.start,
          end: occurrence.end,
          startMs,
          endMs,
        });
      }
      return found;
    }
    const startMs = parseSolarisDateTimeMs(event.start);
    const endMs = parseSolarisDateTimeMs(event.end);
    if (startMs === null || endMs === null) return [];
    return [{ start: event.start, end: event.end, startMs, endMs }];
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

  private compareTitles(first: string, second: string): number {
    if (first < second) return -1;
    if (first > second) return 1;
    return 0;
  }

  private collectTimed(result: SolarisWeekDayColumn[], timeZone: string): void {
    const firstColumn = result.at(0);
    const lastColumn = result.at(-1);
    if (firstColumn === undefined || lastColumn === undefined) return;
    const rangeStart = firstColumn.date;
    const rangeEnd =
      addDaysToSolarisDate(lastColumn.date, 1) ?? lastColumn.date;
    const byDate = new Map<string, SolarisWeekTimedPart[]>();
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
            this.compareTitles(first.title, second.title),
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
        occurrenceEnd: part.occurrenceEnd,
        startMs: part.startMs,
        endMs: part.endMs,
        column: placements[index].column,
        columns: placements[index].columns,
      }));
    }
  }

  private clipToColumns(
    byDate: Map<string, SolarisWeekTimedPart[]>,
    result: SolarisWeekDayColumn[],
    event: SolarisCalendarEvent,
    occurrence: { start: string; end: string; startMs: number; endMs: number },
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
      const part: SolarisWeekTimedPart = {
        id: event.id,
        title: event.title,
        color: event.color ?? 'info',
        occurrenceStart: occurrence.start,
        occurrenceEnd: occurrence.end,
        startMs: clipped.startMs,
        endMs: clipped.endMs,
      };
      if (list === undefined) byDate.set(column.date, [part]);
      else list.push(part);
    }
  }

  private collectAllDay(
    result: SolarisWeekDayColumn[],
    timeZone: string,
  ): void {
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
          this.compareTitles(first.title, second.title),
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

  private applyNowLine(result: SolarisWeekDayColumn[], timeZone: string): void {
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
    return `${this.instanceId}-slot-${date}-${weekViewPad2(hour)}`;
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
    const all = this.allDayItems(date);
    return all.slice(0, this.allDayLimit(all.length));
  }

  protected hiddenAllDay(date: string): SolarisWeekViewAllDayItem[] {
    const all = this.allDayItems(date);
    const limit = this.allDayLimit(all.length);
    return limit >= all.length ? [] : all.slice(limit);
  }

  private allDayLimit(total: number): number {
    const measured = this.fittedAllDayRows();
    const capacity = measured ?? Math.max(0, this.maxVisiblePerDay());
    if (total <= capacity) return total;
    return Math.max(0, capacity - 1);
  }

  private scheduleAllDayFit(): void {
    if (typeof requestAnimationFrame === 'undefined') {
      this.fitAllDayRows();
      return;
    }
    if (this.allDayFitRaf !== undefined)
      cancelAnimationFrame(this.allDayFitRaf);
    this.allDayFitRaf = requestAnimationFrame(() => {
      this.allDayFitRaf = undefined;
      this.fitAllDayRows();
    });
  }

  private fitAllDayRows(): void {
    if (typeof getComputedStyle === 'undefined') return;
    const host = this.host.nativeElement as HTMLElement | null;
    if (!host || typeof host.querySelector !== 'function') return;
    const cell = host.querySelector(
      '.solaris-calendar-week-view__allday-cell',
    ) as HTMLElement | null;
    if (!cell) return;
    const cellStyles = getComputedStyle(cell);
    const budget = Number.parseFloat(cellStyles.maxHeight) || 0;
    if (budget <= 0) return;
    const gap = Number.parseFloat(cellStyles.rowGap || cellStyles.gap) || 0;
    const chip = host.querySelector(
      '.solaris-calendar-week-view__chip',
    ) as HTMLElement | null;
    if (!chip) return;
    const chipHeight = chip.getBoundingClientRect().height;
    if (!chipHeight) return;
    this.fittedAllDayRows.set(
      Math.max(1, Math.floor((budget + gap) / (chipHeight + gap))),
    );
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
    return resolveCalendarFallback(this.locale(), key, params);
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
    return `${weekViewPad2(hour)}:00`;
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

  protected timedGhostFor(
    date: string,
  ): { top: number; height: number } | null {
    return (
      this.timedGhostSegments().find((segment) => segment.date === date) ?? null
    );
  }

  protected timedGhostText(): string {
    const session = this.dragSession();
    if (session === null || session.allDay) return '';
    const range = this.dragRangeMs(session);
    if (range === null) return '';
    return this.timedLabel(range.startMs, range.endMs, null);
  }

  protected timedGhostMode(): string | null {
    return this.dragSession()?.mode ?? null;
  }

  protected allDayGhostDate(): string | null {
    const session = this.dragSession();
    if (!session?.allDay) return null;
    return session.currentDate;
  }

  protected allDayGhostText(): string {
    const session = this.dragSession();
    if (!session?.allDay) return '';
    return this.dragLabel(session);
  }

  protected isBlockDragSource(block: SolarisWeekViewBlock): boolean {
    const session = this.dragSession();
    return (
      session !== null &&
      session.mode !== 'create' &&
      session.eventId === block.id &&
      session.occurrenceStart === block.occurrenceStart
    );
  }

  protected isAllDayDragSource(item: SolarisWeekViewAllDayItem): boolean {
    const session = this.dragSession();
    return (
      session !== null &&
      session.allDay &&
      session.mode === 'move' &&
      session.eventId === item.id &&
      session.occurrenceStart === item.occurrenceStart
    );
  }

  protected isDragLane(date: string): boolean {
    const session = this.dragSession();
    if (session === null || session.allDay) return false;
    return session.currentDate === date;
  }

  protected timedGhostSegments(): SolarisWeekGhostSegment[] {
    const session = this.dragSession();
    if (session === null || session.allDay) return [];
    const range = this.dragRangeMs(session);
    if (range === null) return [];
    const timeZone = this.timeZone();
    const segments: SolarisWeekGhostSegment[] = [];
    for (const date of this.visibleDates()) {
      const start = this.dayStartMs(date, timeZone);
      const end = this.dayEndMs(date, timeZone);
      if (start === null || end === null || end <= start) continue;
      const segStart = Math.max(range.startMs, start);
      const segEnd = Math.min(range.endMs, end);
      if (segEnd <= segStart) continue;
      segments.push({
        date,
        top: ((segStart - start) / (end - start)) * 100,
        height: ((segEnd - segStart) / (end - start)) * 100,
      });
    }
    return segments;
  }

  private dragRangeMs(
    session: SolarisWeekDragSession,
  ): { startMs: number; endMs: number } | null {
    const endpoints = this.dragRangeEndpoints(session);
    if (endpoints === null) return null;
    const startMs = parseSolarisDateTimeMs(endpoints.start);
    const endMs = parseSolarisDateTimeMs(endpoints.end);
    if (startMs === null || endMs === null || endMs <= startMs) return null;
    return { startMs, endMs };
  }

  private dragRangeEndpoints(
    session: SolarisWeekDragSession,
  ): { start: string; end: string } | null {
    const created = this.createRangeEndpoints(session);
    if (created !== null) return created;
    const existing = this.existingRangeEndpoints(session);
    if (existing !== null) return existing;
    const fallbackStart = session.occurrenceStart;
    const fallbackEnd = session.occurrenceEnd;
    if (fallbackStart === null || fallbackEnd === null) return null;
    return { start: fallbackStart, end: fallbackEnd };
  }

  private createRangeEndpoints(
    session: SolarisWeekDragSession,
  ): { start: string; end: string } | null {
    if (session.mode !== 'create' || session.allDay) return null;
    const proposal = buildWeekCreateProposal({
      anchorDate: session.anchorDate,
      anchorMinutes: session.anchorMinutes,
      currentDate: session.currentDate,
      currentMinutes: session.currentMinutes,
      stepMinutes: this.normalizedStep(),
      timeZone: this.timeZone(),
    });
    if (proposal === null) return null;
    return { start: proposal.start, end: proposal.end };
  }

  private existingRangeEndpoints(
    session: SolarisWeekDragSession,
  ): { start: string; end: string } | null {
    if (
      session.eventId === null ||
      session.occurrenceStart === null ||
      session.occurrenceEnd === null
    ) {
      return null;
    }
    const record = this.findDragEvent(session.eventId);
    if (record === null || session.allDay) return null;
    if (session.mode === 'move')
      return this.moveRangeEndpoints(session, record);
    return this.resizeRangeEndpoints(session, record);
  }

  private moveRangeEndpoints(
    session: SolarisWeekDragSession,
    record: SolarisCalendarEvent,
  ): { start: string; end: string } | null {
    const dayDelta = diffSolarisCivilDays(
      session.anchorDate,
      session.currentDate,
    );
    if (dayDelta === null || session.occurrenceStart === null) return null;
    if (session.occurrenceEnd === null) return null;
    const proposal = buildWeekMoveProposal({
      event: record,
      occurrenceStart: session.occurrenceStart,
      occurrenceEnd: session.occurrenceEnd,
      dayDelta,
      minuteDelta: session.currentMinutes - session.anchorMinutes,
      timeZone: this.timeZone(),
    });
    if (proposal === null) return null;
    return { start: proposal.start, end: proposal.end };
  }

  private resizeRangeEndpoints(
    session: SolarisWeekDragSession,
    record: SolarisCalendarEvent,
  ): { start: string; end: string } | null {
    if (session.edge === null) return null;
    if (session.occurrenceStart === null || session.occurrenceEnd === null) {
      return null;
    }
    const dayDelta = diffSolarisCivilDays(
      session.anchorDate,
      session.currentDate,
    );
    if (dayDelta === null) return null;
    const proposal = buildWeekResizeProposal({
      event: record,
      occurrenceStart: session.occurrenceStart,
      occurrenceEnd: session.occurrenceEnd,
      edge: session.edge,
      minuteDelta: session.currentMinutes - session.anchorMinutes,
      dayDelta,
      minMinutes: this.normalizedStep(),
      timeZone: this.timeZone(),
    });
    if (proposal === null) return null;
    return { start: proposal.start, end: proposal.end };
  }

  private dragLabel(session: SolarisWeekDragSession): string {
    if (!session.allDay) {
      const range = this.dragRangeMs(session);
      if (range === null) return session.title;
      return this.timedLabel(range.startMs, range.endMs, session.title);
    }
    if (session.mode === 'move') {
      return `${session.title}, ${this.formatDay(session.currentDate)}`;
    }
    const [low = session.anchorDate, high = session.currentDate] = [
      session.anchorDate,
      session.currentDate,
    ].sort((first, second) => this.compareTitles(first, second));
    const range =
      low === high
        ? this.formatDay(low)
        : `${this.formatDay(low)} – ${this.formatDay(high)}`;
    return session.title === '' ? range : `${session.title}, ${range}`;
  }

  private timedLabel(
    startMs: number,
    endMs: number,
    title: string | null,
  ): string {
    const timeZone = this.timeZone();
    const startDate = toSolarisDateInZone(startMs, timeZone) ?? '';
    const endDate = toSolarisDateInZone(endMs, timeZone) ?? '';
    const dayPart =
      startDate === endDate
        ? this.formatDay(startDate)
        : `${this.formatDay(startDate)} – ${this.formatDay(endDate)}`;
    const base = `${dayPart}, ${this.formatTime(startMs)} – ${this.formatTime(endMs)}`;
    return title === null || title === '' ? base : `${title}, ${base}`;
  }

  private instantLabel(value: string): string {
    const instant = parseSolarisDateTimeMs(value);
    if (instant === null) {
      return parseSolarisDateParts(value) !== null
        ? this.formatDay(value)
        : value;
    }
    return this.timedLabel(instant, instant, null);
  }

  private findDragEvent(id: string): SolarisCalendarEvent | null {
    return this.events().find((event) => event.id === id) ?? null;
  }

  private consumeSuppressClick(): boolean {
    if (!this.dragSuppressClick) return false;
    this.dragSuppressClick = false;
    return true;
  }

  private snapMinutes(minutes: number): number {
    return snapMinutesToStep(minutes, this.normalizedStep());
  }

  private minutesFromPointer(
    cell: HTMLElement | null,
    hour: number,
    clientY: number,
  ): number | null {
    if (cell === null) return hour * 60;
    const rect = cell.getBoundingClientRect();
    if (rect.height <= 0) return hour * 60;
    const offset = ((clientY ?? 0) - rect.top) / rect.height;
    return Math.min(1_440, Math.max(0, Math.round(hour * 60 + offset * 60)));
  }

  private slotTargetFromPoint(
    clientX: number,
    clientY: number,
  ): { date: string; minutes: number } | null {
    if (typeof document === 'undefined') return null;
    const element = document.elementFromPoint(clientX, clientY);
    if (!(element instanceof HTMLElement)) return null;
    const cell = element.closest('.solaris-calendar-week-view__slotcell');
    if (!(cell instanceof HTMLElement)) return null;
    const date = cell.getAttribute('data-date');
    const hourRaw = cell.getAttribute('data-hour');
    if (date === null || parseSolarisDateParts(date) === null) return null;
    const hour = hourRaw === null ? 0 : Number(hourRaw);
    if (!Number.isInteger(hour) || hour < 0 || hour > 23) return null;
    const minutes = this.minutesFromPointer(cell, hour, clientY);
    if (minutes === null) return null;
    return { date, minutes: this.snapMinutes(minutes) };
  }

  private allDayTargetFromPoint(
    clientX: number,
    clientY: number,
  ): string | null {
    if (typeof document === 'undefined') return null;
    const element = document.elementFromPoint(clientX, clientY);
    if (!(element instanceof HTMLElement)) return null;
    const cell = element.closest('.solaris-calendar-week-view__allday-cell');
    if (!(cell instanceof HTMLElement)) return null;
    const date = cell.getAttribute('data-date');
    if (date === null || parseSolarisDateParts(date) === null) return null;
    return date;
  }

  protected onSlotPointerDown(
    event: PointerEvent,
    date: string,
    hour: number,
  ): void {
    if (
      this.dragDisabled() ||
      this.dragSession() !== null ||
      this.dragCandidate !== null
    ) {
      return;
    }
    if (!event.isPrimary) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const cell = event.currentTarget;
    if (!(cell instanceof HTMLElement)) return;
    const minutes = this.minutesFromPointer(cell, hour, event.clientY ?? 0);
    if (minutes === null) return;
    this.armDragCandidate({
      origin: 'pointer',
      mode: 'create',
      allDay: false,
      anchorDate: date,
      anchorMinutes: this.snapMinutes(minutes),
      currentDate: date,
      currentMinutes: this.snapMinutes(minutes),
      edge: null,
      eventId: null,
      occurrenceStart: null,
      occurrenceEnd: null,
      title: '',
      pointerId: event.pointerId,
      startX: event.clientX ?? 0,
      startY: event.clientY ?? 0,
    });
  }

  protected onAllDayCellPointerDown(event: PointerEvent, date: string): void {
    if (
      this.dragDisabled() ||
      this.dragSession() !== null ||
      this.dragCandidate !== null
    ) {
      return;
    }
    if (!event.isPrimary) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest('button,[data-ghost]') !== null) return;
    this.armDragCandidate({
      origin: 'pointer',
      mode: 'create',
      allDay: true,
      anchorDate: date,
      anchorMinutes: 0,
      currentDate: date,
      currentMinutes: 0,
      edge: null,
      eventId: null,
      occurrenceStart: null,
      occurrenceEnd: null,
      title: '',
      pointerId: event.pointerId,
      startX: event.clientX ?? 0,
      startY: event.clientY ?? 0,
    });
  }

  protected onBlockPointerDown(
    event: PointerEvent,
    block: SolarisWeekViewBlock,
    date: string,
  ): void {
    if (
      this.dragDisabled() ||
      this.dragSession() !== null ||
      this.dragCandidate !== null
    ) {
      return;
    }
    if (!event.isPrimary) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-edge]') !== null) return;
    if (this.findDragEvent(block.id) === null) return;
    event.stopPropagation();
    this.armDragCandidate({
      origin: 'pointer',
      mode: 'move',
      allDay: false,
      anchorDate: date,
      anchorMinutes: this.snapMinutes(
        this.wallMinutes(block.startMs, this.timeZone()),
      ),
      currentDate: date,
      currentMinutes: this.snapMinutes(
        this.wallMinutes(block.startMs, this.timeZone()),
      ),
      edge: null,
      eventId: block.id,
      occurrenceStart: block.occurrenceStart,
      occurrenceEnd: block.occurrenceEnd,
      title: block.title,
      pointerId: event.pointerId,
      startX: event.clientX ?? 0,
      startY: event.clientY ?? 0,
    });
  }

  protected onAllDayChipPointerDown(
    event: PointerEvent,
    item: SolarisWeekViewAllDayItem,
    date: string,
  ): void {
    if (
      this.dragDisabled() ||
      item.kind !== 'event' ||
      item.id === null ||
      this.dragSession() !== null ||
      this.dragCandidate !== null
    ) {
      return;
    }
    if (!event.isPrimary) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (this.findDragEvent(item.id) === null) return;
    event.stopPropagation();
    this.armDragCandidate({
      origin: 'pointer',
      mode: 'move',
      allDay: true,
      anchorDate: date,
      anchorMinutes: 0,
      currentDate: date,
      currentMinutes: 0,
      edge: null,
      eventId: item.id,
      occurrenceStart: item.occurrenceStart,
      occurrenceEnd: item.occurrenceStart,
      title: item.title,
      pointerId: event.pointerId,
      startX: event.clientX ?? 0,
      startY: event.clientY ?? 0,
    });
  }

  protected onResizePointerDown(
    event: PointerEvent,
    block: SolarisWeekViewBlock,
    edge: 'start' | 'end',
  ): void {
    if (
      this.dragDisabled() ||
      this.dragSession() !== null ||
      this.dragCandidate !== null
    ) {
      return;
    }
    if (!event.isPrimary) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (this.findDragEvent(block.id) === null) return;
    event.stopPropagation();
    event.preventDefault();
    const edgeValue =
      edge === 'start' ? block.occurrenceStart : block.occurrenceEnd;
    const edgeMs = parseSolarisDateTimeMs(edgeValue);
    if (edgeMs === null) return;
    const timeZone = this.timeZone();
    this.armDragCandidate({
      origin: 'pointer',
      mode: 'resize',
      allDay: false,
      anchorDate: toSolarisDateInZone(edgeMs, timeZone) ?? '',
      anchorMinutes: this.wallMinutes(edgeMs, timeZone),
      currentDate: toSolarisDateInZone(edgeMs, timeZone) ?? '',
      currentMinutes: this.snapMinutes(this.wallMinutes(edgeMs, timeZone)),
      edge,
      eventId: block.id,
      occurrenceStart: block.occurrenceStart,
      occurrenceEnd: block.occurrenceEnd,
      title: block.title,
      pointerId: event.pointerId,
      startX: event.clientX ?? 0,
      startY: event.clientY ?? 0,
    });
  }

  private wallMinutes(instantMs: number, timeZone: string): number {
    const wall = getZonedWall(timeZone, instantMs);
    return wall.hour * 60 + wall.minute;
  }

  protected onBlockKeydown(
    event: KeyboardEvent,
    block: SolarisWeekViewBlock,
    date: string,
  ): void {
    if (this.dragDisabled()) return;
    const session = this.dragSession();
    if (session !== null) {
      if (
        session.origin !== 'keyboard' ||
        session.eventId !== block.id ||
        session.occurrenceStart !== block.occurrenceStart
      ) {
        return;
      }
      event.preventDefault();
      if (event.key === 'Enter' || event.key === ' ') {
        this.commitDragSession();
        return;
      }
      if (event.key === 'Escape') {
        this.cancelDragSession();
        return;
      }
      this.stepKeyboardSession(session, event.key);
      return;
    }
    if (
      event.key !== 'ArrowLeft' &&
      event.key !== 'ArrowRight' &&
      event.key !== 'ArrowUp' &&
      event.key !== 'ArrowDown'
    ) {
      return;
    }
    const record = this.findDragEvent(block.id);
    if (record === null) return;
    event.preventDefault();
    if (event.shiftKey) {
      this.startKeyboardResize(record, block);
    } else {
      this.startKeyboardMove(record, block, date);
    }
    const started = this.dragSession();
    if (started === null) return;
    this.stepKeyboardSession(started, event.key);
  }

  protected onAllDayChipKeydown(
    event: KeyboardEvent,
    item: SolarisWeekViewAllDayItem,
    date: string,
  ): void {
    if (this.dragDisabled() || item.kind !== 'event' || item.id === null) {
      return;
    }
    const session = this.dragSession();
    if (session !== null) {
      this.handleAllDayDragKey(event, session, item);
      return;
    }
    this.startAllDayKeyboardMove(event, item, date);
  }

  private handleAllDayDragKey(
    event: KeyboardEvent,
    session: SolarisWeekDragSession,
    item: SolarisWeekViewAllDayItem,
  ): void {
    if (
      session.origin !== 'keyboard' ||
      !session.allDay ||
      session.eventId !== item.id ||
      session.occurrenceStart !== item.occurrenceStart
    ) {
      return;
    }
    event.preventDefault();
    if (event.key === 'Enter' || event.key === ' ') {
      this.commitDragSession();
      return;
    }
    if (event.key === 'Escape') {
      this.cancelDragSession();
      return;
    }
    this.stepAllDaySession(session, event.key);
  }

  private stepAllDaySession(
    session: SolarisWeekDragSession,
    key: string,
  ): void {
    if (key !== 'ArrowLeft' && key !== 'ArrowRight') return;
    const next = this.stepVisible(
      session.currentDate,
      key === 'ArrowLeft' ? -1 : 1,
    );
    if (next === null) return;
    const updated = { ...session, currentDate: next };
    this.dragSession.set(updated);
    this.announceDragChange(updated);
  }

  private announceDragChange(session: SolarisWeekDragSession): void {
    this.announcement.set(
      this.resolveText('solaris.calendar.dragChange', {
        label: this.dragLabel(session),
      }),
    );
  }

  private startAllDayKeyboardMove(
    event: KeyboardEvent,
    item: SolarisWeekViewAllDayItem,
    date: string,
  ): void {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    if (item.id === null) return;
    const record = this.findDragEvent(item.id);
    if (record === null) return;
    event.preventDefault();
    this.activateDragSession(
      {
        origin: 'keyboard',
        mode: 'move',
        allDay: true,
        anchorDate: date,
        anchorMinutes: 0,
        currentDate: date,
        currentMinutes: 0,
        edge: null,
        eventId: item.id,
        occurrenceStart: item.occurrenceStart,
        occurrenceEnd: item.occurrenceStart,
        title: item.title,
      },
      'keyboard',
    );
    const next = this.stepVisible(date, event.key === 'ArrowLeft' ? -1 : 1);
    if (next === null) return;
    const started = this.dragSession();
    if (started === null) return;
    const updated = { ...started, currentDate: next };
    this.dragSession.set(updated);
    this.announceDragChange(updated);
  }

  private startKeyboardMove(
    record: SolarisCalendarEvent,
    block: SolarisWeekViewBlock,
    date: string,
  ): void {
    const timeZone = this.timeZone();
    const civil = toSolarisDateInZone(block.occurrenceStart, timeZone) ?? date;
    this.activateDragSession(
      {
        origin: 'keyboard',
        mode: 'move',
        allDay: false,
        anchorDate: civil,
        anchorMinutes: this.wallMinutes(block.startMs, timeZone),
        currentDate: civil,
        currentMinutes: this.snapMinutes(
          this.wallMinutes(block.startMs, timeZone),
        ),
        edge: null,
        eventId: record.id,
        occurrenceStart: block.occurrenceStart,
        occurrenceEnd: block.occurrenceEnd,
        title: block.title,
      },
      'keyboard',
    );
  }

  private startKeyboardResize(
    record: SolarisCalendarEvent,
    block: SolarisWeekViewBlock,
  ): void {
    const timeZone = this.timeZone();
    const edgeMs = parseSolarisDateTimeMs(block.occurrenceEnd);
    if (edgeMs === null) return;
    const civil = toSolarisDateInZone(edgeMs, timeZone) ?? '';
    const minutes = this.wallMinutes(edgeMs, timeZone);
    this.activateDragSession(
      {
        origin: 'keyboard',
        mode: 'resize',
        allDay: false,
        anchorDate: civil,
        anchorMinutes: minutes,
        currentDate: civil,
        currentMinutes: this.snapMinutes(minutes),
        edge: 'end',
        eventId: record.id,
        occurrenceStart: block.occurrenceStart,
        occurrenceEnd: block.occurrenceEnd,
        title: block.title,
      },
      'keyboard',
    );
  }

  private stepKeyboardSession(
    session: SolarisWeekDragSession,
    key: string,
  ): void {
    const step = this.normalizedStep();
    let currentDate = session.currentDate;
    let currentMinutes = session.currentMinutes;
    if (key === 'ArrowLeft') {
      currentDate = this.stepVisible(currentDate, -1) ?? currentDate;
    } else if (key === 'ArrowRight') {
      currentDate = this.stepVisible(currentDate, 1) ?? currentDate;
    } else if (key === 'ArrowUp') {
      currentMinutes -= step;
    } else if (key === 'ArrowDown') {
      currentMinutes += step;
    } else {
      return;
    }
    currentMinutes = Math.min(1_440, Math.max(0, currentMinutes));
    const updated = { ...session, currentDate, currentMinutes };
    this.dragSession.set(updated);
    this.announcement.set(
      this.resolveText('solaris.calendar.dragChange', {
        label: this.dragLabel(updated),
      }),
    );
  }

  private activateDragSession(
    candidate: Omit<
      SolarisWeekDragCandidate,
      'pointerId' | 'startX' | 'startY'
    >,
    origin: 'pointer' | 'keyboard',
  ): void {
    this.clearNativeSelection();
    const session: SolarisWeekDragSession = {
      origin,
      mode: candidate.mode,
      allDay: candidate.allDay,
      anchorDate: candidate.anchorDate,
      anchorMinutes: candidate.anchorMinutes,
      currentDate: candidate.currentDate,
      currentMinutes: candidate.currentMinutes,
      edge: candidate.edge,
      eventId: candidate.eventId,
      occurrenceStart: candidate.occurrenceStart,
      occurrenceEnd: candidate.occurrenceEnd,
      title: candidate.title,
    };
    this.dragSession.set(session);
    this.closeBlockTooltips();
    if (session.mode === 'create') {
      this.announcement.set(
        this.resolveText('solaris.calendar.dragCreateStart', {
          start: this.dragLabel({
            ...session,
            currentDate: session.anchorDate,
            currentMinutes: session.anchorMinutes,
          }),
          end: this.dragLabel({
            ...session,
            currentDate: session.anchorDate,
            currentMinutes: session.anchorMinutes,
          }),
        }),
      );
    } else if (session.mode === 'move') {
      this.announcement.set(
        this.resolveText('solaris.calendar.dragMoveStart', {
          title: session.title,
          start: this.dragLabel(session),
        }),
      );
    } else {
      this.announcement.set(
        this.resolveText('solaris.calendar.dragResizeStart', {
          title: session.title,
          start: this.dragLabel(session),
        }),
      );
    }
  }

  private clearNativeSelection(): void {
    if (typeof window === 'undefined') return;
    const selection = window.getSelection?.();
    if (selection && !selection.isCollapsed) {
      selection.removeAllRanges();
    }
  }

  private closeBlockTooltips(): void {
    for (const tooltip of this.blockTooltips()) tooltip.close();
  }

  private armDragCandidate(
    candidate:
      | SolarisWeekDragCandidate
      | (Omit<SolarisWeekDragCandidate, 'pointerId' | 'startX' | 'startY'> & {
          pointerId: number;
          startX: number;
          startY: number;
        }),
  ): void {
    this.dragCandidate = candidate as SolarisWeekDragCandidate;
    if (typeof window === 'undefined') return;
    this.dragMoveListener = (event: PointerEvent) => {
      this.onDragPointerMove(event);
    };
    this.dragUpListener = (event: PointerEvent) => {
      this.onDragPointerUp(event);
    };
    this.dragCancelListener = () => {
      this.cancelDragSession();
    };
    this.dragKeyListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.cancelDragSession();
      }
    };
    window.addEventListener('pointermove', this.dragMoveListener);
    window.addEventListener('pointerup', this.dragUpListener);
    window.addEventListener('pointercancel', this.dragCancelListener);
    window.addEventListener('keydown', this.dragKeyListener);
  }

  private detachDragListeners(): void {
    if (typeof window === 'undefined') return;
    if (this.dragMoveListener !== null) {
      window.removeEventListener('pointermove', this.dragMoveListener);
      this.dragMoveListener = null;
    }
    if (this.dragUpListener !== null) {
      window.removeEventListener('pointerup', this.dragUpListener);
      this.dragUpListener = null;
    }
    if (this.dragCancelListener !== null) {
      window.removeEventListener('pointercancel', this.dragCancelListener);
      this.dragCancelListener = null;
    }
    if (this.dragKeyListener !== null) {
      window.removeEventListener('keydown', this.dragKeyListener);
      this.dragKeyListener = null;
    }
  }

  private onDragPointerMove(event: PointerEvent): void {
    const candidate = this.dragCandidate;
    if (candidate === null || !event.isPrimary) return;
    if (event.pointerId !== candidate.pointerId) return;
    if (this.dragSession() === null) {
      const movedX = (event.clientX ?? 0) - candidate.startX;
      const movedY = (event.clientY ?? 0) - candidate.startY;
      if (Math.hypot(movedX, movedY) < WEEK_VIEW_DRAG_ACTIVATION_PX) return;
      this.activateDragSession(candidate, 'pointer');
    }
    this.updateDragTarget(event.clientX ?? 0, event.clientY ?? 0);
  }

  private updateDragTarget(clientX: number, clientY: number): void {
    const session = this.dragSession();
    if (session === null) return;
    if (session.allDay) {
      const date = this.allDayTargetFromPoint(clientX, clientY);
      if (date === null || date === session.currentDate) return;
      const updated = { ...session, currentDate: date };
      this.dragSession.set(updated);
      this.announcement.set(
        this.resolveText('solaris.calendar.dragChange', {
          label: this.dragLabel(updated),
        }),
      );
      return;
    }
    const target = this.slotTargetFromPoint(clientX, clientY);
    if (target === null) return;
    if (
      target.date === session.currentDate &&
      target.minutes === session.currentMinutes
    ) {
      return;
    }
    const updated = {
      ...session,
      currentDate: target.date,
      currentMinutes: target.minutes,
    };
    this.dragSession.set(updated);
    this.announcement.set(
      this.resolveText('solaris.calendar.dragChange', {
        label: this.dragLabel(updated),
      }),
    );
  }

  private onDragPointerUp(event: PointerEvent): void {
    if (this.dragCandidate === null || !event.isPrimary) return;
    if (event.pointerId !== this.dragCandidate.pointerId) return;
    if (this.dragSession() === null) {
      this.detachDragListeners();
      this.dragCandidate = null;
      return;
    }
    this.commitDragSession();
  }

  private commitDragSession(): void {
    const session = this.dragSession();
    this.detachDragListeners();
    this.dragCandidate = null;
    this.dragSession.set(null);
    if (session === null) return;
    this.dragSuppressClick = true;
    if (session.mode === 'create') {
      this.commitCreateSession(session);
      return;
    }
    this.commitExistingSession(session);
  }

  private commitCreateSession(session: SolarisWeekDragSession): void {
    if (session.allDay) this.commitCreateAllDay(session);
    else this.commitCreateTimed(session);
  }

  private commitCreateAllDay(session: SolarisWeekDragSession): void {
    const proposal = buildMonthCreateProposal(
      session.anchorDate,
      session.currentDate,
    );
    if (proposal === null) {
      this.announceDragCancel();
      return;
    }
    this.eventCreate.emit(proposal);
    this.announcement.set(
      this.resolveText('solaris.calendar.dragCreateCommit', {
        start: this.formatDay(proposal.start),
        end: this.formatDay(proposal.end),
      }),
    );
  }

  private commitCreateTimed(session: SolarisWeekDragSession): void {
    const proposal = buildWeekCreateProposal({
      anchorDate: session.anchorDate,
      anchorMinutes: session.anchorMinutes,
      currentDate: session.currentDate,
      currentMinutes: session.currentMinutes,
      stepMinutes: this.normalizedStep(),
      timeZone: this.timeZone(),
    });
    if (proposal === null) {
      this.announceDragCancel();
      return;
    }
    this.eventCreate.emit(proposal);
    this.announcement.set(
      this.resolveText('solaris.calendar.dragCreateCommit', {
        start: this.instantLabel(proposal.start),
        end: this.instantLabel(proposal.end),
      }),
    );
  }

  private commitExistingSession(session: SolarisWeekDragSession): void {
    const record =
      session.eventId === null ? null : this.findDragEvent(session.eventId);
    if (
      record === null ||
      session.occurrenceStart === null ||
      session.occurrenceEnd === null
    ) {
      this.announceDragCancel();
      return;
    }
    if (session.allDay) {
      this.commitAllDayMove(session, record);
      return;
    }
    if (session.mode === 'move') {
      this.commitTimedMove(session, record);
      return;
    }
    this.commitTimedResize(session, record);
  }

  private commitAllDayMove(
    session: SolarisWeekDragSession,
    record: SolarisCalendarEvent,
  ): void {
    if (session.occurrenceStart === null) {
      this.announceDragCancel();
      return;
    }
    const proposal = buildMonthMoveProposal({
      event: record,
      occurrenceStart: session.occurrenceStart,
      targetDate: session.currentDate,
      originDate: session.anchorDate,
      timeZone: this.timeZone(),
    });
    if (proposal === null) {
      this.announceDragCancel();
      return;
    }
    this.eventMove.emit(proposal);
    this.announcement.set(
      this.resolveText('solaris.calendar.dragMoveCommit', {
        title: session.title,
        label: this.formatDay(session.currentDate),
      }),
    );
  }

  private commitTimedMove(
    session: SolarisWeekDragSession,
    record: SolarisCalendarEvent,
  ): void {
    if (session.occurrenceStart === null || session.occurrenceEnd === null) {
      this.announceDragCancel();
      return;
    }
    const dayDelta = diffSolarisCivilDays(
      session.anchorDate,
      session.currentDate,
    );
    if (dayDelta === null) {
      this.announceDragCancel();
      return;
    }
    const proposal = buildWeekMoveProposal({
      event: record,
      occurrenceStart: session.occurrenceStart,
      occurrenceEnd: session.occurrenceEnd,
      dayDelta,
      minuteDelta: session.currentMinutes - session.anchorMinutes,
      timeZone: this.timeZone(),
    });
    if (proposal === null) {
      this.announceDragCancel();
      return;
    }
    this.eventMove.emit(proposal);
    this.announcement.set(
      this.resolveText('solaris.calendar.dragMoveCommit', {
        title: session.title,
        label: this.commitRangeLabel(
          proposal.start,
          proposal.end,
          session.currentDate,
        ),
      }),
    );
  }

  private commitTimedResize(
    session: SolarisWeekDragSession,
    record: SolarisCalendarEvent,
  ): void {
    if (
      session.edge === null ||
      session.occurrenceStart === null ||
      session.occurrenceEnd === null
    ) {
      this.announceDragCancel();
      return;
    }
    const dayDelta = diffSolarisCivilDays(
      session.anchorDate,
      session.currentDate,
    );
    if (dayDelta === null) {
      this.announceDragCancel();
      return;
    }
    const proposal = buildWeekResizeProposal({
      event: record,
      occurrenceStart: session.occurrenceStart,
      occurrenceEnd: session.occurrenceEnd,
      edge: session.edge,
      minuteDelta: session.currentMinutes - session.anchorMinutes,
      dayDelta,
      minMinutes: this.normalizedStep(),
      timeZone: this.timeZone(),
    });
    if (proposal === null) {
      this.announceDragCancel();
      return;
    }
    this.eventResize.emit(proposal);
    this.announcement.set(
      this.resolveText('solaris.calendar.dragResizeCommit', {
        title: session.title,
        label: this.commitRangeLabel(
          proposal.start,
          proposal.end,
          session.currentDate,
        ),
      }),
    );
  }

  private commitRangeLabel(
    start: string,
    end: string,
    fallbackDate: string,
  ): string {
    const startMs = parseSolarisDateTimeMs(start);
    const endMs = parseSolarisDateTimeMs(end);
    if (startMs !== null && endMs !== null) {
      return this.timedLabel(startMs, endMs, null);
    }
    return this.formatDay(fallbackDate);
  }

  private announceDragCancel(): void {
    this.announcement.set(this.resolveText('solaris.calendar.dragCancel', {}));
  }

  private cancelDragSession(): void {
    const hadSession = this.dragSession() !== null;
    this.detachDragListeners();
    this.dragCandidate = null;
    this.dragSession.set(null);
    if (!hadSession) return;
    this.dragSuppressClick = true;
    this.announcement.set(this.resolveText('solaris.calendar.dragCancel', {}));
  }

  protected openDay(date: string): void {
    if (this.consumeSuppressClick()) return;
    this.daySelect.emit(date);
    this.announcement.set(this.dayAriaLabel(date));
  }

  protected selectSlot(date: string, hour: number): void {
    if (this.consumeSuppressClick()) return;
    const time = this.slotTime(hour);
    this.slotSelect.emit({ date, time });
    this.announcement.set(this.slotAriaLabel(date, hour));
  }

  protected openEvent(block: SolarisWeekViewBlock): void {
    if (this.consumeSuppressClick()) return;
    this.eventOpen.emit({ id: block.id, start: block.occurrenceStart });
    this.announcement.set(this.blockAriaLabel(block));
  }

  protected openMore(date: string): void {
    if (this.consumeSuppressClick()) return;
    this.moreOpen.emit(date);
    this.announcement.set(this.dayAriaLabel(date));
  }

  protected activateAllDay(
    item: SolarisWeekViewAllDayItem,
    date: string,
  ): void {
    if (this.consumeSuppressClick()) return;
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
    if (this.consumeSuppressClick()) return;
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
    if (this.isEventTarget(event.target)) return;
    const session = this.dragSession();
    if (session !== null && session.origin === 'keyboard' && !session.allDay) {
      this.handleActiveKeyboardDrag(event, session);
      return;
    }
    this.handleGridShortcut(event);
  }

  private isEventTarget(target: EventTarget | null): boolean {
    return (
      target instanceof HTMLElement && target.closest('[data-event]') !== null
    );
  }

  private isArrowKey(key: string): boolean {
    return (
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'ArrowUp' ||
      key === 'ArrowDown'
    );
  }

  private handleActiveKeyboardDrag(
    event: KeyboardEvent,
    session: SolarisWeekDragSession,
  ): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.commitDragSession();
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelDragSession();
      return;
    }
    if (session.mode !== 'create') return;
    this.stepKeyboardCreate(event.key);
    if (this.isArrowKey(event.key)) event.preventDefault();
  }

  private handleGridShortcut(event: KeyboardEvent): void {
    const slot = this.activeSlot();
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectSlot(slot.date, slot.hour);
      return;
    }
    if (this.tryStartKeyboardCreate(event, slot)) return;
    this.moveGridFocus(event, slot);
  }

  private tryStartKeyboardCreate(
    event: KeyboardEvent,
    slot: SolarisWeekFocusedSlot,
  ): boolean {
    if (this.dragDisabled() || !event.shiftKey || !this.isArrowKey(event.key)) {
      return false;
    }
    event.preventDefault();
    this.startKeyboardCreate(slot);
    this.stepKeyboardCreate(event.key);
    return true;
  }

  private moveGridFocus(
    event: KeyboardEvent,
    slot: SolarisWeekFocusedSlot,
  ): void {
    const moves: Record<string, () => void> = {
      ArrowLeft: () => this.moveFocus(slot, -1, 0),
      ArrowRight: () => this.moveFocus(slot, 1, 0),
      ArrowUp: () => this.moveFocus(slot, 0, -1),
      ArrowDown: () => this.moveFocus(slot, 0, 1),
      Home: () => this.jumpEdge('start', slot.hour),
      End: () => this.jumpEdge('end', slot.hour),
      PageUp: () => this.moveFocus(slot, -7, 0),
      PageDown: () => this.moveFocus(slot, 7, 0),
    };
    const move = moves[event.key];
    if (move === undefined) return;
    event.preventDefault();
    move();
  }

  private startKeyboardCreate(slot: SolarisWeekFocusedSlot): void {
    const anchorMinutes = this.snapMinutes(slot.hour * 60);
    this.activateDragSession(
      {
        origin: 'keyboard',
        mode: 'create',
        allDay: false,
        anchorDate: slot.date,
        anchorMinutes,
        currentDate: slot.date,
        currentMinutes: anchorMinutes,
        edge: null,
        eventId: null,
        occurrenceStart: null,
        occurrenceEnd: null,
        title: '',
      },
      'keyboard',
    );
  }

  private stepKeyboardCreate(key: string): void {
    const session = this.dragSession();
    if (session?.mode !== 'create' || session.allDay) {
      return;
    }
    const step = this.normalizedStep();
    let currentDate = session.currentDate;
    let currentMinutes = session.currentMinutes;
    if (key === 'ArrowLeft') {
      currentDate = this.stepVisible(currentDate, -1) ?? currentDate;
    } else if (key === 'ArrowRight') {
      currentDate = this.stepVisible(currentDate, 1) ?? currentDate;
    } else if (key === 'ArrowUp') {
      currentMinutes -= step;
    } else if (key === 'ArrowDown') {
      currentMinutes += step;
    } else {
      return;
    }
    currentMinutes = Math.min(1_440, Math.max(0, currentMinutes));
    const updated = { ...session, currentDate, currentMinutes };
    this.dragSession.set(updated);
    this.announcement.set(
      this.resolveText('solaris.calendar.dragChange', {
        label: this.dragLabel(updated),
      }),
    );
  }

  private moveFocus(
    slot: SolarisWeekFocusedSlot,
    dayDelta: number,
    hourDelta: number,
  ): void {
    const hour = Math.min(
      WEEK_VIEW_HOURS_PER_DAY - 1,
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
    const date = edge === 'start' ? dates.at(0) : dates.at(-1);
    if (date === undefined) return;
    this.focusedSlot.set({ date, hour });
    this.focusedDate.set(date);
  }

  private stepVisible(current: string, delta: number): string | null {
    const direction = delta < 0 ? -1 : 1;
    let candidate = addDaysToSolarisDate(current, delta);
    for (let guard = 0; guard < 9; guard += 1) {
      if (candidate === null) return null;
      if (this.showWeekends() || !isSolarisWeekend(candidate)) return candidate;
      candidate = addDaysToSolarisDate(candidate, direction);
    }
    return null;
  }

  protected nowText(): string {
    const wall = getZonedWall(this.timeZone(), this.nowMs());
    return `${this.nowLineLabel()} ${weekViewPad2(wall.hour)}:${weekViewPad2(wall.minute)}`;
  }
}
