import type {
  SolarisChartDisplayMode,
  SolarisChartPeriod,
  SolarisChartView,
} from '../../model/chart.types';
import type {
  SolarisDateRange,
  SolarisDateValue,
} from '../../../../forms/date/model/date.types';
import type {
  SolarisChartPeriodDuration,
  SolarisChartShellPeriodOption,
} from './chart-shell.types';

export function isChartDisplayMode(
  value: unknown,
): value is SolarisChartDisplayMode {
  return value === 'timeline' || value === 'list';
}

export function isChartView(value: unknown): value is SolarisChartView {
  return (
    value === 'line' ||
    value === 'bar' ||
    value === 'pie' ||
    value === 'heatmap' ||
    value === 'radar'
  );
}

export function isChartPeriod(value: unknown): value is SolarisChartPeriod {
  return (
    value === 'day' ||
    value === 'week' ||
    value === 'month' ||
    value === 'quarter' ||
    value === 'year' ||
    value === 'all' ||
    value === 'custom'
  );
}

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isSolarisIntervalDate(
  value: SolarisDateValue | null | undefined,
): value is SolarisDateValue {
  return typeof value === 'string' && ISO_DATE_PATTERN.test(value);
}

export function addSolarisIntervalDuration(
  start: SolarisDateValue,
  duration: SolarisChartPeriodDuration,
): SolarisDateValue | null {
  const match = ISO_DATE_PATTERN.exec(start);
  if (!match) return null;
  const date = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])),
  );
  if (
    date.getUTCFullYear() !== Number(match[1]) ||
    date.getUTCMonth() !== Number(match[2]) - 1 ||
    date.getUTCDate() !== Number(match[3])
  ) {
    return null;
  }
  date.setUTCFullYear(date.getUTCFullYear() + (duration.years ?? 0));
  date.setUTCMonth(date.getUTCMonth() + (duration.months ?? 0));
  date.setUTCDate(date.getUTCDate() + (duration.days ?? 0));
  const year = String(date.getUTCFullYear()).padStart(4, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function resolveChartIntervalEnd(
  start: SolarisDateValue | null,
  option: SolarisChartShellPeriodOption | undefined,
): SolarisDateValue | null {
  if (!start || !option?.fixedDuration) return null;
  return addSolarisIntervalDuration(start, option.fixedDuration);
}

export function resolvePeriodPresetRange(
  option: SolarisChartShellPeriodOption | undefined,
  anchor: SolarisDateValue,
): SolarisDateRange | null {
  if (!option || !isSolarisIntervalDate(anchor)) return null;
  if (option.fixedDuration) {
    const end = addSolarisIntervalDuration(anchor, option.fixedDuration);
    return end === null ? null : { start: anchor, end };
  }
  if (option.value === 'year') {
    const year = anchor.slice(0, 4);
    if (!/^\d{4}$/.test(year)) return null;
    return { start: `${year}-01-01`, end: `${year}-12-31` };
  }
  return null;
}

export function matchChartPeriodForRange(
  start: SolarisDateValue | null,
  end: SolarisDateValue | null,
  options: readonly SolarisChartShellPeriodOption[],
): SolarisChartPeriod | null {
  if (!isSolarisIntervalDate(start) || !isSolarisIntervalDate(end)) return null;
  for (const option of options) {
    if (option.value === 'custom' || option.disabled) continue;
    const expected = resolvePeriodPresetRange(option, start);
    if (expected !== null && expected.start === start && expected.end === end) {
      return option.value;
    }
  }
  return null;
}
