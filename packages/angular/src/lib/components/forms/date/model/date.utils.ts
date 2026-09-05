import type {
  SolarisCalendarDay,
  SolarisCalendarMonth,
  SolarisDateValue,
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
): string {
  const date = parseSolarisDate(value);
  if (!date) return '';

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function parseLocalizedSolarisDate(
  value: string,
  locale: string,
): SolarisDateValue | null {
  const normalized = value.trim();
  if (!normalized) return null;

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
    .map((part) => part.type);
  const values = normalized.match(/\d+/g);

  if (!values || values.length !== 3 || order.length !== 3) return null;

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
