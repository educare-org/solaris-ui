import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SolarisButtonDirective } from '../../../../actions/button';
import { SolarisCheckboxComponent } from '../../../../forms/checkbox';
import {
  SolarisFormFieldComponent,
  SolarisFormErrorComponent,
} from '../../../../forms/form-field';
import { SolarisInputDirective } from '../../../../forms/input';
import { SolarisDatePickerComponent } from '../../../../forms/date-picker';
import { SolarisSelectComponent } from '../../../../forms/select';
import {
  SolarisOptionComponent,
  SolarisOptionLeadingDirective,
} from '../../../../forms/option';
import { SolarisTextareaDirective } from '../../../../forms/textarea';
import { SolarisRadioGroupComponent } from '../../../../forms/radio-group';
import { SolarisRadioComponent } from '../../../../forms/radio';
import {
  SolarisSegmentedControlComponent,
  SolarisSegmentedItemComponent,
} from '../../../../navigation/segmented-control';
import {
  SolarisDialogFooterComponent,
  SolarisDialogService,
} from '../../../../overlay/dialog';
import { SolarisVisuallyHiddenDirective } from '../../../../../services/accessibility';
import {
  SolarisTranslatePipe,
  SolarisTranslateService,
} from '../../../../../services/translation';
import {
  SolarisEventEditorTimezoneDialogComponent,
  type SolarisEventEditorTimezoneData,
  type SolarisEventEditorTimezoneResult,
} from './event-editor-timezone-dialog.component';
import { localeFirstDay } from '../../../../forms/date/model/date.utils';
import type {
  SolarisCalendarEvent,
  SolarisCalendarEventColor,
  SolarisCalendarTask,
  SolarisEventReminder,
  SolarisEventVisibility,
  SolarisRecurrenceFrequency,
} from '../../model/calendar.types';
import type {
  SolarisEventDeleteScope,
  SolarisEventDeleteRequest,
  SolarisEventEditorDensity,
  SolarisEventEditorEndsMode,
  SolarisEventEditorFreq,
  SolarisEventEditorItemKind,
  SolarisEventEditorReminderRow,
  SolarisEventEditorSize,
  SolarisEventSaveRequest,
} from '../model/event-editor.types';
import {
  SOLARIS_EVENT_EDITOR_COLOR_OPTIONS,
  SOLARIS_EVENT_EDITOR_MAX_REMINDERS,
  SOLARIS_EVENT_EDITOR_REMINDER_PRESETS,
} from '../model/event-editor.constants';
import {
  buildEditorRecurrence,
  defaultEditorWeekday,
  eventEditorDefaultTimeZone,
  hydrateEditorDates,
  hydrateEditorRecurrence,
  hydrateEditorReminders,
  isEditorFreqValue,
  nextEditorReminderKey,
  resolveEditorDraftRange,
  resolveEditorEffectiveFreq,
} from '../model/event-editor.utils';
import { SolarisIconButtonDirective } from '../../../../actions/icon-button';
import { SolarisIconComponent } from '../../../../icon';

function parseAttendeeEmails(value: string): { email: string }[] {
  const seen = new Set<string>();
  const output: { email: string }[] = [];
  for (const raw of value.split(/[,;\n]/)) {
    const email = raw.trim();
    if (email.length === 0 || !email.includes('@')) continue;
    const key = email.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    output.push({ email });
  }
  return output;
}

function parseResourceIds(value: string): string[] {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const raw of value.split(/[,;\n]/)) {
    const id = raw.trim();
    if (id.length === 0 || seen.has(id)) continue;
    seen.add(id);
    output.push(id);
  }
  return output;
}

