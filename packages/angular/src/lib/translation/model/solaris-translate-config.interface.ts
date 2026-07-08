import type { SolarisTranslations } from './solaris-translation.types';
import type { SolarisLocale } from './solaris-locale.types';

export interface SolarisTranslateConfig {
  locale: SolarisLocale;
  fallbackLocale: SolarisLocale;
  translations: SolarisTranslations;
  useBrowserLocale?: boolean;
}
