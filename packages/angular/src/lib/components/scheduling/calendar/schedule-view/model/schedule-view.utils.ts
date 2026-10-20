import { todaySolarisDate } from '../../../../forms/date/model/date.utils';
import { parseSolarisDateParts } from '../../model/calendar-datetime.utils';
import type { SolarisScheduleViewItem } from './schedule-view.types';

export const SCHEDULE_VIEW_MAX_WINDOW_DAYS = 31;

export const SCHEDULE_VIEW_DEFAULT_WINDOW_DAYS = 7;

export function validScheduleAnchor(value: string): string {
  if (parseSolarisDateParts(value) !== null) return value;
  return todaySolarisDate();
}

export function normalizeScheduleWindow(value: number): number {
  if (!Number.isFinite(value)) return SCHEDULE_VIEW_DEFAULT_WINDOW_DAYS;
  return Math.min(
    SCHEDULE_VIEW_MAX_WINDOW_DAYS,
    Math.max(1, Math.round(value)),
  );
}

export function scheduleItemWeight(item: SolarisScheduleViewItem): number {
  if (item.kind === 'holiday') return 0;
  if (item.kind === 'event' && item.allDay) return 1;
  if (item.kind === 'event') return 2;
  return 3;
}

export function compareScheduleItems(
  first: SolarisScheduleViewItem,
  second: SolarisScheduleViewItem,
): number {
  const weight = scheduleItemWeight(first) - scheduleItemWeight(second);
  if (weight !== 0) return weight;
  if (first.sortKey !== second.sortKey) {
    if (first.sortKey < second.sortKey) return -1;
    return 1;
  }
  if (first.title < second.title) return -1;
  if (first.title > second.title) return 1;
  return 0;
}
