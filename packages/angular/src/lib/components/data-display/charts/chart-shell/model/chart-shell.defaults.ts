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
  { value: '1D' },
  { value: '7D' },
  { value: '1M' },
  { value: '3M' },
  { value: 'YTD' },
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
};

export const SHELL_PERIOD_LABEL_KEYS: Record<SolarisChartPeriod, string> = {
  '1D': 'solaris.chart.period1D',
  '7D': 'solaris.chart.period7D',
  '1M': 'solaris.chart.period1M',
  '3M': 'solaris.chart.period3M',
  YTD: 'solaris.chart.periodYTD',
  all: 'solaris.chart.periodAll',
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
