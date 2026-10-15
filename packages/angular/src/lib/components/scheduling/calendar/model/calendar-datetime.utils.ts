import type { SolarisCalendarWeekStart } from './calendar.types';

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DATETIME_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:?\d{2})$/;
const OFFSET_PART_PATTERN = /^GMT([+-])(\d{1,2})(?::(\d{2}))?$/;

const MS_PER_MINUTE = 60_000;

export interface SolarisCivilDate {
  year: number;
  month: number;
  day: number;
}

export interface SolarisCivilTime extends SolarisCivilDate {
  hour: number;
  minute: number;
  second: number;
}

export interface SolarisZonedWall extends SolarisCivilTime {
  offsetMinutes: number;
}

const wallFormatterCache = new Map<string, Intl.DateTimeFormat>();

function wallFormatterFor(timeZone: string): Intl.DateTimeFormat {
  const cached = wallFormatterCache.get(timeZone);
  if (cached) return cached;
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    timeZoneName: 'longOffset',
  });
  wallFormatterCache.set(timeZone, formatter);
  return formatter;
}

function parseOffsetPart(value: string): number | null {
  if (value === 'GMT') return 0;
  const match = OFFSET_PART_PATTERN.exec(value);
  if (!match) return null;
  const sign = match[1] === '-' ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = match[3] === undefined ? 0 : Number(match[3]);
  return sign * (hours * 60 + minutes);
}

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function formatOffset(offsetMinutes: number): string {
  const sign = offsetMinutes < 0 ? '-' : '+';
  const absolute = Math.abs(offsetMinutes);
  return `${sign}${pad2(Math.floor(absolute / 60))}:${pad2(absolute % 60)}`;
}

function isValidCivilDate(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const probe = new Date(Date.UTC(year, month - 1, day));
  return (
    probe.getUTCFullYear() === year &&
    probe.getUTCMonth() === month - 1 &&
    probe.getUTCDate() === day
  );
}

export function isSolarisDateValue(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const match = DATE_PATTERN.exec(value);
  if (!match) return false;
  return isValidCivilDate(Number(match[1]), Number(match[2]), Number(match[3]));
}

export function isSolarisDateTimeValue(value: unknown): value is string {
  return typeof value === 'string' && DATETIME_PATTERN.test(value);
}

export function parseSolarisDateParts(value: string): SolarisCivilDate | null {
  const match = DATE_PATTERN.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return isValidCivilDate(year, month, day) ? { year, month, day } : null;
}

export function parseSolarisDateTimeMs(value: string): number | null {
  if (!DATETIME_PATTERN.test(value)) return null;
  const instant = Date.parse(value);
  return Number.isNaN(instant) ? null : instant;
}

export function getZonedWall(
  timeZone: string,
  instantMs: number,
): SolarisZonedWall {
  const parts = wallFormatterFor(timeZone).formatToParts(new Date(instantMs));
  const byType = new Map(parts.map((part) => [part.type, part.value]));
  const offsetPart = byType.get('timeZoneName') ?? 'GMT';
  const offsetMinutes = parseOffsetPart(offsetPart);
  return {
    year: Number(byType.get('year')),
    month: Number(byType.get('month')),
    day: Number(byType.get('day')),
    hour: Number(byType.get('hour')),
    minute: Number(byType.get('minute')),
    second: Number(byType.get('second')),
    offsetMinutes: offsetMinutes ?? 0,
  };
}

export function getTimeZoneOffsetMinutes(
  timeZone: string,
  instantMs: number,
): number {
  return getZonedWall(timeZone, instantMs).offsetMinutes;
}

export function toSolarisDateTimeValue(
  instantMs: number,
  timeZone: string,
): string {
  const wall = getZonedWall(timeZone, instantMs);
  const remainder = ((instantMs % 1000) + 1000) % 1000;
  const fraction =
    remainder === 0 ? '' : `.${String(remainder).padStart(3, '0')}`;
  return (
    `${String(wall.year).padStart(4, '0')}-${pad2(wall.month)}-${pad2(wall.day)}` +
    `T${pad2(wall.hour)}:${pad2(wall.minute)}:${pad2(wall.second)}${fraction}` +
    formatOffset(wall.offsetMinutes)
  );
}

export function toSolarisDateInZone(
  value: string | number,
  timeZone: string,
): string | null {
  const instant =
    typeof value === 'number' ? value : parseSolarisDateTimeMs(value);
  if (instant === null || Number.isNaN(instant)) return null;
  const wall = getZonedWall(timeZone, instant);
  return `${String(wall.year).padStart(4, '0')}-${pad2(wall.month)}-${pad2(wall.day)}`;
}

