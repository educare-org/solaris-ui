import type { SolarisHoliday } from '../../model/calendar.types';
import type {
  SolarisHolidayProvider,
  SolarisHolidayRange,
} from '../model/holidays.types';

const asyncCache = new Map<string, SolarisHoliday[]>();

function cacheKey(
  url: string,
  range: SolarisHolidayRange,
  locale: string,
): string {
  return `${url}|${range.start}|${range.end}|${locale}`;
}

function isHolidayList(value: unknown): value is SolarisHoliday[] {
  if (!Array.isArray(value)) return false;
  return value.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as SolarisHoliday).date === 'string' &&
      typeof (item as SolarisHoliday).name === 'string',
  );
}

// Why: municipalities have thousands of local holidays that cannot ship in the
// bundle; consumers point this loader at their ERP endpoint and the lib caches
// per range+locale so year navigation does not refetch.
export async function fetchSolarisHolidays(
  url: string,
  range: SolarisHolidayRange,
  locale: string,
  fetcher: (input: string) => Promise<unknown> = (input) =>
    fetch(input).then((response) => response.json()),
): Promise<SolarisHoliday[]> {
  const key = cacheKey(url, range, locale);
  const cached = asyncCache.get(key);
  if (cached !== undefined) return [...cached];
  const separator = url.includes('?') ? '&' : '?';
  const target = `${url}${separator}start=${encodeURIComponent(range.start)}&end=${encodeURIComponent(range.end)}&locale=${encodeURIComponent(locale)}`;
  try {
    const payload = await fetcher(target);
    const list = Array.isArray(payload)
      ? payload
      : (payload as { holidays?: unknown }).holidays;
    if (!isHolidayList(list)) return [];
    asyncCache.set(key, [...list]);
    return [...list];
  } catch {
    return [];
  }
}

export function clearSolarisHolidayCache(): void {
  asyncCache.clear();
}

// Why: state/municipal lists are consumer data; this merges them over the
// built-in nationals without mutating either input array.
export function mergeSolarisHolidays(
  base: readonly SolarisHoliday[],
  extra: readonly SolarisHoliday[],
): SolarisHoliday[] {
  const seen = new Set(
    base.map((holiday) => `${holiday.date}|${holiday.name}`),
  );
  const output = [...base];
  for (const holiday of extra) {
    const key = `${holiday.date}|${holiday.name}`;
    if (!seen.has(key)) {
      seen.add(key);
      output.push(holiday);
    }
  }
  return output.sort((first, second) =>
    first.date < second.date ? -1 : first.date > second.date ? 1 : 0,
  );
}

export function withAsyncHolidays(
  base: SolarisHolidayProvider,
  loader: (
    range: SolarisHolidayRange,
    locale: string,
  ) => Promise<SolarisHoliday[]>,
): SolarisHolidayProvider {
  return {
    holidays: (range, locale) => base.holidays(range, locale),
    holidaysAsync: async (range, locale) =>
      mergeSolarisHolidays(
        base.holidays(range, locale),
        await loader(range, locale),
      ),
    extend: (more) => withAsyncHolidays(base.extend(more), loader),
  };
}
