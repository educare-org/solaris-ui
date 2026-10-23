import type {
  SolarisChartDisplayMode,
  SolarisChartPeriod,
  SolarisChartView,
} from '../../model/chart.types';

export function isChartDisplayMode(
  value: unknown,
): value is SolarisChartDisplayMode {
  return value === 'timeline' || value === 'list';
}

export function isChartView(value: unknown): value is SolarisChartView {
  return value === 'line' || value === 'bar' || value === 'pie';
}

export function isChartPeriod(value: unknown): value is SolarisChartPeriod {
  return (
    value === 'day' ||
    value === 'week' ||
    value === 'month' ||
    value === 'quarter' ||
    value === 'year' ||
    value === 'all'
  );
}
