import {
  addDaysToSolarisDate,
  addMinutesToSolarisDateTime,
  getTimeZoneOffsetMinutes,
  parseSolarisDateParts,
  resolveSolarisWallTimeMs,
  shiftSolarisCivilMonth,
  toSolarisDateTimeValue,
} from '../../model/calendar-datetime.utils';
import type { SolarisCalendarEvent } from '../../model/calendar.types';
import type { SolarisCalendarEventCreateProposal } from '../../model/calendar-drag.types';
import {
  SOLARIS_CALENDAR_CUSTOM_DAYS_MAX,
  SOLARIS_CALENDAR_CUSTOM_DAYS_MIN,
  SOLARIS_CALENDAR_NARROW_BREAKPOINT_PX,
  SOLARIS_CALENDAR_VIEWS,
  type SolarisCalendarResponsiveFallback,
  type SolarisCalendarView,
} from './shell.types';

export function normalizeShellView(value: unknown): SolarisCalendarView {
  if (typeof value === 'string') {
    const candidate = value as SolarisCalendarView;
    if (SOLARIS_CALENDAR_VIEWS.includes(candidate)) {
      return candidate;
    }
  }
  return 'month';
}

export function normalizeCustomDays(value: unknown): number {
  const numeric = typeof value === 'string' ? Number(value) : value;
  if (typeof numeric !== 'number' || !Number.isFinite(numeric)) return 4;
  const rounded = Math.round(numeric);
  if (rounded < SOLARIS_CALENDAR_CUSTOM_DAYS_MIN) {
    return SOLARIS_CALENDAR_CUSTOM_DAYS_MIN;
  }
  if (rounded > SOLARIS_CALENDAR_CUSTOM_DAYS_MAX) {
    return SOLARIS_CALENDAR_CUSTOM_DAYS_MAX;
  }
  return rounded;
}

export function visibleDaysForView(
  view: SolarisCalendarView,
  customDays: number,
): number {
  switch (view) {
    case 'day':
      return 1;
    case 'week':
      return 7;
    case 'month':
      return 7;
    case 'year':
      return 7;
    case 'schedule':
      return 7;
    case 'custom':
      return normalizeCustomDays(customDays);
    default:
      return 7;
  }
}

export function isNarrowViewport(width: unknown): boolean {
  return (
    typeof width === 'number' &&
    Number.isFinite(width) &&
    width <= SOLARIS_CALENDAR_NARROW_BREAKPOINT_PX
  );
}

export function resolveEffectiveView(
  view: SolarisCalendarView,
  narrow: boolean,
  fallback: SolarisCalendarResponsiveFallback,
): SolarisCalendarView {
  if (narrow && fallback !== null && view !== fallback) return fallback;
  return view;
}

export function shiftShellDate(
  focusedDate: string,
  view: SolarisCalendarView,
  customDays: number,
  delta: number,
): string {
  const safe = parseSolarisDateParts(focusedDate) !== null ? focusedDate : null;
  const anchor = safe ?? focusedDate;
  switch (view) {
    case 'day':
      return addDaysToSolarisDate(anchor, delta) ?? anchor;
    case 'week':
      return addDaysToSolarisDate(anchor, delta * 7) ?? anchor;
    case 'custom':
      return (
        addDaysToSolarisDate(anchor, delta * normalizeCustomDays(customDays)) ??
        anchor
      );
    case 'month':
      return shiftSolarisCivilMonth(anchor, delta) ?? anchor;
    case 'year': {
      const parts = parseSolarisDateParts(anchor);
      if (parts === null) return anchor;
      const year = parts.year + delta;
      const padded = (value: number, length: number): string =>
        String(value).padStart(length, '0');
      return `${padded(year, 4)}-${padded(parts.month, 2)}-${padded(parts.day, 2)}`;
    }
    case 'schedule':
      return addDaysToSolarisDate(anchor, delta * 7) ?? anchor;
    default:
      return anchor;
  }
}

export function formatTimeZoneOffset(
  timeZone: string,
  instantMs: number,
): string {
  const minutes = getTimeZoneOffsetMinutes(timeZone, instantMs);
  const sign = minutes < 0 ? '-' : '+';
  const absolute = Math.abs(minutes);
  const hours = Math.floor(absolute / 60);
  const rest = absolute % 60;
  const padded = (value: number): string => String(value).padStart(2, '0');
  return `GMT${sign}${padded(hours)}:${padded(rest)}`;
}

