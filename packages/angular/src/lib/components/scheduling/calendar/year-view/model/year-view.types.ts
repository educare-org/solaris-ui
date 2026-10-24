import type { SolarisCalendarEventColor } from '../../model/calendar.types';

export type SolarisYearViewDensity = 'compact' | 'normal' | 'comfortable';

export type SolarisYearViewSize = 'sm' | 'md' | 'lg';

export interface SolarisYearViewDay {
  value: string;
  total: number;
  holiday: boolean;
  outside: boolean;
  color: SolarisCalendarEventColor | null;
}

export interface SolarisYearViewMonth {
  year: number;
  month: number;
  label: string;
  title: string;
  weeks: SolarisYearViewDay[][];
}
