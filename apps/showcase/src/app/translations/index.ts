import { CONFIGURATION_TRANSLATIONS } from '../pages/configuration/translations';
import { BADGE_TRANSLATIONS } from '../pages/badge/translations';
import { SKELETON_TRANSLATIONS } from '../pages/skeleton/translations';
import { CARD_TRANSLATIONS } from '../pages/card/translations';
import { ALERT_TRANSLATIONS } from '../pages/alert/translations';
import { BUTTON_TRANSLATIONS } from '../pages/button/translations';
import { ICON_BUTTON_TRANSLATIONS } from '../pages/icon-button/translations';
import { BUTTON_GROUP_TRANSLATIONS } from '../pages/button-group/translations';
import { FORM_FIELD_TRANSLATIONS } from '../pages/form-field/translations';
import { INPUT_TRANSLATIONS } from '../pages/input/translations';
import { PASSWORD_FIELD_TRANSLATIONS } from '../pages/password-field/translations';

const PAGE_MODULES = [
  CONFIGURATION_TRANSLATIONS,
  BADGE_TRANSLATIONS,
  SKELETON_TRANSLATIONS,
  CARD_TRANSLATIONS,
  ALERT_TRANSLATIONS,
  BUTTON_TRANSLATIONS,
  ICON_BUTTON_TRANSLATIONS,
  BUTTON_GROUP_TRANSLATIONS,
  FORM_FIELD_TRANSLATIONS,
  INPUT_TRANSLATIONS,
  PASSWORD_FIELD_TRANSLATIONS,
];

export const SHOWCASE_TRANSLATIONS: Record<string, Record<string, string>> = {};

for (const module of PAGE_MODULES) {
  for (const locale of Object.keys(module)) {
    if (!SHOWCASE_TRANSLATIONS[locale]) {
      SHOWCASE_TRANSLATIONS[locale] = {};
    }
    Object.assign(SHOWCASE_TRANSLATIONS[locale], module[locale]);
  }
}
