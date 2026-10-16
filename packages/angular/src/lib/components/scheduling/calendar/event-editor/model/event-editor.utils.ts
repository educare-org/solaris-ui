import {
  getTimeZoneOffsetMinutes,
  parseSolarisDateParts,
  parseSolarisDateTimeMs,
  resolveSolarisWallTimeMs,
  toSolarisDateInZone,
  toSolarisDateTimeValue,
} from '../../model/calendar-datetime.utils';
import type {
  SolarisCalendarEvent,
  SolarisRecurrence,
  SolarisRecurrenceFrequency,
} from '../../model/calendar.types';
import { SOLARIS_EVENT_EDITOR_REMINDER_PRESETS } from './event-editor.constants';
import type {
  SolarisEventEditorEndsMode,
  SolarisEventEditorFreq,
  SolarisEventEditorReminderRow,
} from './event-editor.types';

export function eventEditorDefaultTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC';
  } catch {
    return 'UTC';
  }
}

export function isEditorFreqValue(
  value: unknown,
): value is SolarisEventEditorFreq {
  return (
    value === 'none' ||
    value === 'daily' ||
    value === 'weekly' ||
    value === 'monthly' ||
    value === 'yearly' ||
    value === 'custom'
  );
}

export function resolveEditorEffectiveFreq(
  freq: SolarisEventEditorFreq,
  customFreq: SolarisRecurrenceFrequency,
): SolarisRecurrenceFrequency | null {
  if (freq === 'none') return null;
  if (freq === 'custom') return customFreq;
  return freq;
}

export function defaultEditorWeekday(civilDate: string | null): number {
  if (civilDate === null) return new Date().getUTCDay();
  return new Date(`${civilDate}T00:00:00Z`).getUTCDay();
}

export function editorWallToValue(
  date: string,
  time: string,
  zone: string,
): string | null {
  const parts = parseSolarisDateParts(date);
  if (parts === null) return null;
  const match = /^(\d{2}):(\d{2})$/.exec(time);
  if (match === null) return null;
  const instant = resolveSolarisWallTimeMs(zone, {
    ...parts,
    hour: Number(match[1]),
    minute: Number(match[2]),
    second: 0,
  });
  return toSolarisDateTimeValue(instant, zone);
}

export function editorTimeOfValue(value: string, zone: string): string {
  const instant = parseSolarisDateTimeMs(value);
  if (instant === null) return '09:00';
  try {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      timeZone: zone,
    }).format(new Date(instant));
  } catch {
    return splitEditorTime(value)?.time ?? '09:00';
  }
}

export function splitEditorTime(
  value: string,
): { date: string; time: string } | null {
  const instant = parseSolarisDateTimeMs(value);
  if (instant === null) return null;
  const iso = new Date(instant).toISOString();
  return { date: iso.slice(0, 10), time: iso.slice(11, 16) };
}

export function editorTimeZoneOffsetLabel(zone: string): string {
  let offset: string;
  try {
    const minutes = getTimeZoneOffsetMinutes(zone, Date.now());
    const sign = minutes < 0 ? '-' : '+';
    const absolute = Math.abs(minutes);
    const pad = (part: number): string => String(part).padStart(2, '0');
    offset = `GMT${sign}${pad(Math.floor(absolute / 60))}:${pad(absolute % 60)}`;
  } catch {
    return zone;
  }
  return `${zone} (${offset})`;
}

export interface SolarisEditorTimeZoneChoice {
  readonly zone: string;
  readonly label: string;
}

export function resolveTimeZoneChoices(
  provided: readonly string[] | undefined,
  curated: readonly string[],
  current: string,
): SolarisEditorTimeZoneChoice[] {
  const catalog = provided ?? curated;
  const base =
    current && !catalog.includes(current)
      ? [current, ...catalog]
      : [...catalog];
  return base.map((zone) => ({
    zone,
    label: editorTimeZoneOffsetLabel(zone),
  }));
}

let editorReminderKey = 0;

export function nextEditorReminderKey(): number {
  editorReminderKey += 1;
  return editorReminderKey;
}

export function hydrateEditorReminders(
  reminders: SolarisCalendarEvent['reminders'],
): SolarisEventEditorReminderRow[] {
  const source = reminders ?? [{ minutesBefore: 10 }];
  return source.map((item) => ({
    key: nextEditorReminderKey(),
    minutes: item.minutesBefore,
    custom: !SOLARIS_EVENT_EDITOR_REMINDER_PRESETS.includes(item.minutesBefore),
  }));
}

export interface SolarisEditorDraftRange {
  readonly start: string;
  readonly end: string;
}

export interface SolarisEditorDraftRangeInput {
  readonly allDay: boolean;
  readonly startDate: string;
  readonly endDate: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly startZone: string;
  readonly endZone: string;
  readonly fallbackStart: string;
  readonly fallbackEnd: string;
}

