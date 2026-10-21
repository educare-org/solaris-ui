import type {
  SolarisChartPeriod,
  SolarisChartView,
} from '../../model/chart.types';

export function isChartView(value: unknown): value is SolarisChartView {
  return value === 'line' || value === 'bar' || value === 'pie';
}

export function isChartPeriod(value: unknown): value is SolarisChartPeriod {
  return (
    value === '1D' ||
    value === '7D' ||
    value === '1M' ||
    value === '3M' ||
    value === 'YTD' ||
    value === 'all'
  );
}
