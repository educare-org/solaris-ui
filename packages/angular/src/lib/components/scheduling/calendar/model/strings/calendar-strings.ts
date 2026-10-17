import { solarisCalendarStringsEn } from './en';
import { solarisCalendarStringsEs } from './es';
import { solarisCalendarStringsPt } from './pt';

export type SolarisCalendarStringKey =
  | 'more'
  | 'dayItems'
  | 'moreItems'
  | 'task'
  | 'taskCompleted'
  | 'taskOpen'
  | 'allDay'
  | 'nowLine'
  | 'timedEvent'
  | 'timeSlot'
  | 'scheduleEmpty'
  | 'scheduleEmptyHint'
  | 'previousDays'
  | 'nextDays'
  | 'today'
  | 'dragCreateStart'
  | 'dragMoveStart'
  | 'dragResizeStart'
  | 'dragChange'
  | 'dragCreateCommit'
  | 'dragMoveCommit'
  | 'dragResizeCommit'
  | 'dragCancel';

export type SolarisCalendarStringLanguage = 'en' | 'pt' | 'es';

const dictionaries: Record<
  SolarisCalendarStringLanguage,
  Record<SolarisCalendarStringKey, string>
> = {
  en: solarisCalendarStringsEn,
  pt: solarisCalendarStringsPt,
  es: solarisCalendarStringsEs,
};

const SERVICE_PREFIX = 'solaris.calendar.';

export function calendarFallbackLanguage(
  locale: string,
): SolarisCalendarStringLanguage {
  const base = locale.split('-')[0].toLowerCase();
  if (base === 'pt' || base === 'es') return base;
  return 'en';
}

function renderCalendarTemplate(
  template: string,
  params: Record<string, string>,
): string {
  return template.replace(/\{\{\s*(\w+)\s*}}/g, (match, key: string) => {
    const value = params[key];
    return value ?? match;
  });
}

export function resolveCalendarFallback(
  locale: string,
  key: string,
  params: Record<string, string>,
): string {
  const shortKey = key.startsWith(SERVICE_PREFIX)
    ? key.slice(SERVICE_PREFIX.length)
    : key;
  const language = calendarFallbackLanguage(locale);
  const template =
    (dictionaries[language] as Record<string, string>)[shortKey] ??
    (dictionaries.en as Record<string, string>)[shortKey] ??
    key;
  return renderCalendarTemplate(template, params);
}
