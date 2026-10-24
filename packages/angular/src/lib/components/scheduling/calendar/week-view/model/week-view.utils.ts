import type {
  SolarisWeekViewAllDayItem,
  SolarisWeekViewVisibleDays,
} from './week-view.types';

export const WEEK_VIEW_MS_PER_DAY = 86_400_000;

export const WEEK_VIEW_HOURS_PER_DAY = 24;

export const WEEK_VIEW_NOW_REFRESH_MS = 60_000;

export const WEEK_VIEW_DRAG_ACTIVATION_PX = 4;

export function reducedMotionPreferred(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function normalizeVisibleDays(
  value: unknown,
): SolarisWeekViewVisibleDays {
  if (value === 1 || value === 3 || value === 4 || value === 7) return value;
  return 7;
}

export function weekViewPad2(value: number): string {
  return String(value).padStart(2, '0');
}

export function allDayWeight(item: SolarisWeekViewAllDayItem): number {
  if (item.kind === 'holiday') return 0;
  if (item.kind === 'event') return 1;
  return 2;
}
