import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  input,
  model,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';

import { SolarisButtonDirective } from '../../../../actions/button';
import { SolarisIconButtonDirective } from '../../../../actions/icon-button';
import { SolarisCheckboxComponent } from '../../../../forms/checkbox';
import { SolarisOptionComponent } from '../../../../forms/option';
import { SolarisSelectComponent } from '../../../../forms/select';
import { SolarisIconComponent } from '../../../../icon';
import { SolarisCollapsibleComponent } from '../../../../interaction/collapsible';
import {
  addSolarisMonths,
  getCalendarDays,
  localeFirstDay,
  todaySolarisDate,
} from '../../../../forms/date/model/date.utils';
import { SolarisVisuallyHiddenDirective } from '../../../../../services/accessibility';
import { SolarisTranslateService } from '../../../../../services/translation';
import {
  addDaysToSolarisDate,
  defaultSolarisTimeZone,
  isSolarisWeekend,
  parseSolarisDateParts,
} from '../../model/calendar-datetime.utils';
import { resolveCalendarFallback } from '../../model/strings/calendar-strings';
import { filterSolarisByCalendars } from '../../model/calendar-availability.utils';
import { searchSolarisCalendar } from '../../model/calendar-search.utils';
import type {
  SolarisCalendarEvent,
  SolarisCalendarSource,
  SolarisCalendarTask,
  SolarisCalendarWeekStart,
  SolarisHoliday,
} from '../../model/calendar.types';
import type {
  SolarisEventDeleteRequest,
  SolarisEventSaveRequest,
} from '../../event-editor';
import { SolarisDialogService } from '../../../../overlay/dialog';
import type { SolarisDialogRef } from '../../../../overlay/dialog';
import { SolarisCalendarEditorDialogComponent } from './calendar-editor-dialog.component';
import type {
  SolarisCalendarEventCreateProposal,
  SolarisCalendarEventMoveProposal,
  SolarisCalendarEventResizeProposal,
} from '../../model/calendar-drag.types';
import type { SolarisWeekViewSlotSelect } from '../../week-view';
import { SolarisCalendarWeekViewComponent } from '../../week-view';
import type { SolarisMonthViewTaskMove } from '../../month-view';
import { SolarisCalendarYearViewComponent } from '../../year-view';
import { SolarisCalendarMonthViewComponent } from '../../month-view';
import { SolarisCalendarScheduleViewComponent } from '../../schedule-view';
import {
  capitalizeCalendarFirst,
  buildSolarisCreateDraft,
  buildSolarisSlotDraft,
  formatFriendlyTimeZone,
  formatTimeZoneOffset,
  normalizeCustomDays,
  normalizeShellView,
  resolveEffectiveView,
  resolveMiniMonth,
  shiftShellDate,
} from '../model/shell.utils';
import {
  SOLARIS_CALENDAR_NARROW_BREAKPOINT_PX,
  type SolarisCalendarDensity,
  type SolarisCalendarEditorDialogData,
  type SolarisCalendarEditorDialogResult,
  type SolarisCalendarResponsiveFallback,
  type SolarisCalendarSize,
  type SolarisCalendarView,
} from '../model/shell.types';

const MINI_WEEK_LENGTH = 7;

