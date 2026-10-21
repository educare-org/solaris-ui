import { solarisChartStringsEn } from './en';
import { solarisChartStringsEs } from './es';
import { solarisChartStringsPt } from './pt';

export type SolarisChartStringKey =
  | 'viewLine'
  | 'viewBar'
  | 'viewPie'
  | 'period1D'
  | 'period7D'
  | 'period1M'
  | 'period3M'
  | 'periodYTD'
  | 'periodAll'
  | 'legendToggle'
  | 'others'
  | 'total'
  | 'emptyTitle'
  | 'emptyMessage'
  | 'errorTitle'
  | 'errorRetry'
  | 'seriesSummary'
  | 'viewSwitcher'
  | 'actionsMenu'
  | 'actionsExport'
  | 'actionsFullscreen';

export type SolarisChartStringLanguage = 'en' | 'pt' | 'es';

const dictionaries: Record<
  SolarisChartStringLanguage,
  Record<SolarisChartStringKey, string>
> = {
  en: solarisChartStringsEn,
  pt: solarisChartStringsPt,
  es: solarisChartStringsEs,
};

const SERVICE_PREFIX = 'solaris.chart.';

export function chartFallbackLanguage(
  locale: string,
): SolarisChartStringLanguage {
  const base = locale.split('-')[0].toLowerCase();
  if (base === 'pt' || base === 'es') return base;
  return 'en';
}

function renderChartTemplate(
  template: string,
  params: Record<string, string>,
): string {
  return template.replace(/\{\{\s*(\w+)\s*}}/g, (match, key: string) => {
    const value = params[key];
    return value ?? match;
  });
}

export function resolveChartFallback(
  locale: string,
  key: string,
  params: Record<string, string>,
): string {
  const shortKey = key.startsWith(SERVICE_PREFIX)
    ? key.slice(SERVICE_PREFIX.length)
    : key;
  const language = chartFallbackLanguage(locale);
  const template =
    (dictionaries[language] as Record<string, string>)[shortKey] ??
    (dictionaries.en as Record<string, string>)[shortKey] ??
    key;
  return renderChartTemplate(template, params);
}
