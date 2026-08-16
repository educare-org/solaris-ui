import type { SolarisTranslations } from './solaris-translation.types';
import type { SolarisLocale } from './solaris-locale.types';
import type { SolarisTranslateParams } from './solaris-translation.types';

export interface SolarisTranslateConfig {
  locale: SolarisLocale;
  fallbackLocale: SolarisLocale;
  translations: SolarisTranslations;
  useBrowserLocale?: boolean;
  /** Optional resolver that delegates unknown keys to the host app's i18n system. */
  resolver?: (
    key: string,
    params?: SolarisTranslateParams,
  ) => string | undefined;
}
