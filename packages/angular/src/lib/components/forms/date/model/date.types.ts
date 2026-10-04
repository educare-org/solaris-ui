export type SolarisDateValue = string;

export type SolarisDateFormat = '2-digit' | 'numeric';

export type SolarisWeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface SolarisDateRange {
  start: SolarisDateValue | null;
  end: SolarisDateValue | null;
}

export interface SolarisCalendarMonth {
  year: number;
  month: number;
}

export interface SolarisCalendarDay {
  value: SolarisDateValue;
  day: number;
  inCurrentMonth: boolean;
}

export interface SolarisDatePreset {
  id: string;
  label?: string;
  labelKey?: string;
  range: SolarisDateRange;
}