export function getWeekdayInZone(
  value: string | number,
  timeZone: string,
): SolarisCalendarWeekStart | null {
  if (typeof value !== 'number' && !isSolarisDateTimeValue(value)) {
    return null;
  }
  const dateValue = toSolarisDateInZone(value, timeZone);
  if (dateValue === null) return null;
  const parts = parseSolarisDateParts(dateValue);
  if (parts === null) return null;
  return new Date(
    Date.UTC(parts.year, parts.month - 1, parts.day),
  ).getUTCDay() as SolarisCalendarWeekStart;
}

export function resolveSolarisWallTimeMs(
  timeZone: string,
  wall: SolarisCivilTime,
): number {
  const wallAsUtcMs = Date.UTC(
    wall.year,
    wall.month - 1,
    wall.day,
    wall.hour,
    wall.minute,
    wall.second,
  );

  let instant = wallAsUtcMs;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const offsetMs =
      getTimeZoneOffsetMinutes(timeZone, instant) * MS_PER_MINUTE;
    const next = wallAsUtcMs - offsetMs;
    if (next === instant) break;
    instant = next;
  }
  return instant;
}

export function addMinutesToSolarisDateTime(
  value: string,
  minutes: number,
  timeZone: string,
): string | null {
  const instant = parseSolarisDateTimeMs(value);
  if (instant === null || !Number.isFinite(minutes)) return null;
  return toSolarisDateTimeValue(instant + minutes * MS_PER_MINUTE, timeZone);
}

export function diffSolarisDateTimeMinutes(
  first: string,
  second: string,
): number | null {
  const firstMs = parseSolarisDateTimeMs(first);
  const secondMs = parseSolarisDateTimeMs(second);
  if (firstMs === null || secondMs === null) return null;
  return Math.round((secondMs - firstMs) / MS_PER_MINUTE);
}

export function compareSolarisDateTimes(
  first: string,
  second: string,
): number | null {
  const firstMs = parseSolarisDateTimeMs(first);
  const secondMs = parseSolarisDateTimeMs(second);
  if (firstMs === null || secondMs === null) return null;
  if (firstMs < secondMs) return -1;
  if (firstMs > secondMs) return 1;
  return 0;
}

export function addDaysToSolarisDate(
  value: string,
  days: number,
): string | null {
  const parts = parseSolarisDateParts(value);
  if (parts === null || !Number.isInteger(days)) return null;
  const shifted = new Date(
    Date.UTC(parts.year, parts.month - 1, parts.day + days),
  );
  return (
    `${String(shifted.getUTCFullYear()).padStart(4, '0')}-` +
    `${pad2(shifted.getUTCMonth() + 1)}-${pad2(shifted.getUTCDate())}`
  );
}

export function addDaysPreservingSolarisWall(
  value: string,
  days: number,
  timeZone: string,
): string | null {
  const instant = parseSolarisDateTimeMs(value);
  if (instant === null || !Number.isInteger(days)) return null;
  const wall = getZonedWall(timeZone, instant);
  const shifted = new Date(
    Date.UTC(wall.year, wall.month - 1, wall.day + days),
  );
  const resolved = resolveSolarisWallTimeMs(timeZone, {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: wall.hour,
    minute: wall.minute,
    second: wall.second,
  });
  return toSolarisDateTimeValue(resolved, timeZone);
}

export function startOfSolarisDay(
  value: string,
  timeZone: string,
): string | null {
  const parts = parseSolarisDateParts(value);
  if (parts === null) return null;
  const resolved = resolveSolarisWallTimeMs(timeZone, {
    ...parts,
    hour: 0,
    minute: 0,
    second: 0,
  });
  return toSolarisDateTimeValue(resolved, timeZone);
}

export function startOfSolarisMonth(
  value: string,
  timeZone: string,
): string | null {
  const parts = parseSolarisDateParts(value);
  if (parts === null) return null;
  const resolved = resolveSolarisWallTimeMs(timeZone, {
    year: parts.year,
    month: parts.month,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
  });
  return toSolarisDateTimeValue(resolved, timeZone);
}

export function startOfSolarisWeek(
  value: string,
  timeZone: string,
  weekStartsOn: SolarisCalendarWeekStart = 0,
): string | null {
  const parts = parseSolarisDateParts(value);
  if (parts === null) return null;
  const weekday = new Date(
    Date.UTC(parts.year, parts.month - 1, parts.day),
  ).getUTCDay();
  const back = (weekday - weekStartsOn + 7) % 7;
  const shifted = new Date(
    Date.UTC(parts.year, parts.month - 1, parts.day - back),
  );
  const resolved = resolveSolarisWallTimeMs(timeZone, {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: 0,
    minute: 0,
    second: 0,
  });
  return toSolarisDateTimeValue(resolved, timeZone);
}
