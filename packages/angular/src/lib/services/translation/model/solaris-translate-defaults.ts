import type { SolarisTranslateConfig } from './solaris-translate-config.interface';
import { SOLARIS_TRANSLATE_EN_US } from './i18n/solaris-translate.en-US';
import { SOLARIS_TRANSLATE_PT_BR } from './i18n/solaris-translate.pt-BR';
import { SOLARIS_TRANSLATE_ES } from './i18n/solaris-translate.es';

export { SOLARIS_TRANSLATE_EN_US } from './i18n/solaris-translate.en-US';
export { SOLARIS_TRANSLATE_PT_BR } from './i18n/solaris-translate.pt-BR';
export { SOLARIS_TRANSLATE_ES } from './i18n/solaris-translate.es';

export const SOLARIS_TRANSLATE_DEFAULT_CONFIG: SolarisTranslateConfig = {
  locale: 'en-US',
  fallbackLocale: 'en-US',
  translations: {
    'en-US': SOLARIS_TRANSLATE_EN_US,
    'pt-BR': SOLARIS_TRANSLATE_PT_BR,
    es: SOLARIS_TRANSLATE_ES,
  },
  useBrowserLocale: true,
};
