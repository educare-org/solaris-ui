export type SolarisDateValue = string;

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
