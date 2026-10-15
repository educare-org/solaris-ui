import type { SolarisDateValue } from '../../../forms/date/model/date.types';

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

export function computeEasterSunday(year: number): SolarisDateValue {
  if (!Number.isInteger(year) || year < 1583 || year > 9999) {
    throw new RangeError(
      `Easter computus requires a Gregorian year 1583-9999, got ${year}.`,
    );
  }
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const total = h + l - 7 * m + 114;
  const month = Math.floor(total / 31);
  const day = (total % 31) + 1;
  return `${String(year).padStart(4, '0')}-${pad2(month)}-${pad2(day)}`;
}