export function resolveEditorDraftRange(
  input: SolarisEditorDraftRangeInput,
): SolarisEditorDraftRange {
  if (input.allDay) {
    return {
      start: input.startDate,
      end: input.endDate < input.startDate ? input.startDate : input.endDate,
    };
  }
  const start =
    editorWallToValue(input.startDate, input.startTime, input.startZone) ??
    input.fallbackStart;
  const endWall = editorWallToValue(
    input.endDate,
    input.endTime,
    input.endZone,
  );
  const end = endWall ?? start;
  return { start, end: end < start ? start : end };
}

export interface SolarisEditorRecurrenceInput {
  readonly freq: SolarisEventEditorFreq;
  readonly customFreq: SolarisRecurrenceFrequency;
  readonly interval: number;
  readonly byWeekday: readonly number[];
  readonly endsMode: SolarisEventEditorEndsMode;
  readonly endsCount: number;
  readonly endsUntil: string | null;
  readonly startDate: string;
}

function applyEditorRecurrenceEnd(
  recurrence: SolarisRecurrence,
  input: SolarisEditorRecurrenceInput,
): void {
  if (input.endsMode === 'count') {
    recurrence.count = Math.max(1, Math.floor(input.endsCount));
  } else if (input.endsMode === 'until' && input.endsUntil !== null) {
    recurrence.until = input.endsUntil;
  }
}

export function buildEditorRecurrence(
  input: SolarisEditorRecurrenceInput,
): SolarisRecurrence | undefined {
  if (input.freq === 'none') return undefined;
  const custom = input.freq === 'custom';
  const freq = custom ? input.customFreq : input.freq;
  const recurrence: SolarisRecurrence = {
    freq,
    interval: custom ? Math.max(1, Math.floor(input.interval)) : 1,
  };
  if (freq === 'weekly') recurrence.byWeekday = [...input.byWeekday];
  if (freq === 'monthly') {
    const parts = parseSolarisDateParts(input.startDate);
    if (parts !== null) recurrence.monthDay = parts.day;
  }
  if (custom) applyEditorRecurrenceEnd(recurrence, input);
  return recurrence;
}

export interface SolarisEditorDateState {
  readonly allDay: boolean;
  readonly startDate: string | null;
  readonly endDate: string | null;
  readonly startTime: string;
  readonly endTime: string;
}

export interface SolarisEditorDateSource {
  readonly start: string;
  readonly end: string;
  readonly allDay?: boolean;
}

export function hydrateEditorDates(
  source: SolarisEditorDateSource,
  startZone: string,
  endZone: string,
): SolarisEditorDateState {
  const allDay =
    source.allDay === true || parseSolarisDateTimeMs(source.start) === null;
  if (allDay) {
    return {
      allDay,
      startDate: source.start.slice(0, 10),
      endDate: source.end.slice(0, 10),
      startTime: '09:00',
      endTime: '10:00',
    };
  }
  const startDate = toSolarisDateInZone(source.start, startZone);
  const endDate = toSolarisDateInZone(source.end, endZone);
  return {
    allDay,
    startDate,
    endDate: endDate ?? startDate,
    startTime: editorTimeOfValue(source.start, startZone),
    endTime: editorTimeOfValue(source.end, endZone),
  };
}

export interface SolarisEditorRecurrenceState {
  readonly freq: SolarisEventEditorFreq;
  readonly customFreq: SolarisRecurrenceFrequency;
  readonly interval: number;
  readonly byWeekday: number[];
  readonly endsMode: SolarisEventEditorEndsMode;
  readonly endsCount: number;
  readonly endsUntil: string | null;
}

export function hydrateEditorRecurrence(
  recurrence: SolarisRecurrence | undefined,
  zone: string,
): SolarisEditorRecurrenceState {
  const empty: SolarisEditorRecurrenceState = {
    freq: 'none',
    customFreq: 'daily',
    interval: 1,
    byWeekday: [],
    endsMode: 'never',
    endsCount: 4,
    endsUntil: null,
  };
  if (recurrence === undefined) return empty;
  const interval = recurrence.interval ?? 1;
  const hasEnd =
    recurrence.count !== undefined || recurrence.until !== undefined;
  const simple = interval <= 1 && !hasEnd;
  const state: SolarisEditorRecurrenceState = {
    ...empty,
    freq: simple ? recurrence.freq : 'custom',
    customFreq: recurrence.freq,
    interval,
    byWeekday: [...(recurrence.byWeekday ?? [])],
  };
  if (recurrence.count !== undefined) {
    return { ...state, endsMode: 'count', endsCount: recurrence.count };
  }
  if (recurrence.until !== undefined) {
    const civil = parseSolarisDateParts(recurrence.until);
    return {
      ...state,
      endsMode: 'until',
      endsUntil:
        civil !== null
          ? recurrence.until
          : toSolarisDateInZone(recurrence.until, zone),
    };
  }
  return state;
}
