// SECURITY_EXCEPTION_FILE: window.matchMedia is guarded by typeof checks (SSR-safe early return in ngOnInit) and required for the ≤640px responsive fallback to the schedule agenda; matchMedia listeners are removed in ngOnDestroy. Covered by shell component specs.
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';

import { nextIdFor } from '../../../../../core';
import { SolarisButtonDirective } from '../../../../actions/button';
import { SolarisIconButtonDirective } from '../../../../actions/icon-button';
import { SolarisCheckboxComponent } from '../../../../forms/checkbox';
import { SolarisOptionComponent } from '../../../../forms/option';
import { SolarisSelectComponent } from '../../../../forms/select';
import { SolarisIconComponent } from '../../../../icon';
import {
  addSolarisMonths,
  getCalendarDays,
  localeFirstDay,
  todaySolarisDate,
} from '../../../../forms/date/model/date.utils';
import { SolarisVisuallyHiddenDirective } from '../../../../../services/accessibility';
import { SolarisTranslateService } from '../../../../../services/translation';
import {
  defaultSolarisTimeZone,
  isSolarisWeekend,
  parseSolarisDateParts,
} from '../../model/calendar-datetime.utils';
import { resolveCalendarFallback } from '../../model/strings/calendar-strings';
import type {
  SolarisCalendarEvent,
  SolarisCalendarTask,
  SolarisCalendarWeekStart,
  SolarisHoliday,
} from '../../model/calendar.types';
import type {
  SolarisCalendarEventCreateProposal,
  SolarisCalendarEventMoveProposal,
  SolarisCalendarEventResizeProposal,
} from '../../model/calendar-drag.types';
import type { SolarisWeekViewSlotSelect } from '../../week-view';
import { SolarisCalendarWeekViewComponent } from '../../week-view';
import { SolarisCalendarYearViewComponent } from '../../year-view';
import { SolarisCalendarMonthViewComponent } from '../../month-view';
import { SolarisCalendarScheduleViewComponent } from '../../schedule-view';
import {
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
  readonly density = input<SolarisCalendarDensity>('comfortable');
  readonly size = input<SolarisCalendarSize>('md');
  readonly responsiveFallback =
    input<SolarisCalendarResponsiveFallback>('schedule');
  readonly timeZones = input<string[]>([
    'America/Sao_Paulo',
    'America/New_York',
    'Europe/Berlin',
    'UTC',
  ]);

  readonly viewChange = output<SolarisCalendarView>();
  readonly daySelect = output<string>();
  readonly eventOpen = output<{ id: string; start: string }>();
  readonly slotSelect = output<SolarisWeekViewSlotSelect>();
  readonly taskToggle = output<string>();
  readonly eventCreate = output<SolarisCalendarEventCreateProposal>();
  readonly eventMove = output<SolarisCalendarEventMoveProposal>();
  readonly eventResize = output<SolarisCalendarEventResizeProposal>();

  private readonly instanceId = nextIdFor('solaris-calendar');
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  private narrowQuery: MediaQueryList | null = null;
  private readonly onNarrowChange = (event: MediaQueryListEvent): void => {
    this.isNarrow.set(event.matches);
  };

  protected readonly isNarrow = signal(false);
  protected readonly announcement = signal('');
  protected readonly miniOffset = signal(0);
  protected readonly timeZoneLabelId = `${this.instanceId}-tz-label`;

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
    if (view === 'day' || view === 'schedule') {
      return new Intl.DateTimeFormat(this.locale(), {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(Date.UTC(ref.year, ref.month - 1, ref.day)));
    }
    return new Intl.DateTimeFormat(this.locale(), {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(ref.year, ref.month - 1, 1)));
  });

  protected readonly timeZoneLabel = computed(() =>
    this.resolveText('solaris.calendar.timeZoneLabel', {
      zone: this.timeZone(),
      offset: formatTimeZoneOffset(this.timeZone(), Date.now()),
    }),
  );

  protected readonly miniLabel = computed(() => {
    const shifted = addSolarisMonths(
      resolveMiniMonth(this.focusedDate()),
      this.miniOffset(),
    );
    const label = new Intl.DateTimeFormat(this.locale(), {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(shifted.year, shifted.month, 1)));
    return this.resolveText('solaris.calendar.miniMonthLabel', {
      month: label,
    });
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

  protected readonly viewOptions = computed(() =>
    (['day', 'week', 'month', 'year', 'schedule', 'custom'] as const).map(
      (option) => ({
        value: option,
        label: this.viewLabel(option),
      }),
    ),
  );

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

  protected viewId(option: string): string {
    return `${this.instanceId}-view-${option}`;
  }

  protected isActiveView(option: string): boolean {
    return this.normalizedView() === option;
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

  protected previousText(): string {
    return this.resolveText('solaris.calendar.shellPrevious', {});
  }

  protected nextText(): string {
    return this.resolveText('solaris.calendar.shellNext', {});
  }

  protected todayText(): string {
    return this.resolveText('solaris.calendar.today', {});
  }

  protected weekendsText(): string {
    return this.resolveText('solaris.calendar.showWeekends', {});
  }

  protected customDaysText(): string {
    return this.resolveText('solaris.calendar.customDays', {});
  }

  protected selectView(option: string): void {
    const next = normalizeShellView(option);
    this.view.set(next);
    this.viewChange.emit(next);
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

  protected shiftMini(delta: number): void {
    this.miniOffset.set(this.miniOffset() + delta);
  }

  protected pickMini(date: string): void {
    if (parseSolarisDateParts(date) === null) return;
    this.focusedDate.set(date);
    this.daySelect.emit(date);
    this.announcement.set(this.titleLabel());
  }

  protected onCustomDays(value: string): void {
    const numeric = Number(value);
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

  private resolveText(key: string, params: Record<string, string>): string {
    const service = this.translateService;
    if (service) return service.translate(key, params);
    return resolveCalendarFallback(this.locale(), key, params);
  }

  // why: keep the template free of date math; the shell never mutates events.
}
