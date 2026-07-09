import { CONFIGURATION_TRANSLATIONS } from '../pages/configuration/translations';
import { BADGE_TRANSLATIONS } from '../pages/badge/translations';

const PAGE_MODULES = [CONFIGURATION_TRANSLATIONS, BADGE_TRANSLATIONS];

export const SHOWCASE_TRANSLATIONS: Record<string, Record<string, string>> = {};

for (const module of PAGE_MODULES) {
  for (const locale of Object.keys(module)) {
    if (!SHOWCASE_TRANSLATIONS[locale]) {
      SHOWCASE_TRANSLATIONS[locale] = {};
    }
    Object.assign(SHOWCASE_TRANSLATIONS[locale], module[locale]);
  }
}
