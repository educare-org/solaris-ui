import type {
  SolarisTranslations,
  SolarisTranslateParams,
} from './solaris-translation.types';
import type { SolarisLocale } from './solaris-locale.types';

export interface SolarisTranslateConfig {
  locale: SolarisLocale;
  fallbackLocale: SolarisLocale;
  translations: SolarisTranslations;
  useBrowserLocale?: boolean;
  persistKey?: string | false;
  availableLocales?: readonly SolarisLocale[];
  resolver?: (
    key: string,
    params?: SolarisTranslateParams,
  ) => string | undefined;
}
