import type { SolarisHoliday } from '../../model/calendar.types';

export interface SolarisHolidayRange {
  start: string;
  end: string;
}

export interface SolarisHolidayProvider {
  holidays(range: SolarisHolidayRange, locale: string): SolarisHoliday[];
  holidaysAsync?(
    range: SolarisHolidayRange,
    locale: string,
  ): Promise<SolarisHoliday[]>;
  extend(extra: SolarisHoliday[]): SolarisHolidayProvider;
}

export interface FixedHolidayRule {
  month: number;
  day: number;
  name: string;
  nameKey: string;
  observed?: boolean;
}

export interface WeekdayHolidayRule {
  month: number;
  weekday: number;
  occurrence: number | 'last';
  name: string;
  nameKey: string;
}

export interface MovableHolidayRule {
  easterOffset: number;
  name: string;
  nameKey: string;
}

export interface BuiltInLocaleHolidays {
  locale: string;
  fixed: FixedHolidayRule[];
  weekday: WeekdayHolidayRule[];
  movable: MovableHolidayRule[];
}