@Component({
  selector: 'solaris-calendar',
  standalone: true,
  imports: [
    SolarisCalendarMonthViewComponent,
    SolarisCalendarWeekViewComponent,
    SolarisCalendarYearViewComponent,
    SolarisCalendarScheduleViewComponent,
    SolarisVisuallyHiddenDirective,
    SolarisButtonDirective,
    SolarisIconButtonDirective,
    SolarisIconComponent,
    SolarisSelectComponent,
    SolarisOptionComponent,
    SolarisCheckboxComponent,
    SolarisCollapsibleComponent,
  ],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-calendar',
    '[attr.data-view]': 'effectiveView()',
    '[attr.data-density]': 'density()',
    '[attr.data-size]': 'size()',
  },
})
export class SolarisCalendarComponent implements OnInit, OnDestroy {
  readonly view = model<SolarisCalendarView>('month');
  readonly focusedDate = model<string>(todaySolarisDate());
  readonly customDays = model<number>(4);
  readonly events = input<SolarisCalendarEvent[]>([]);
  readonly tasks = input<SolarisCalendarTask[]>([]);
  readonly holidays = input<SolarisHoliday[]>([]);
  readonly timeZone = model<string>(defaultSolarisTimeZone());
  readonly locale = input.required<string>();
  readonly weekStartsOn = input<SolarisCalendarWeekStart>();
  readonly showWeekends = model<boolean>(true);
  readonly showHolidays = model<boolean>(true);
  readonly density = input<SolarisCalendarDensity>('comfortable');
  readonly size = input<SolarisCalendarSize>('md');
  readonly responsiveFallback =
    input<SolarisCalendarResponsiveFallback>('schedule');
  readonly editable = input<boolean>(false);
  readonly editorDisabled = input<boolean>(false);
  readonly sources = input<SolarisCalendarSource[]>([]);
  readonly visibleCalendarIds = input<string[] | null>(null);
  readonly query = input<string>('');
  readonly timeZones = input<string[]>([
    'America/Sao_Paulo',
    'America/New_York',
    'Europe/Berlin',
    'UTC',
  ]);

  readonly daySelect = output<string>();
  readonly eventOpen = output<{ id: string; start: string }>();
  readonly slotSelect = output<SolarisWeekViewSlotSelect>();
  readonly taskToggle = output<string>();
  readonly taskMove = output<SolarisMonthViewTaskMove>();
  readonly eventCreate = output<SolarisCalendarEventCreateProposal>();
  readonly eventMove = output<SolarisCalendarEventMoveProposal>();
  readonly eventResize = output<SolarisCalendarEventResizeProposal>();
  readonly eventSave = output<SolarisEventSaveRequest>();
  readonly eventDelete = output<SolarisEventDeleteRequest>();
  readonly eventCancel = output<void>();

  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  private readonly dialogService = inject(SolarisDialogService, {
    optional: true,
  });
  private narrowQuery: MediaQueryList | null = null;
  private readonly onNarrowChange = (event: MediaQueryListEvent): void => {
    this.isNarrow.set(event.matches);
  };

  protected readonly isNarrow = signal(false);
  protected readonly announcement = signal('');
  protected readonly miniOffset = signal(0);

  protected readonly resolvedHolidays = computed(() =>
    this.showHolidays() ? this.holidays() : [],
  );

  protected readonly visibleEvents = computed(() => {
    const byCalendar = filterSolarisByCalendars(
      this.events(),
      this.visibleCalendarIds(),
    );
    const needle = this.query().trim();
    if (needle.length === 0) return byCalendar;
    const hits = new Set(
      searchSolarisCalendar(byCalendar, [], needle, byCalendar.length).map(
        (hit) => `${hit.kind}:${hit.id}`,
      ),
    );
    return byCalendar.filter((event) => hits.has(`event:${event.id}`));
  });

  protected readonly normalizedView = computed(() =>
    normalizeShellView(this.view()),
  );
  protected readonly normalizedCustomDays = computed(() =>
    normalizeCustomDays(this.customDays()),
  );
  protected readonly effectiveView = computed(() =>
    resolveEffectiveView(
      this.normalizedView(),
      this.isNarrow(),
      this.responsiveFallback(),
    ),
  );
  protected readonly weekVisibleDays = computed(() => {
    const view = this.normalizedView();
    if (view === 'day') return 1;
    if (view === 'custom') {
      const days = this.normalizedCustomDays();
      if (days === 1 || days === 3 || days === 4 || days === 7) return days;
      return 7;
    }
    return 7;
  });
  protected readonly resolvedWeekStartsOn = computed(
    () => this.weekStartsOn() ?? localeFirstDay(this.locale()),
  );

