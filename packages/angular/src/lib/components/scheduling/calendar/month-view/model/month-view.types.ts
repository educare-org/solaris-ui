import type { SolarisCalendarEventColor } from '../../model/calendar.types';

export type SolarisMonthViewDensity = 'compact' | 'normal' | 'comfortable';

export type SolarisMonthViewSize = 'sm' | 'md' | 'lg';

export type SolarisMonthViewItemKind = 'event' | 'task' | 'holiday';

export interface SolarisMonthViewEventOpen {
  id: string;
  start: string;
}

export interface SolarisMonthViewItem {
  kind: SolarisMonthViewItemKind;
  id: string | null;
  title: string;
  time: string | null;
  sortKey: number;
  allDay: boolean;
  color: SolarisCalendarEventColor;
  completed: boolean;
  occurrenceStart: string;
}
