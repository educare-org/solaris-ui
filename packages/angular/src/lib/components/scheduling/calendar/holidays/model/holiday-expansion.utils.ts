import { addDaysToSolarisDate } from '../../model/calendar-datetime.utils';
import type { SolarisHoliday } from '../../model/calendar.types';
import { computeEasterSunday } from '../../model/easter.utils';
import type {
  BuiltInLocaleHolidays,
  FixedHolidayRule,
  WeekdayHolidayRule,
} from './holidays.types';

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function civilString(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, '0')}-${pad2(month)}-${pad2(day)}`;
}

function weekdayOf(year: number, month: number, day: number): number {
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function nthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number,
  occurrence: number,
): string {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const firstWeekday = first.getUTCDay();
  const day = 1 + ((weekday - firstWeekday + 7) % 7) + (occurrence - 1) * 7;
  return civilString(year, month, day);
}

export function lastWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number,
): string {
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const day = lastDay - ((weekdayOf(year, month, lastDay) - weekday + 7) % 7);
  return civilString(year, month, day);
}

function fixedRuleHoliday(
  rule: FixedHolidayRule,
  year: number,
): SolarisHoliday {
  const date = civilString(year, rule.month, rule.day);
  if (rule.observed !== true) {
    return { date, name: rule.name, nameKey: rule.nameKey };
  }
  const day = weekdayOf(year, rule.month, rule.day);
  if (day === 6) {
    const shifted = addDaysToSolarisDate(date, -1) ?? date;
    return {
      date: shifted,
      name: `${rule.name} (Observed)`,
      nameKey: rule.nameKey,
    };
  }
  if (day === 0) {
    const shifted = addDaysToSolarisDate(date, 1) ?? date;
    return {
      date: shifted,
      name: `${rule.name} (Observed)`,
      nameKey: rule.nameKey,
    };
  }
  return { date, name: rule.name, nameKey: rule.nameKey };
}

function weekdayRuleHoliday(
  rule: WeekdayHolidayRule,
  year: number,
): SolarisHoliday {
  if (rule.occurrence === 'last') {
    const date = lastWeekdayOfMonth(year, rule.month, rule.weekday);
    return { date, name: rule.name, nameKey: rule.nameKey };
  }
  const date = nthWeekdayOfMonth(
    year,
    rule.month,
    rule.weekday,
    rule.occurrence,
  );
  return { date, name: rule.name, nameKey: rule.nameKey };
}

export function expandLocaleYearHolidays(
  data: BuiltInLocaleHolidays,
  year: number,
): SolarisHoliday[] {
  const output: SolarisHoliday[] = [];
  for (const rule of data.fixed) {
    output.push(fixedRuleHoliday(rule, year));
  }
  for (const rule of data.weekday) {
    output.push(weekdayRuleHoliday(rule, year));
  }
  const easter = computeEasterSunday(year);
  for (const rule of data.movable) {
    const date = addDaysToSolarisDate(easter, rule.easterOffset);
    if (date !== null) {
      output.push({ date, name: rule.name, nameKey: rule.nameKey });
    }
  }
  return output;
}
