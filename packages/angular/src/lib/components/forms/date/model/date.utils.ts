import type {
  SolarisCalendarDay,
  SolarisCalendarMonth,
  SolarisDateFormat,
  SolarisDateValue,
  SolarisWeekStartsOn,
} from './date.types';

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseSolarisDate(
  value: string | null | undefined,
): Date | null {
  if (!value) return null;

  const match = ISO_DATE_PATTERN.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? date
    : null;
}

export function toSolarisDate(date: Date): SolarisDateValue {
  return [date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate()]
    .map((part, index) =>
      index === 0
        ? String(part).padStart(4, '0')
        : String(part).padStart(2, '0'),
    )
    .join('-');
}

export function compareSolarisDates(
  first: SolarisDateValue,
  second: SolarisDateValue,
): number {
  return first.localeCompare(second);
}

export function addSolarisMonths(
  month: SolarisCalendarMonth,
  amount: number,
): SolarisCalendarMonth {
  const date = new Date(Date.UTC(month.year, month.month + amount, 1));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() };
}

export function monthForSolarisDate(
  value: SolarisDateValue,
): SolarisCalendarMonth | null {
  const date = parseSolarisDate(value);
  return date
    ? { year: date.getUTCFullYear(), month: date.getUTCMonth() }
    : null;
}

export function todaySolarisDate(): SolarisDateValue {
  const now = new Date();
  return toSolarisDate(
    new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())),
  );
}

export function getCalendarDays(
  month: SolarisCalendarMonth,
  firstDayOfWeek: number,
): SolarisCalendarDay[] {
  const firstOfMonth = new Date(Date.UTC(month.year, month.month, 1));
  const offset = (firstOfMonth.getUTCDay() - firstDayOfWeek + 7) % 7;
  const start = new Date(Date.UTC(month.year, month.month, 1 - offset));

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    return {
      value: toSolarisDate(date),
      day: date.getUTCDate(),
      inCurrentMonth: date.getUTCMonth() === month.month,
    };
  });
}

export function formatSolarisDate(
  value: SolarisDateValue | null | undefined,
  locale: string,
  dateFormat: SolarisDateFormat = '2-digit',
): string {
  const date = parseSolarisDate(value);
  if (!date) return '';

  return new Intl.DateTimeFormat(locale, {
    day: dateFormat,
    month: dateFormat,
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export type SolarisDatePart = 'day' | 'month' | 'year';

export interface SolarisLocalizedDateInfo {
  order: SolarisDatePart[];
  separator: string;
}

const DATE_PART_SIZES: Record<SolarisDatePart, number> = {
  day: 2,
  month: 2,
  year: 4,
};

export function getLocalizedSolarisDateInfo(
  locale: string,
): SolarisLocalizedDateInfo {
  const fallback: SolarisLocalizedDateInfo = {
    order: ['day', 'month', 'year'],
    separator: '/',
  };
  try {
    const parts = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    }).formatToParts(new Date(Date.UTC(2006, 10, 22)));
    const order = parts
      .filter(
        (part) =>
          part.type === 'day' || part.type === 'month' || part.type === 'year',
      )
      .map((part) => part.type as SolarisDatePart);
    if (order.length !== 3) return fallback;
    let seen = 0;
    let separator = '';
    for (const part of parts) {
      if (
        part.type === 'day' ||
        part.type === 'month' ||
        part.type === 'year'
      ) {
        seen += 1;
        continue;
      }
      if (part.type === 'literal' && seen > 0 && seen < 3 && !separator) {
        separator = part.value;
      }
    }
    return { order, separator: separator || '/' };
  } catch {
    return fallback;
  }
}

/**
 * Applies the locale date mask (`dd/MM/yyyy` in `pt-BR`) while the user types.
 * Only digits are kept (max 8) and the locale separator is inserted
 * progressively, so `16102026` becomes `16/10/2026`.
 */
export function maskLocalizedSolarisDateInput(
  value: string,
  locale: string,
): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (!digits) return '';

  const { order, separator } = getLocalizedSolarisDateInfo(locale);
  const chunks: string[] = [];
  let cursor = 0;
  for (const part of order) {
    const chunk = digits.slice(cursor, cursor + DATE_PART_SIZES[part]);
    cursor += DATE_PART_SIZES[part];
    if (!chunk) break;
    chunks.push(chunk);
    if (cursor >= digits.length) break;
  }
  return chunks.join(separator);
}

export function localeFirstDay(locale: string): SolarisWeekStartsOn {
  try {
    const weekInfo = (
      new Intl.Locale(locale) as Intl.Locale & {
        weekInfo?: { firstDay?: unknown };
      }
    ).weekInfo;
    const firstDay = weekInfo?.firstDay;
    if (typeof firstDay === 'number' && firstDay >= 1 && firstDay <= 7) {
      return (firstDay % 7) as SolarisWeekStartsOn;
    }
  } catch {
    // Intl.Locale with weekInfo is not available everywhere; fall through.
  }
  return 0;
}

export function parseLocalizedSolarisDate(
  value: string,
  locale: string,
): SolarisDateValue | null {
  const normalized = value.trim();
  if (!normalized) return null;

  const { order } = getLocalizedSolarisDateInfo(locale);
  let values: string[] | null = normalized.match(/\d+/g);
  if (!values) return null;

  if (values.length === 1 && values[0].length === 8) {
    const digits = values[0];
    const sliced: string[] = [];
    let cursor = 0;
    for (const part of order) {
      const size = DATE_PART_SIZES[part];
      sliced.push(digits.slice(cursor, cursor + size));
      cursor += size;
    }
    const byPart = Object.fromEntries(
      order.map((part, index) => [part, sliced[index]]),
    );
    values = order.map((part) => byPart[part]);
  }

  if (values?.length !== 3 || order.length !== 3) return null;

  const rawByPart = Object.fromEntries(
    order.map((part, index) => [part, values[index]]),
  ) as Record<SolarisDatePart, string>;
  if (
    rawByPart['year'].length !== 4 ||
    rawByPart['day'].length < 1 ||
    rawByPart['day'].length > 2 ||
    rawByPart['month'].length < 1 ||
    rawByPart['month'].length > 2
  ) {
    return null;
  }

  const parsed = Object.fromEntries(
    order.map((part, index) => [part, Number(values[index])]),
  ) as {
    day: number;
    month: number;
    year: number;
  };
  const date = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day));

  if (
    date.getUTCFullYear() !== parsed.year ||
    date.getUTCMonth() !== parsed.month - 1 ||
    date.getUTCDate() !== parsed.day
  ) {
    return null;
  }

  return toSolarisDate(date);
}
