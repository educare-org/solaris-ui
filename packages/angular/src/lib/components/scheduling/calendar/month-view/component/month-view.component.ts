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

import { nextIdFor } from '../../../../../core';
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
import { SolarisVisuallyHiddenDirective } from '../../../../../services/accessibility';
import { SolarisTranslateService } from '../../../../../services/translation';
import {
  addDaysToSolarisDate,
  defaultSolarisTimeZone,
  isSolarisWeekend,
  parseSolarisDateParts,
  parseSolarisDateTimeMs,
  shiftSolarisCivilMonth,
  solarisCivilWeekday,
  toSolarisDateInZone,
} from '../../model/calendar-datetime.utils';
import type {
  SolarisCalendarEventCreateProposal,
  SolarisCalendarEventMoveProposal,
} from '../../model/calendar-drag.types';
import {
  buildMonthCreateProposal,
  buildMonthMoveProposal,
} from '../../model/calendar-drag.utils';
import { resolveCalendarFallback } from '../../model/strings/calendar-strings';
import type {
  SolarisCalendarEvent,
  SolarisCalendarTask,
  SolarisCalendarWeekStart,
  SolarisHoliday,
} from '../../model/calendar.types';
import type {
  SolarisMonthDragCandidate,
  SolarisMonthDragSession,
  SolarisMonthRange,
  SolarisMonthViewDensity,
  SolarisMonthViewEventOpen,
  SolarisMonthViewItem,
  SolarisMonthViewSize,
} from '../model/month-view.types';
import {
  compareMonthItems,
  expandEventSpans,
  isMonthArrowKey,
  isMonthDragKey,
  MONTH_VIEW_DRAG_ACTIVATION_PX,
  monthViewMonthOf,
  spanDates,
  taskDueCivil,
} from '../model/month-view.utils';

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
    '[attr.data-dragging]': 'dragSession() ? "" : null',
  },
})
export class SolarisCalendarMonthViewComponent
  implements AfterViewInit, OnDestroy
{
  readonly focusedDate = model<string>(todaySolarisDate());
  readonly events = input<SolarisCalendarEvent[]>([]);
  readonly tasks = input<SolarisCalendarTask[]>([]);
  readonly holidays = input<SolarisHoliday[]>([]);
  readonly timeZone = input<string>(defaultSolarisTimeZone());
  readonly locale = input.required<string>();
  readonly weekStartsOn = input<SolarisCalendarWeekStart>();
  readonly showWeekends = input(true);
  readonly density = input<SolarisMonthViewDensity>('comfortable');
  readonly size = input<SolarisMonthViewSize>('md');
  readonly selectedId = input<string | null>(null);
  readonly maxVisiblePerDay = input(3);
  readonly moreLabel = input<string>();
  readonly moreLabelKey = input<string>();
  readonly dragDisabled = input(false);

  readonly daySelect = output<string>();
  readonly eventOpen = output<SolarisMonthViewEventOpen>();
  readonly moreOpen = output<string>();
  readonly taskToggle = output<string>();
  readonly eventCreate = output<SolarisCalendarEventCreateProposal>();
  readonly eventMove = output<SolarisCalendarEventMoveProposal>();

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
    this.detachDragListeners();
  }

  protected readonly announcement = signal('');
  protected readonly gridFocused = signal(false);

  // why: pointer drag state lives outside signals until the move threshold passes.
  protected readonly dragSession = signal<SolarisMonthDragSession | null>(null);
  private dragCandidate: SolarisMonthDragCandidate | null = null;
  private dragSuppressClick = false;
  private dragMoveListener: ((event: PointerEvent) => void) | null = null;
  private dragUpListener: ((event: PointerEvent) => void) | null = null;
  private dragCancelListener: (() => void) | null = null;
  private dragKeyListener: ((event: KeyboardEvent) => void) | null = null;

  protected readonly resolvedWeekStartsOn = computed(
    () => this.weekStartsOn() ?? localeFirstDay(this.locale()),
  );

  protected readonly viewMonth = computed(() =>
    monthViewMonthOf(this.focusedDate()),
  );

  protected readonly allCells = computed<SolarisCalendarDay[]>(() =>
    getCalendarDays(this.viewMonth(), this.resolvedWeekStartsOn()),
  );

  protected readonly cells = computed<SolarisCalendarDay[]>(() => {
    if (this.showWeekends()) return this.allCells();
    return this.allCells().filter((cell) => !isSolarisWeekend(cell.value));
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
    const first = cells.at(0);
    const last = cells.at(-1);
    if (first === undefined || last === undefined) return buckets;
    const timeZone = this.timeZone();
    const range: SolarisMonthRange = {
      start: first.value,
      end: addDaysToSolarisDate(last.value, 1) ?? last.value,
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
    this.collectEvents(push, range, timeZone);
    this.collectTasks(push, timeZone);
    this.collectHolidays(push);
    for (const list of buckets.values()) {
      list.sort(compareMonthItems);
    }
    return buckets;
  });

  private collectEvents(
    push: (date: string, item: SolarisMonthViewItem) => void,
    range: SolarisMonthRange,
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
    return resolveCalendarFallback(this.locale(), key, params);
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

  protected dragGhostDate(): string | null {
    return this.dragSession()?.currentDate ?? null;
  }

  protected dragGhostText(): string {
    const session = this.dragSession();
    if (session === null) return '';
    return this.dragLabel(session);
  }

  protected isDragSource(item: SolarisMonthViewItem): boolean {
    const session = this.dragSession();
    return (
      session !== null &&
      session.mode === 'move' &&
      session.eventId === item.id &&
      session.occurrenceStart === item.occurrenceStart
    );
  }

  protected isDragCell(date: string): boolean {
    const session = this.dragSession();
    if (session === null) return false;

    const [low, high] = [session.anchorDate, session.currentDate].sort();

    return date >= low && date <= high;
  }

  protected isDragTarget(date: string): boolean {
    return this.dragSession()?.currentDate === date;
  }

  private consumeSuppressClick(): boolean {
    if (!this.dragSuppressClick) return false;
    this.dragSuppressClick = false;
    return true;
  }

  private findDragEvent(id: string): SolarisCalendarEvent | null {
    return this.events().find((event) => event.id === id) ?? null;
  }

  private itemCivilDate(item: SolarisMonthViewItem): string | null {
    if (parseSolarisDateTimeMs(item.occurrenceStart) !== null) {
      return toSolarisDateInZone(item.occurrenceStart, this.timeZone());
    }
    return parseSolarisDateParts(item.occurrenceStart) !== null
      ? item.occurrenceStart
      : null;
  }

  private dragLabel(session: SolarisMonthDragSession): string {
    if (session.mode === 'move') {
      return `${session.title}, ${this.formatDay(session.currentDate)}`;
    }
    const low =
      session.anchorDate <= session.currentDate
        ? session.anchorDate
        : session.currentDate;
    const high =
      session.anchorDate <= session.currentDate
        ? session.currentDate
        : session.anchorDate;
    if (low === high) return this.formatDay(low);
    return `${this.formatDay(low)} – ${this.formatDay(high)}`;
  }

  protected onCellPointerDown(event: PointerEvent, date: string): void {
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
    if (target?.closest('[data-chip],[data-ghost]') !== null) return;
    const button = target?.closest('button') ?? null;
    if (
      button !== null &&
      !button.classList.contains('solaris-calendar-month-view__day')
    ) {
      return;
    }
    this.armDragCandidate({
      mode: 'create',
      anchorDate: date,
      grabDate: date,
      eventId: null,
      occurrenceStart: null,
      title: '',
      allDay: true,
      pointerId: event.pointerId,
      startX: event.clientX ?? 0,
      startY: event.clientY ?? 0,
    });
  }

  protected onChipPointerDown(
    event: PointerEvent,
    item: SolarisMonthViewItem,
    grabDate: string,
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
    const origin = this.itemCivilDate(item);
    if (origin === null) return;
    event.stopPropagation();
    this.armDragCandidate({
      mode: 'move',
      anchorDate: origin,
      grabDate: parseSolarisDateParts(grabDate) !== null ? grabDate : origin,
      eventId: item.id,
      occurrenceStart: item.occurrenceStart,
      title: item.title,
      allDay: item.allDay,
      pointerId: event.pointerId,
      startX: event.clientX ?? 0,
      startY: event.clientY ?? 0,
    });
  }

  protected onChipKeydown(
    event: KeyboardEvent,
    item: SolarisMonthViewItem,
  ): void {
    if (item.kind !== 'event' || item.id === null || this.dragDisabled()) {
      return;
    }
    if (!isMonthDragKey(event.key)) {
      return;
    }
    const session = this.dragSession();
    if (session === null) {
      this.beginChipDrag(event, item);
      return;
    }
    this.advanceChipDrag(event, item, session);
  }

  private advanceChipDrag(
    event: KeyboardEvent,
    item: SolarisMonthViewItem,
    session: SolarisMonthDragSession,
  ): void {
    if (
      session.origin !== 'keyboard' ||
      session.mode !== 'move' ||
      session.eventId !== item.id
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
    const next = this.stepVisibleFrom(session.currentDate, event.key);
    if (next === null) return;
    this.shiftChipTarget(session, next);
  }

  private beginChipDrag(
    event: KeyboardEvent,
    item: SolarisMonthViewItem,
  ): void {
    if (!isMonthArrowKey(event.key) || item.id === null) return;
    const origin = this.itemCivilDate(item);
    if (origin === null) return;
    event.preventDefault();
    this.activateDragSession(
      {
        mode: 'move',
        anchorDate: origin,
        grabDate: origin,
        eventId: item.id,
        occurrenceStart: item.occurrenceStart,
        title: item.title,
        allDay: item.allDay,
        pointerId: -1,
        startX: 0,
        startY: 0,
      },
      'keyboard',
    );
    const next = this.stepVisibleFrom(origin, event.key);
    if (next === null) return;
    const started = this.dragSession();
    if (started === null) return;
    this.shiftChipTarget(started, next);
  }

  private shiftChipTarget(
    session: SolarisMonthDragSession,
    next: string,
  ): void {
    const updated = { ...session, currentDate: next };
    this.dragSession.set(updated);
    this.announcement.set(
      this.resolveText('solaris.calendar.dragChange', {
        label: this.dragLabel(updated),
      }),
    );
  }

  private stepVisibleFrom(current: string, key: string): string | null {
    if (key === 'ArrowLeft') return this.stepVisible(current, -1);
    if (key === 'ArrowRight') return this.stepVisible(current, 1);
    if (key === 'ArrowUp') return this.stepVisible(current, -7);
    if (key === 'ArrowDown') return this.stepVisible(current, 7);
    return null;
  }

  private armDragCandidate(candidate: SolarisMonthDragCandidate): void {
    this.dragCandidate = candidate;
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

  private activateDragSession(
    candidate: SolarisMonthDragCandidate,
    origin: 'pointer' | 'keyboard',
  ): void {
    this.dragSession.set({
      origin,
      mode: candidate.mode,
      anchorDate: candidate.anchorDate,
      grabDate: candidate.grabDate,
      currentDate: candidate.anchorDate,
      eventId: candidate.eventId,
      occurrenceStart: candidate.occurrenceStart,
      title: candidate.title,
      allDay: candidate.allDay,
    });
    if (candidate.mode === 'create') {
      this.announcement.set(
        this.resolveText('solaris.calendar.dragCreateStart', {
          start: this.formatDay(candidate.anchorDate),
          end: this.formatDay(candidate.anchorDate),
        }),
      );
    } else {
      this.announcement.set(
        this.resolveText('solaris.calendar.dragMoveStart', {
          title: candidate.title,
          start: this.formatDay(candidate.anchorDate),
        }),
      );
    }
  }

  private onDragPointerMove(event: PointerEvent): void {
    const candidate = this.dragCandidate;
    if (candidate === null || !event.isPrimary) return;
    if (event.pointerId !== candidate.pointerId) return;
    if (this.dragSession() === null) {
      const movedX = (event.clientX ?? 0) - candidate.startX;
      const movedY = (event.clientY ?? 0) - candidate.startY;
      if (Math.hypot(movedX, movedY) < MONTH_VIEW_DRAG_ACTIVATION_PX) return;
      this.activateDragSession(candidate, 'pointer');
    }
    this.updateDragTarget(event.clientX ?? 0, event.clientY ?? 0);
  }

  private updateDragTarget(clientX: number, clientY: number): void {
    const session = this.dragSession();
    if (session === null || typeof document === 'undefined') return;
    const element = document.elementFromPoint(clientX, clientY);
    const cell =
      element instanceof HTMLElement ? element.closest('[data-date]') : null;
    const date = cell?.getAttribute('data-date');
    if (date === null || date === undefined) return;
    if (date === session.currentDate) return;
    if (parseSolarisDateParts(date) === null) return;
    const updated = { ...session, currentDate: date };
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
    // why: the click synthesized after a drag must not re-trigger open/select.
    this.dragSuppressClick = true;
    if (session.mode === 'create') {
      const proposal = buildMonthCreateProposal(
        session.anchorDate,
        session.currentDate,
      );
      if (proposal === null) {
        this.announcement.set(
          this.resolveText('solaris.calendar.dragCancel', {}),
        );
        return;
      }
      this.eventCreate.emit(proposal);
      this.announcement.set(
        this.resolveText('solaris.calendar.dragCreateCommit', {
          start: this.formatDay(proposal.start),
          end: this.formatDay(proposal.end),
        }),
      );
      return;
    }
    const record =
      session.eventId === null ? null : this.findDragEvent(session.eventId);
    if (record === null || session.occurrenceStart === null) {
      this.announcement.set(
        this.resolveText('solaris.calendar.dragCancel', {}),
      );
      return;
    }
    const proposal = buildMonthMoveProposal({
      event: record,
      occurrenceStart: session.occurrenceStart,
      targetDate: session.currentDate,
      originDate: session.grabDate,
      timeZone: this.timeZone(),
    });
    if (proposal === null) {
      this.announcement.set(
        this.resolveText('solaris.calendar.dragCancel', {}),
      );
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

  private cancelDragSession(): void {
    const hadSession = this.dragSession() !== null;
    this.detachDragListeners();
    this.dragCandidate = null;
    this.dragSession.set(null);
    if (!hadSession) return;
    // why: cancelling after activation still synthesizes a click on some browsers.
    this.dragSuppressClick = true;
    this.announcement.set(this.resolveText('solaris.calendar.dragCancel', {}));
  }

  protected openDay(value: string): void {
    if (this.consumeSuppressClick()) return;
    this.daySelect.emit(value);
    this.announcement.set(this.dayAriaLabel(value));
  }

  protected openEvent(item: SolarisMonthViewItem): void {
    if (this.consumeSuppressClick()) return;
    if (item.id === null) return;
    this.eventOpen.emit({ id: item.id, start: item.occurrenceStart });
    this.announcement.set(this.chipAriaLabel(item));
  }

  protected openMore(value: string): void {
    if (this.consumeSuppressClick()) return;
    this.moreOpen.emit(value);
    this.announcement.set(this.dayAriaLabel(value));
  }

  protected toggleTask(item: SolarisMonthViewItem): void {
    if (this.consumeSuppressClick()) return;
    if (item.id === null) return;
    this.taskToggle.emit(item.id);
    this.announcement.set(this.chipAriaLabel(item));
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
    const session = this.dragSession();
    if (session !== null && session.origin === 'keyboard') {
      this.advanceGridDrag(event, session);
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
    this.beginGridDrag(event, current, next);
  }

  private advanceGridDrag(
    event: KeyboardEvent,
    session: SolarisMonthDragSession,
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
    if (session.mode !== 'create') {
      return;
    }
    const next = this.keyStep(this.focusedDate(), event.key);
    if (next === null) return;
    event.preventDefault();
    this.focusedDate.set(next);
    const updated = { ...session, currentDate: next };
    this.dragSession.set(updated);
    this.announcement.set(
      this.resolveText('solaris.calendar.dragChange', {
        label: this.dragLabel(updated),
      }),
    );
  }

  private beginGridDrag(
    event: KeyboardEvent,
    current: string,
    next: string,
  ): void {
    if (this.dragDisabled() || !event.shiftKey || this.dragSession() !== null) {
      return;
    }
    this.activateDragSession(
      {
        mode: 'create',
        anchorDate: current,
        grabDate: current,
        eventId: null,
        occurrenceStart: null,
        title: '',
        allDay: true,
        pointerId: -1,
        startX: 0,
        startY: 0,
      },
      'keyboard',
    );
    const started = this.dragSession();
    if (started === null) return;
    const updated = { ...started, currentDate: next };
    this.dragSession.set(updated);
    this.announcement.set(
      this.resolveText('solaris.calendar.dragChange', {
        label: this.dragLabel(updated),
      }),
    );
  }

  private keyStep(current: string, key: string): string | null {
    if (key === 'ArrowLeft') return this.stepVisible(current, -1);
    if (key === 'ArrowRight') return this.stepVisible(current, 1);
    if (key === 'ArrowUp') return this.stepVisible(current, -7);
    if (key === 'ArrowDown') return this.stepVisible(current, 7);
    if (key === 'Home') return this.weekEdge(current, 'start');
    if (key === 'End') return this.weekEdge(current, 'end');
    if (key === 'PageUp') return shiftSolarisCivilMonth(current, -1);
    if (key === 'PageDown') return shiftSolarisCivilMonth(current, 1);
    return null;
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

  private weekEdge(current: string, edge: 'start' | 'end'): string | null {
    const weekday = solarisCivilWeekday(current);
    if (weekday === null) return null;
    const start = this.resolvedWeekStartsOn();
    if (edge === 'start') {
      return this.stepVisible(current, -((weekday - start + 7) % 7));
    }
    return this.stepVisible(current, 6 - ((weekday - start + 7) % 7));
  }
}
