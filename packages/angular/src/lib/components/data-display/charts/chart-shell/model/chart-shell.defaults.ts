import type {
  SolarisChartDisplayMode,
  SolarisChartPeriod,
  SolarisChartView,
} from '../../model/chart.types';
import type {
  SolarisChartShellActionOption,
  SolarisChartShellDisplayModeOption,
  SolarisChartShellPeriodOption,
  SolarisChartShellViewOption,
} from './chart-shell.types';

export const DEFAULT_SHELL_DISPLAY_MODES: readonly SolarisChartShellDisplayModeOption[] =
  [{ value: 'timeline' }, { value: 'list' }];

export const DEFAULT_SHELL_VIEWS: readonly SolarisChartShellViewOption[] = [
  { value: 'line' },
  { value: 'bar' },
  { value: 'pie' },
];

export const DEFAULT_SHELL_PERIODS: readonly SolarisChartShellPeriodOption[] = [
  { value: 'day', fixedDuration: { days: 0 } },
  { value: 'week', fixedDuration: { days: 6 } },
  { value: 'month', fixedDuration: { months: 1 } },
  { value: 'quarter', fixedDuration: { months: 3 } },
  { value: 'year' },
  { value: 'all' },
];

export const DEFAULT_SHELL_ACTIONS: readonly SolarisChartShellActionOption[] = [
  { value: 'export' },
  { value: 'fullscreen' },
];

export const SHELL_VIEW_LABEL_KEYS: Record<SolarisChartView, string> = {
  line: 'solaris.chart.viewLine',
  bar: 'solaris.chart.viewBar',
  pie: 'solaris.chart.viewPie',
  heatmap: 'solaris.chart.viewHeatmap',
  radar: 'solaris.chart.viewRadar',
};

export const SHELL_PERIOD_LABEL_KEYS: Record<SolarisChartPeriod, string> = {
  day: 'solaris.chart.periodDay',
  week: 'solaris.chart.periodWeek',
  month: 'solaris.chart.periodMonth',
  quarter: 'solaris.chart.periodQuarter',
  year: 'solaris.chart.periodYear',
  all: 'solaris.chart.periodAll',
  custom: 'solaris.chart.periodCustom',
};

export const SHELL_DISPLAY_LABEL_KEYS: Record<SolarisChartDisplayMode, string> =
  {
    timeline: 'solaris.chart.displayTimeline',
    list: 'solaris.chart.displayList',
  };

export const SHELL_ACTION_LABEL_KEYS: Record<string, string> = {
  export: 'solaris.chart.actionsExport',
  fullscreen: 'solaris.chart.actionsFullscreen',
};
