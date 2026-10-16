export { SolarisCalendarWeekViewComponent } from './component/week-view.component';
export type {
  SolarisWeekViewAllDayItem,
  SolarisWeekViewAllDayKind,
  SolarisWeekViewBlock,
  SolarisWeekViewDensity,
  SolarisWeekViewEventOpen,
  SolarisWeekViewSize,
  SolarisWeekViewSlotSelect,
  SolarisWeekViewVisibleDays,
} from './model/week-view.types';
export type {
  SolarisWeekDaySegment,
  SolarisWeekOverlapPlacement,
  SolarisWeekOverlapSpan,
} from './model/week-view-layout.utils';
export {
  clipSpanToDay,
  layoutOverlappingSpans,
} from './model/week-view-layout.utils';
