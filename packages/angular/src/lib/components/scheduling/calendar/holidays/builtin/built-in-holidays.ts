import type { SolarisHoliday } from '../../model/calendar.types';
import {
  parseSolarisDateParts,
  parseSolarisDateTimeMs,
} from '../../model/calendar-datetime.utils';
import { expandLocaleYearHolidays } from '../model/holiday-expansion.utils';
import type {
  BuiltInLocaleHolidays,
  SolarisHolidayProvider,
  SolarisHolidayRange,
} from '../model/holidays.types';

interface LocaleModule {
  localeHolidays: BuiltInLocaleHolidays;
}

const localeLoaders: {
  [locale: string]: (() => Promise<LocaleModule>) | undefined;
} = {
  'pt-BR': () => import('./locales/holidays-pt-BR'),
  'en-US': () => import('./locales/holidays-en-US'),
  es: () => import('./locales/holidays-es'),
};

const registry = new Map<string, BuiltInLocaleHolidays>();
const warnedLocales = new Set<string>();

export async function preloadBuiltInHolidays(locale: string): Promise<void> {
  if (registry.has(locale)) return;
  const loader = localeLoaders[locale];
  if (loader === undefined) return;
  const module = await loader();
  registry.set(locale, module.localeHolidays);
}

export function isBuiltInHolidaysLoaded(locale: string): boolean {
  return registry.has(locale);
}

function warnUnknownLocale(locale: string): void {
  if (warnedLocales.has(locale)) return;
  warnedLocales.add(locale);
  console.warn(
    `[solaris] no built-in holidays for locale "${locale}"; returning an empty list. Preload a supported locale or provide a custom SolarisHolidayProvider.`,
  );
}

function rangeBoundCivil(value: string): string | null {
  if (parseSolarisDateParts(value) !== null) return value;
  const instant = parseSolarisDateTimeMs(value);
  if (instant === null) return null;
  const date = new Date(instant);
  const year = String(date.getUTCFullYear()).padStart(4, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function queryHolidays(
  range: SolarisHolidayRange,
  locale: string,
  extra: SolarisHoliday[],
): SolarisHoliday[] {
  const startCivil = rangeBoundCivil(range.start);
  const endCivil = rangeBoundCivil(range.end);
  if (startCivil === null || endCivil === null || endCivil < startCivil) {
    return [];
  }
  const output: SolarisHoliday[] = [];
  const data = registry.get(locale);
  if (data === undefined) {
    warnUnknownLocale(locale);
  } else {
    for (
      let year = Number(startCivil.slice(0, 4));
      year <= Number(endCivil.slice(0, 4));
      year += 1
    ) {
      for (const holiday of expandLocaleYearHolidays(data, year)) {
        if (holiday.date >= startCivil && holiday.date <= endCivil) {
          output.push(holiday);
        }
      }
    }
  }
  for (const holiday of extra) {
    if (holiday.date >= startCivil && holiday.date <= endCivil) {
      output.push(holiday);
    }
  }
  output.sort((first, second) => {
    if (first.date < second.date) return -1;
    if (first.date > second.date) return 1;
    return 0;
  });
  return output;
}

function createProvider(extra: SolarisHoliday[]): SolarisHolidayProvider {
  return {
    holidays: (range, locale) => queryHolidays(range, locale, extra),
    extend: (more) => createProvider([...extra, ...more]),
  };
}

export function builtInHolidays(): SolarisHolidayProvider {
  return createProvider([]);
}