const FRIENDLY_TIME_ZONE_CITIES: Record<
  string,
  { en: string; pt: string; es: string }
> = {
  'America/Sao_Paulo': { en: 'São Paulo', pt: 'São Paulo', es: 'São Paulo' },
  'America/New_York': { en: 'New York', pt: 'Nova York', es: 'Nueva York' },
  'Europe/Berlin': { en: 'Berlin', pt: 'Berlim', es: 'Berlín' },
  UTC: { en: 'UTC', pt: 'UTC', es: 'UTC' },
};

function timeZoneFallbackLanguage(locale: string): 'en' | 'pt' | 'es' {
  const base = locale.split('-')[0].toLowerCase();
  if (base === 'pt' || base === 'es') return base;
  return 'en';
}

export function resolveTimeZoneCity(zone: string, locale: string): string {
  const known = FRIENDLY_TIME_ZONE_CITIES[zone];
  if (known !== undefined) return known[timeZoneFallbackLanguage(locale)];
  const last = zone.split('/').pop() ?? zone;
  return last.replace(/_/g, ' ');
}

export function formatFriendlyTimeZone(
  zone: string,
  locale: string,
  instantMs: number,
): string {
  if (zone === 'UTC') return 'UTC';
  const city = resolveTimeZoneCity(zone, locale);
  return `${city} (${formatTimeZoneOffset(zone, instantMs)})`;
}

export function capitalizeCalendarFirst(value: string): string {
  if (value.length === 0) return value;
  return value.slice(0, 1).toUpperCase() + value.slice(1);
}

export function resolveMiniMonth(focusedDate: string): {
  year: number;
  month: number;
} {
  const parts = parseSolarisDateParts(focusedDate);
  if (parts !== null) return { year: parts.year, month: parts.month - 1 };
  return { year: 2026, month: 9 };
}

let createIdCounter = 0;

export function newSolarisCreateId(): string {
  try {
    const cryptoRef = typeof crypto !== 'undefined' ? crypto : undefined;
    if (cryptoRef !== undefined && typeof cryptoRef.randomUUID === 'function') {
      return `event-${cryptoRef.randomUUID()}`;
    }
  } catch {
    // Fall through to the counter fallback below (SSR-safe, no throw).
  }
  createIdCounter += 1;
  return `event-new-${Date.now().toString(36)}-${createIdCounter}`;
}

function isValidProposalRange(
  proposal: SolarisCalendarEventCreateProposal,
): boolean {
  if (proposal.allDay) {
    return (
      parseSolarisDateParts(proposal.start) !== null &&
      parseSolarisDateParts(proposal.end) !== null &&
      proposal.end >= proposal.start
    );
  }
  return proposal.end > proposal.start;
}

export function buildSolarisCreateDraft(
  proposal: SolarisCalendarEventCreateProposal,
): SolarisCalendarEvent | null {
  if (typeof proposal.start !== 'string' || proposal.start.length === 0) {
    return null;
  }
  if (typeof proposal.end !== 'string' || proposal.end.length === 0) {
    return null;
  }
  if (!isValidProposalRange(proposal)) return null;
  return {
    id: newSolarisCreateId(),
    kind: 'event',
    title: '',
    start: proposal.start,
    end: proposal.end,
    allDay: proposal.allDay,
  };
}

const SLOT_TIME_PATTERN = /^(\d{2}):(\d{2})$/;
const SLOT_DURATION_MINUTES = 60;

export function buildSolarisSlotDraft(
  date: string,
  time: string,
  timeZone: string,
): SolarisCalendarEvent | null {
  const parts = parseSolarisDateParts(date);
  if (parts === null) return null;
  const match = SLOT_TIME_PATTERN.exec(time);
  if (match === null) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  const startMs = resolveSolarisWallTimeMs(timeZone, {
    ...parts,
    hour,
    minute,
    second: 0,
  });
  const start = toSolarisDateTimeValue(startMs, timeZone);
  const end = addMinutesToSolarisDateTime(
    start,
    SLOT_DURATION_MINUTES,
    timeZone,
  );
  if (end === null) return null;
  return {
    id: newSolarisCreateId(),
    kind: 'event',
    title: '',
    start,
    end,
    allDay: false,
  };
}