@Component({
  selector: 'solaris-calendar-event-editor',
  standalone: true,
  imports: [
    FormsModule,
    SolarisButtonDirective,
    SolarisCheckboxComponent,
    SolarisFormFieldComponent,
    SolarisFormErrorComponent,
    SolarisInputDirective,
    SolarisDatePickerComponent,
    SolarisSelectComponent,
    SolarisOptionComponent,
    SolarisOptionLeadingDirective,
    SolarisTextareaDirective,
    SolarisRadioGroupComponent,
    SolarisRadioComponent,
    SolarisSegmentedControlComponent,
    SolarisSegmentedItemComponent,
    SolarisDialogFooterComponent,
    SolarisVisuallyHiddenDirective,
    SolarisTranslatePipe,
    SolarisIconButtonDirective,
    SolarisIconComponent,
  ],
  templateUrl: './event-editor.component.html',
  styleUrls: ['./event-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'density()',
    class: 'solaris-calendar-event-editor',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class SolarisCalendarEventEditorComponent implements OnInit {
  readonly event = input.required<SolarisCalendarEvent | SolarisCalendarTask>();
  readonly occurrenceStart = input<string | null>(null);
  readonly timeZone = input<string>(eventEditorDefaultTimeZone());
  readonly timeZoneEnd = input<string | undefined>(undefined);
  readonly locale = input.required<string>();
  readonly size = input<SolarisEventEditorSize>('md');
  readonly density = input<SolarisEventEditorDensity>('comfortable');
  readonly disabled = input<boolean>(false);
  readonly timeZoneOptions = input<readonly string[] | undefined>(undefined);

  readonly eventSave = output<SolarisEventSaveRequest>();
  readonly eventDelete = output<SolarisEventDeleteRequest>();
  readonly eventCancel = output<void>();
  readonly timeZoneChange = output<string>();
  readonly timeZoneEndChange = output<string>();
  readonly itemKindChange = output<SolarisEventEditorItemKind>();

  private readonly translateService = inject(SolarisTranslateService);
  private readonly dialogService = inject(SolarisDialogService, {
    optional: true,
  });

  protected readonly itemKind = signal<SolarisEventEditorItemKind>('event');
  protected readonly title = signal('');
  protected readonly description = signal('');
  protected readonly meetingUrl = signal('');
  protected readonly attendeesText = signal('');
  protected readonly resourcesText = signal('');
  protected readonly startDate = signal<string | null>(null);
  protected readonly startTime = signal('09:00');
  protected readonly endDate = signal<string | null>(null);
  protected readonly endTime = signal('10:00');
  protected readonly allDay = signal(false);
  protected readonly separateTimeZones = signal(false);
  protected readonly freq = signal<SolarisEventEditorFreq>('none');
  protected readonly customFreq = signal<SolarisRecurrenceFrequency>('daily');
  protected readonly interval = signal(1);
  protected readonly byWeekday = signal<number[]>([]);
  protected readonly endsMode = signal<SolarisEventEditorEndsMode>('never');
  protected readonly endsCount = signal(4);
  protected readonly endsUntil = signal<string | null>(null);
  protected readonly deleteScope = signal<SolarisEventDeleteScope>('this');
  protected readonly color = signal<SolarisCalendarEventColor>('info');
  protected readonly visibility = signal<SolarisEventVisibility>('public');
  protected readonly reminders = signal<SolarisEventEditorReminderRow[]>([
    { key: nextEditorReminderKey(), minutes: 10, custom: false },
  ]);
  protected readonly touched = signal(false);
  protected readonly announcement = signal('');

  protected readonly reminderPresets = SOLARIS_EVENT_EDITOR_REMINDER_PRESETS;
  protected readonly maxReminders = SOLARIS_EVENT_EDITOR_MAX_REMINDERS;

  protected readonly colorOptions = SOLARIS_EVENT_EDITOR_COLOR_OPTIONS;

  protected readonly isTask = computed(() => this.itemKind() === 'task');

  protected readonly isCustomRecurrence = computed(
    () => this.freq() === 'custom',
  );

  protected readonly showScope = computed(() => {
    const source = this.event();
    if (source.kind !== 'event') return false;
    if (source.recurrence === undefined) return false;
    return this.occurrenceStart() !== null;
  });

  protected readonly effectiveFreq =
    computed<SolarisRecurrenceFrequency | null>(() => {
      const freq = this.freq();
      if (freq === 'none') return null;
      if (freq === 'custom') return this.customFreq();
      return freq;
    });

  protected readonly endZone = computed(() =>
    this.separateTimeZones()
      ? (this.timeZoneEnd() ?? this.timeZone())
      : this.timeZone(),
  );

  protected readonly weekdayOrder = computed(() => {
    const start = localeFirstDay(this.locale());
    return Array.from({ length: 7 }, (_, index) => (start + index) % 7);
  });

  protected readonly titleInvalid = computed(
    () => this.touched() && this.title().trim().length === 0,
  );

  protected readonly rangeInvalid = computed(() => {
    const start = this.startDate();
    if (start === null) return this.touched();
    if (this.isTask()) return false;
    const end = this.endDate();
    if (end === null) return this.touched();
    if (end < start) return true;
    return !this.allDay() && start === end && this.endTime() < this.startTime();
  });

  protected readonly recurrenceInvalid = computed(() => {
    if (this.isTask() || this.freq() === 'none') return false;
    if (!this.isCustomRecurrence()) {
      return this.effectiveFreq() === 'weekly' && this.byWeekday().length === 0;
    }
    if (!Number.isInteger(this.interval()) || this.interval() < 1) return true;
    if (this.effectiveFreq() === 'weekly' && this.byWeekday().length === 0)
      return true;
    if (this.endsMode() === 'count' && this.endsCount() < 1) return true;
    return this.endsMode() === 'until' && this.endsUntil() === null;
  });

  protected readonly remindersInvalid = computed(
    () =>
      !this.isTask() &&
      this.reminders().some(
        (row) =>
          !Number.isInteger(row.minutes) ||
          row.minutes < 0 ||
          row.minutes > 40320,
      ),
  );

  protected readonly saveDisabled = computed(
    () =>
      this.disabled() ||
      this.title().trim().length === 0 ||
      this.startDate() === null ||
      (!this.isTask() && this.endDate() === null) ||
      this.rangeInvalid() ||
      this.recurrenceInvalid() ||
      this.remindersInvalid(),
  );

  ngOnInit(): void {
    this.separateTimeZones.set(this.timeZoneEnd() !== undefined);
    this.hydrate(this.event());
  }

  protected onItemKind(value: unknown): void {
    if (value !== 'event' && value !== 'task' && value !== 'schedule') return;
    this.itemKind.set(value);
    this.itemKindChange.emit(value);
  }

  protected onTitleInput(value: string): void {
    this.title.set(value);
  }

  protected onDescriptionInput(value: string): void {
    this.description.set(value);
  }

  protected onMeetingUrlInput(value: string): void {
    this.meetingUrl.set(value);
  }

  protected onAttendeesInput(value: string): void {
    this.attendeesText.set(value);
  }

  protected onResourcesInput(value: string): void {
    this.resourcesText.set(value);
  }

  protected onStartDate(value: string | null): void {
    this.startDate.set(value);
  }

  protected onEndDate(value: string | null): void {
    this.endDate.set(value);
  }

  protected onAllDay(value: boolean): void {
    this.allDay.set(value);
  }

  protected onFreq(value: unknown): void {
    if (!isEditorFreqValue(value)) return;
    this.freq.set(value);
    this.ensureWeekdayDefault(
      resolveEditorEffectiveFreq(value, this.customFreq()),
    );
    this.announce(this.freqLabel(value));
  }

  protected onCustomFreq(value: unknown): void {
    if (
      value === 'daily' ||
      value === 'weekly' ||
      value === 'monthly' ||
      value === 'yearly'
    ) {
      this.customFreq.set(value);
      this.ensureWeekdayDefault(value);
      this.announce(this.freqLabel(value));
    }
  }

  private ensureWeekdayDefault(freq: SolarisRecurrenceFrequency | null): void {
    if (freq !== 'weekly' || this.byWeekday().length > 0) return;
    this.byWeekday.set([defaultEditorWeekday(this.startDate())]);
  }

  protected onVisibility(value: unknown): void {
    if (value === 'public' || value === 'private') {
      this.visibility.set(value);
    }
  }

  protected onEndsMode(value: unknown): void {
    if (value === 'never' || value === 'count' || value === 'until') {
      this.endsMode.set(value);
    }
  }

  protected onIntervalInput(value: string): void {
    const parsed = Number.parseInt(value, 10);
    this.interval.set(Number.isFinite(parsed) ? parsed : 1);
  }

  protected onCountInput(value: string): void {
    const parsed = Number.parseInt(value, 10);
    this.endsCount.set(Number.isFinite(parsed) ? parsed : 1);
  }

  protected onEndsUntil(value: string | null): void {
    this.endsUntil.set(value);
  }

  protected toggleWeekday(day: number): void {
    const current = this.byWeekday();
    const next = current.includes(day)
      ? current.filter((item) => item !== day)
      : [...current, day].sort((a, b) => a - b);
    this.byWeekday.set(next);
    this.announce(this.weekdayName(day));
  }

  protected isWeekdaySelected(day: number): boolean {
    return this.byWeekday().includes(day);
  }

  protected onDeleteScope(value: unknown): void {
    if (value === 'this' || value === 'following' || value === 'all') {
      this.deleteScope.set(value);
    }
  }

  protected onReminderPreset(key: number, value: unknown): void {
    if (value === 'custom') {
      this.reminders.update((rows) =>
        rows.map((row) => (row.key === key ? { ...row, custom: true } : row)),
      );
      return;
    }
    const minutes = typeof value === 'string' ? Number(value) : Number.NaN;
    if (!Number.isInteger(minutes) || minutes < 0) return;
    this.reminders.update((rows) =>
      rows.map((row) =>
        row.key === key ? { ...row, minutes, custom: false } : row,
      ),
    );
  }

  protected onReminderCustomMinutes(key: number, value: string): void {
    const parsed = Number.parseInt(value, 10);
    this.reminders.update((rows) =>
      rows.map((row) =>
        row.key === key
          ? { ...row, minutes: Number.isFinite(parsed) ? parsed : 0 }
          : row,
      ),
    );
  }

  protected reminderSelectValue(row: SolarisEventEditorReminderRow): string {
    if (
      row.custom ||
      !SOLARIS_EVENT_EDITOR_REMINDER_PRESETS.includes(row.minutes)
    ) {
      return 'custom';
    }
    return String(row.minutes);
  }

  protected addReminder(): void {
    if (this.disabled()) return;
    const rows = this.reminders();
    if (rows.length >= SOLARIS_EVENT_EDITOR_MAX_REMINDERS) return;
    const used = new Set(rows.map((row) => row.minutes));
    const fallback =
      SOLARIS_EVENT_EDITOR_REMINDER_PRESETS.find(
        (preset) => !used.has(preset),
      ) ?? SOLARIS_EVENT_EDITOR_REMINDER_PRESETS[0];
    this.reminders.update((current) => [
      ...current,
      { key: nextEditorReminderKey(), minutes: fallback, custom: false },
    ]);
  }

  protected removeReminder(key: number): void {
    if (this.disabled()) return;
    this.reminders.update((rows) => rows.filter((row) => row.key !== key));
  }

  protected reminderLabel(minutes: number): string {
    if (minutes === 0) {
      return this.translateService.translate(
        'solaris.calendar.editorReminderAtStart',
      );
    }
    if (minutes === 60) {
      return this.translateService.translate(
        'solaris.calendar.editorReminderHour',
      );
    }
    if (minutes === 1440) {
      return this.translateService.translate(
        'solaris.calendar.editorReminderDay',
      );
    }
    return this.translateService.translate(
      'solaris.calendar.editorReminderMinutes',
      { count: String(minutes) },
    );
  }

  protected onSave(): void {
    this.touched.set(true);
    if (this.saveDisabled()) {
      this.announce(
        this.translateService.translate('solaris.calendar.editorInvalid'),
      );
      return;
    }
    this.eventSave.emit({
      event: this.buildDraft(),
      scope: this.showScope() ? this.deleteScope() : 'all',
      occurrenceStart: this.occurrenceStart(),
    });
  }

  protected onDelete(): void {
    if (this.disabled()) return;
    this.eventDelete.emit({
      scope: this.deleteScope(),
      eventId: this.event().id,
      occurrenceStart: this.occurrenceStart(),
    });
  }

  protected onCancel(): void {
    this.eventCancel.emit();
  }

  protected onTimeZoneChange(): void {
    if (this.disabled()) return;
    const dialog = this.dialogService;
    if (!dialog) {
      this.timeZoneChange.emit(this.timeZone());
      return;
    }
    const data: SolarisEventEditorTimezoneData = {
      current: this.timeZone(),
      endCurrent: this.timeZoneEnd() ?? this.timeZone(),
      separate: this.separateTimeZones(),
      locale: this.locale(),
      options: this.timeZoneOptions(),
    };
    const ref = dialog.openComponent<
      SolarisEventEditorTimezoneDialogComponent,
      SolarisEventEditorTimezoneResult | null,
      SolarisEventEditorTimezoneData
    >(SolarisEventEditorTimezoneDialogComponent, {
      title: this.translateService.translate(
        'solaris.calendar.editorTimezoneTitle',
      ),
      width: '560px',
      data,
    });
    ref.afterClosed().subscribe((result) => {
      if (
        !result ||
        typeof result.start !== 'string' ||
        result.start.length === 0
      ) {
        return;
      }
      this.timeZoneChange.emit(result.start);
      this.separateTimeZones.set(result.end !== null);
      if (result.end !== null) this.timeZoneEndChange.emit(result.end);
    });
  }

  protected onColor(value: unknown): void {
    if (typeof value !== 'string') return;
    if (
      value === 'primary' ||
      value === 'success' ||
      value === 'warning' ||
      value === 'danger' ||
      value === 'info' ||
      value === 'accent' ||
      value === 'violet' ||
      value === 'neutral'
    ) {
      this.color.set(value);
      this.announce(this.colorName(value));
    }
  }

  protected colorName(value: SolarisCalendarEventColor): string {
    switch (value) {
      case 'primary':
        return this.translateService.translate(
          'solaris.calendar.editorColorPrimary',
        );
      case 'success':
        return this.translateService.translate(
          'solaris.calendar.editorColorSuccess',
        );
      case 'warning':
        return this.translateService.translate(
          'solaris.calendar.editorColorWarning',
        );
      case 'danger':
        return this.translateService.translate(
          'solaris.calendar.editorColorDanger',
        );
      case 'info':
        return this.translateService.translate(
          'solaris.calendar.editorColorInfo',
        );
      case 'accent':
        return this.translateService.translate(
          'solaris.calendar.editorColorAccent',
        );
      case 'violet':
        return this.translateService.translate(
          'solaris.calendar.editorColorViolet',
        );
      case 'neutral':
        return this.translateService.translate(
          'solaris.calendar.editorColorNeutral',
        );
    }
  }

  private buildDraft(): SolarisCalendarEvent | SolarisCalendarTask {
    if (this.itemKind() === 'task') return this.buildTaskDraft();
    return this.buildEventDraft();
  }

  private draftRange(): { start: string; end: string; startDate: string } {
    const source = this.event();
    const fallback = source.kind === 'task' ? source.due : source.start;
    const fallbackEnd = source.kind === 'task' ? source.due : source.end;
    const startDate = this.startDate() ?? fallback.slice(0, 10);
    const endDate = this.endDate() ?? startDate;
    const { start, end } = resolveEditorDraftRange({
      allDay: this.allDay(),
      startDate,
      endDate,
      startTime: this.startTime(),
      endTime: this.endTime(),
      startZone: this.timeZone(),
      endZone: this.endZone(),
      fallbackStart: fallback,
      fallbackEnd: fallbackEnd,
    });
    return { start, end, startDate };
  }

  private buildTaskDraft(): SolarisCalendarTask {
    const source = this.event();
    const { start } = this.draftRange();
    return {
      id: source.id,
      kind: 'task',
      title: this.title().trim(),
      ...(source.kind === 'task' && source.titleKey !== undefined
        ? { titleKey: source.titleKey }
        : {}),
      due: start,
      completed: source.kind === 'task' ? source.completed : false,
      description: this.description().trim() || undefined,
    };
  }

  private buildEventDraft(): SolarisCalendarEvent {
    const source = this.event();
    const { start, end, startDate } = this.draftRange();
    const description = this.description().trim() || undefined;
    const meetingUrl = this.meetingUrl().trim() || undefined;
    const attendees = parseAttendeeEmails(this.attendeesText());
    const resources = parseResourceIds(this.resourcesText());

    const draft: SolarisCalendarEvent = {
      id: source.id,
      kind: 'event',
      title: this.title().trim(),
      start,
      end,
      allDay: this.allDay(),
      color: this.color(),
      visibility: this.visibility(),
      reminders: this.reminders().map(
        (row): SolarisEventReminder => ({ minutesBefore: row.minutes }),
      ),
      description,
      meetingUrl,
      scheduleSlot: this.itemKind() === 'schedule' ? true : undefined,
      ...(attendees.length > 0 ? { attendees } : {}),
      ...(resources.length > 0 ? { resources } : {}),
      ...(source.kind === 'event' && source.calendarId !== undefined
        ? { calendarId: source.calendarId }
        : {}),
    };

    const recurrence = buildEditorRecurrence({
      freq: this.freq(),
      customFreq: this.customFreq(),
      interval: this.interval(),
      byWeekday: this.byWeekday(),
      endsMode: this.endsMode(),
      endsCount: this.endsCount(),
      endsUntil: this.endsUntil(),
      startDate,
    });
    if (recurrence === undefined) {
      delete draft.recurrence;
    } else {
      draft.recurrence = recurrence;
    }

    if (
      source.kind === 'event' &&
      source.recurrenceExceptionDates !== undefined
    ) {
      draft.recurrenceExceptionDates = [...source.recurrenceExceptionDates];
    }
    return draft;
  }

  private hydrate(source: SolarisCalendarEvent | SolarisCalendarTask): void {
    let itemKind: SolarisEventEditorItemKind = 'event';
    if (source.kind === 'task') {
      itemKind = 'task';
    } else if (source.scheduleSlot === true) {
      itemKind = 'schedule';
    }
    this.itemKind.set(itemKind);
    this.title.set(source.title);
    this.description.set(source.description ?? '');
    this.meetingUrl.set(
      source.kind === 'event' ? (source.meetingUrl ?? '') : '',
    );
    this.attendeesText.set(
      source.kind === 'event'
        ? (source.attendees ?? []).map((attendee) => attendee.email).join(', ')
        : '',
    );
    this.resourcesText.set(
      source.kind === 'event' ? (source.resources ?? []).join(', ') : '',
    );
    this.color.set(source.kind === 'event' ? (source.color ?? 'info') : 'info');
    this.visibility.set(
      source.kind === 'event' && source.visibility === 'private'
        ? 'private'
        : 'public',
    );
    this.reminders.set(
      hydrateEditorReminders(
        source.kind === 'event' ? source.reminders : undefined,
      ),
    );

    const startZone = this.timeZone();
    const endZone = this.endZone();
    const dates = hydrateEditorDates(
      source.kind === 'task'
        ? { start: source.due, end: source.due }
        : { start: source.start, end: source.end, allDay: source.allDay },
      startZone,
      endZone,
    );
    this.allDay.set(dates.allDay);
    this.startDate.set(dates.startDate);
    this.endDate.set(dates.endDate);
    this.startTime.set(dates.startTime);
    this.endTime.set(dates.endTime);

    const recurrence = hydrateEditorRecurrence(
      source.kind === 'event' ? source.recurrence : undefined,
      endZone,
    );
    this.freq.set(recurrence.freq);
    this.customFreq.set(recurrence.customFreq);
    this.interval.set(recurrence.interval);
    this.byWeekday.set(recurrence.byWeekday);
    this.endsMode.set(recurrence.endsMode);
    this.endsCount.set(recurrence.endsCount);
    this.endsUntil.set(recurrence.endsUntil);

    if (this.occurrenceStart() !== null) this.deleteScope.set('this');
  }

  private announce(value: string): void {
    this.announcement.set(value);
  }

  protected freqLabel(value: SolarisEventEditorFreq): string {
    switch (value) {
      case 'daily':
        return this.translateService.translate(
          'solaris.calendar.editorFreqDaily',
        );
      case 'weekly':
        return this.translateService.translate(
          'solaris.calendar.editorFreqWeekly',
        );
      case 'monthly':
        return this.translateService.translate(
          'solaris.calendar.editorFreqMonthly',
        );
      case 'yearly':
        return this.translateService.translate(
          'solaris.calendar.editorFreqYearly',
        );
      case 'custom':
        return this.translateService.translate(
          'solaris.calendar.editorFreqCustom',
        );
      default:
        return this.translateService.translate(
          'solaris.calendar.editorFreqNone',
        );
    }
  }

  protected weekdayName(day: number): string {
    try {
      return new Intl.DateTimeFormat(this.locale(), {
        weekday: 'short',
        timeZone: 'UTC',
      }).format(new Date(Date.UTC(2024, 0, day)));
    } catch {
      return `D${day}`;
    }
  }
}
