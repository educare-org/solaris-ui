import {
  addDaysToSolarisDate,
  getTimeZoneOffsetMinutes,
  parseSolarisDateParts,
  shiftSolarisCivilMonth,
} from '../../model/calendar-datetime.utils';
import {
  SOLARIS_CALENDAR_CUSTOM_DAYS_MAX,
  SOLARIS_CALENDAR_CUSTOM_DAYS_MIN,
  SOLARIS_CALENDAR_NARROW_BREAKPOINT_PX,
  SOLARIS_CALENDAR_VIEWS,
  type SolarisCalendarResponsiveFallback,
  type SolarisCalendarView,
} from './shell.types';

// why: pure view/date math lives here so the shell component stays thin and
// the branch coverage bar (≥90% on new code) is provable with unit specs.
export function normalizeShellView(value: unknown): SolarisCalendarView {
  if (typeof value === 'string') {
    const candidate = value as SolarisCalendarView;
    if (
      SOLARIS_CALENDAR_VIEWS.some((allowed) => allowed === candidate) === true
    ) {
      return candidate;
    }
  }
  return 'month';
}

export function normalizeCustomDays(value: unknown): number {
  const numeric = typeof value === 'string' ? Number(value) : value;
  if (typeof numeric !== 'number' || Number.isFinite(numeric) === false)
    return 4;
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
  const sign = minutes <= 0 ? '+' : '-';
  const absolute = Math.abs(minutes);
  const hours = Math.floor(absolute / 60);
  const rest = absolute % 60;
  const padded = (value: number): string => String(value).padStart(2, '0');
  return `GMT${sign}${padded(hours)}:${padded(rest)}`;
}

export function resolveMiniMonth(focusedDate: string): {
  year: number;
  month: number;
} {
  const parts = parseSolarisDateParts(focusedDate);
  if (parts !== null) return { year: parts.year, month: parts.month - 1 };
  return { year: 2026, month: 9 };
}