  protected readonly titleLabel = computed(() => {
    const focused = this.focusedDate();
    const view = this.effectiveView();
    const parts = parseSolarisDateParts(focused);
    const ref = parts ?? { year: 2026, month: 10, day: 15 };
    if (view === 'year') {
      return new Intl.DateTimeFormat(this.locale(), {
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(Date.UTC(ref.year, 0, 1)));
    }
    if (view === 'schedule') {
      const anchor = parts !== null ? focused : todaySolarisDate();
      const last = addDaysToSolarisDate(anchor, 6) ?? anchor;
      return `${this.formatScheduleDay(anchor)} – ${this.formatScheduleDay(last)}`;
    }
    if (view === 'day') {
      const date = new Date(Date.UTC(ref.year, ref.month - 1, ref.day));
      const formatter = new Intl.DateTimeFormat(this.locale(), {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      });
      return formatter
        .formatToParts(date)
        .map((part) =>
          part.type === 'month'
            ? capitalizeCalendarFirst(part.value)
            : part.value,
        )
        .join('');
    }
    return new Intl.DateTimeFormat(this.locale(), {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(ref.year, ref.month - 1, 1)));
  });

  protected timeZoneLabel(zone: string): string {
    return formatFriendlyTimeZone(zone, this.locale(), Date.now());
  }

  private formatScheduleDay(date: string): string {
    return new Intl.DateTimeFormat(this.locale(), {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    }).format(new Date(`${date}T00:00:00Z`));
  }

  protected readonly timeZoneOffset = computed(() =>
    formatTimeZoneOffset(this.timeZone(), Date.now()),
  );

  protected readonly miniLabel = computed(() => {
    const shifted = addSolarisMonths(
      resolveMiniMonth(this.focusedDate()),
      this.miniOffset(),
    );
    return new Intl.DateTimeFormat(this.locale(), {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(shifted.year, shifted.month, 1)));
  });

  protected readonly miniCells = computed(() => {
    const shifted = addSolarisMonths(
      resolveMiniMonth(this.focusedDate()),
      this.miniOffset(),
    );
    const all = getCalendarDays(shifted, this.resolvedWeekStartsOn());
    if (this.showWeekends()) return all;
    return all.filter((day) => !isSolarisWeekend(day.value));
  });

  protected readonly miniRows = computed(() => {
    const cells = this.miniCells();
    const width = this.showWeekends() ? MINI_WEEK_LENGTH : 5;
    const rows: (typeof cells)[] = [];
    for (let index = 0; index < cells.length; index += width) {
      rows.push(cells.slice(index, index + width));
    }
    return rows;
  });

  protected readonly miniWeekdays = computed(() => {
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

  protected readonly viewOptions = computed(() =>
    (['day', 'week', 'month', 'year', 'schedule', 'custom'] as const).map(
      (option) => ({
        value: option,
        label: this.viewLabel(option),
      }),
    ),
  );

  protected readonly customDaysOptions = [1, 2, 3, 4, 5, 6, 7];

  ngOnInit(): void {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return;
    }
    this.narrowQuery = window.matchMedia(
      `(width <= ${SOLARIS_CALENDAR_NARROW_BREAKPOINT_PX}px)`,
    );
    this.isNarrow.set(this.narrowQuery.matches);
    if (typeof this.narrowQuery.addEventListener === 'function') {
      this.narrowQuery.addEventListener('change', this.onNarrowChange);
    }
  }

  ngOnDestroy(): void {
    if (
      this.narrowQuery !== null &&
      typeof this.narrowQuery.removeEventListener === 'function'
    ) {
      this.narrowQuery.removeEventListener('change', this.onNarrowChange);
    }
    this.narrowQuery = null;
  }

  protected isToday(value: string): boolean {
    return value === todaySolarisDate();
  }

  protected isActiveDay(value: string): boolean {
    return value === this.focusedDate();
  }

  protected viewLabel(option: SolarisCalendarView): string {
    switch (option) {
      case 'day':
        return this.resolveText('solaris.calendar.viewDay', {});
      case 'week':
        return this.resolveText('solaris.calendar.viewWeek', {});
      case 'month':
        return this.resolveText('solaris.calendar.viewMonth', {});
      case 'year':
        return this.resolveText('solaris.calendar.viewYear', {});
      case 'schedule':
        return this.resolveText('solaris.calendar.viewSchedule', {});
      case 'custom':
        return this.resolveText('solaris.calendar.viewCustom', {});
      default:
        return option;
    }
  }

  protected text(key: string): string {
    return this.resolveText(key, {});
  }

  protected selectView(value: unknown): void {
    const next = normalizeShellView(value);
    this.view.set(next);
    this.announcement.set(this.viewLabel(next));
  }

  protected shift(delta: number): void {
    const next = shiftShellDate(
      this.focusedDate(),
      this.normalizedView(),
      this.normalizedCustomDays(),
      delta,
    );
    this.focusedDate.set(next);
    this.announcement.set(this.titleLabel());
  }

  protected goToday(): void {
    const today = todaySolarisDate();
    this.focusedDate.set(today);
    this.miniOffset.set(0);
    this.announcement.set(this.titleLabel());
  }

  // Why: window-level parity with Google Calendar (N/T/1-5/[/]) without stealing
  // keystrokes from form controls or the editor dialog.
  @HostListener('window:keydown', ['$event'])
  protected onWindowKeydown(event: KeyboardEvent): void {
    if (this.isShortcutGuarded(event)) return;
    const key = event.key.toLowerCase();
    if (key === 'n') {
      this.openCreateAtFocusedDate();
      event.preventDefault();
      return;
    }
    if (key === 't') {
      this.goToday();
      event.preventDefault();
      return;
    }
    const viewForDigit: Record<string, SolarisCalendarView> = {
      '1': 'day',
      '2': 'week',
      '3': 'month',
      '4': 'year',
      '5': 'schedule',
    };
    const digitView = viewForDigit[event.key];
    if (digitView !== undefined) {
      this.selectView(digitView);
      event.preventDefault();
      return;
    }
    if (event.key === '[') {
      this.shift(-1);
      event.preventDefault();
      return;
    }
    if (event.key === ']') {
      this.shift(1);
      event.preventDefault();
    }
  }

  // Why: typing in inputs/selects/contenteditable or interacting with an open
  // dialog must never trigger shell navigation or creation.
  private isShortcutGuarded(event: KeyboardEvent): boolean {
    if (event.defaultPrevented) return true;
    if (event.ctrlKey || event.metaKey || event.altKey) return true;
    if ((this.dialogService?.openCount ?? 0) > 0) return true;
    const target = event.target as HTMLElement | null;
    if (target === null || typeof target.tagName !== 'string') return false;
    const tag = target.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
    if (target.isContentEditable) return true;
    if (typeof target.closest !== 'function') return false;
    if (
      target.closest(
        'input,textarea,select,[contenteditable],[contenteditable="true"]',
      ) !== null
    )
      return true;
    return target.closest('[role="dialog"]') !== null;
  }

  // Why: N creates an all-day draft anchored at the visible date; the shell
  // emits the proposal first so non-editable consumers keep working.
  private openCreateAtFocusedDate(): void {
    if (!this.editable() || this.editorDisabled()) return;
    const focused = this.focusedDate();
    const proposal: SolarisCalendarEventCreateProposal = {
      start: focused,
      end: focused,
      allDay: true,
    };
    this.eventCreate.emit(proposal);
    const draft = buildSolarisCreateDraft(proposal);
    if (draft === null) return;
    this.openCreateEditor(draft);
    this.announcement.set(this.resolveText('solaris.calendar.newEvent', {}));
  }

  protected shiftMini(delta: number): void {
    this.miniOffset.set(this.miniOffset() + delta);
  }

  protected pickMini(date: string): void {
    if (parseSolarisDateParts(date) === null) return;
    this.focusedDate.set(date);
    this.daySelect.emit(date);
    this.announcement.set(this.titleLabel());
  }

  protected onCustomDays(value: unknown): void {
    const numeric = typeof value === 'number' ? value : Number(value);
    if (Number.isFinite(numeric)) {
      this.customDays.set(normalizeCustomDays(numeric));
    }
  }

  protected onTimeZone(value: unknown): void {
    if (typeof value === 'string' && value.length > 0) this.timeZone.set(value);
  }

  protected onToggleWeekends(checked: boolean): void {
    this.showWeekends.set(checked);
  }

  protected forwardDay(date: string): void {
    this.focusedDate.set(date);
    this.daySelect.emit(date);
  }

  protected handleEventOpen(open: { id: string; start: string }): void {
    this.eventOpen.emit(open);
    if (!this.editable() || this.editorDisabled()) return;
    this.openEditor(open);
  }

  protected handleEventCreate(
    proposal: SolarisCalendarEventCreateProposal,
  ): void {
    this.eventCreate.emit(proposal);
    if (!this.editable() || this.editorDisabled()) return;
    const draft = buildSolarisCreateDraft(proposal);
    if (draft === null) return;
    this.openCreateEditor(draft);
  }

  protected handleSlotSelect(slot: SolarisWeekViewSlotSelect): void {
    this.slotSelect.emit(slot);
    if (!this.editable() || this.editorDisabled()) return;
    const draft = buildSolarisSlotDraft(slot.date, slot.time, this.timeZone());
    if (draft === null) return;
    this.focusedDate.set(slot.date);
    this.openCreateEditor(draft);
  }

  private openEditor(open: { id: string; start: string }): void {
    const source = this.events().find((item) => item.id === open.id) ?? null;
    if (source === null) return;
    const dialog = this.dialogService;
    if (!dialog) return;
    const data: SolarisCalendarEditorDialogData = {
      event: source,
      occurrenceStart: open.start,
      timeZone: this.timeZone(),
      timeZoneOptions: this.timeZones(),
      locale: this.locale(),
      size: this.size(),
      density: this.density(),
    };
    const ref = dialog.openComponent<
      SolarisCalendarEditorDialogComponent,
      SolarisCalendarEditorDialogResult,
      SolarisCalendarEditorDialogData
    >(SolarisCalendarEditorDialogComponent, {
      title: source.title,
      width: '560px',
      data,
    });
    this.forwardEditorResult(ref);
  }

  private openCreateEditor(draft: SolarisCalendarEvent): void {
    const dialog = this.dialogService;
    if (!dialog) return;
    const data: SolarisCalendarEditorDialogData = {
      event: draft,
      occurrenceStart: null,
      timeZone: this.timeZone(),
      timeZoneOptions: this.timeZones(),
      locale: this.locale(),
      size: this.size(),
      density: this.density(),
    };
    const ref = dialog.openComponent<
      SolarisCalendarEditorDialogComponent,
      SolarisCalendarEditorDialogResult,
      SolarisCalendarEditorDialogData
    >(SolarisCalendarEditorDialogComponent, {
      title: draft.title || this.resolveText('solaris.calendar.newEvent', {}),
      width: '560px',
      data,
    });
    this.forwardEditorResult(ref);
  }

  private forwardEditorResult(
    ref: SolarisDialogRef<SolarisCalendarEditorDialogResult>,
  ): void {
    ref.afterClosed().subscribe((result) => {
      if (!result) {
        this.eventCancel.emit();
        return;
      }
      if (result.kind === 'save') {
        if (result.saveRequest) {
          this.eventSave.emit(result.saveRequest);
        } else if (result.event) {
          this.eventSave.emit({
            event: result.event,
            scope: 'all',
            occurrenceStart: null,
          });
        } else {
          this.eventCancel.emit();
        }
      } else if (result.kind === 'delete' && result.request) {
        this.eventDelete.emit(result.request);
      } else {
        this.eventCancel.emit();
      }
    });
  }

  private resolveText(key: string, params: Record<string, string>): string {
    const service = this.translateService;
    if (service) return service.translate(key, params);
    return resolveCalendarFallback(this.locale(), key, params);
  }
}
