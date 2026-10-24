import type { SolarisCalendarEventColor } from '../../model/calendar.types';

export type SolarisScheduleViewDensity = 'compact' | 'normal' | 'comfortable';

export type SolarisScheduleViewSize = 'sm' | 'md' | 'lg';

export type SolarisScheduleViewItemKind = 'event' | 'task' | 'holiday';

export interface SolarisScheduleViewEventOpen {
  id: string;
  start: string;
}

export interface SolarisScheduleViewItem {
  kind: SolarisScheduleViewItemKind;
  id: string | null;
  title: string;
  time: string | null;
  sortKey: number;
  allDay: boolean;
  color: SolarisCalendarEventColor;
  completed: boolean;
  occurrenceStart: string;
}

export interface SolarisScheduleViewGroup {
  date: string;
  items: SolarisScheduleViewItem[];
}
