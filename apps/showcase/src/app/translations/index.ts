import { CONFIGURATION_TRANSLATIONS } from '../pages/configuration/translations';
import { BADGE_TRANSLATIONS } from '../pages/data-display/badge/translations';
import { SKELETON_TRANSLATIONS } from '../pages/feedback/skeleton/translations';
import { CARD_TRANSLATIONS } from '../pages/data-display/card/translations';
import { ALERT_TRANSLATIONS } from '../pages/feedback/alert/translations';
import { BUTTON_TRANSLATIONS } from '../pages/actions/button/translations';
import { ICON_BUTTON_TRANSLATIONS } from '../pages/actions/icon-button/translations';
import { BUTTON_GROUP_TRANSLATIONS } from '../pages/actions/button-group/translations';
import { FORM_FIELD_TRANSLATIONS } from '../pages/forms/form-field/translations';
import { INPUT_TRANSLATIONS } from '../pages/forms/input/translations';
import { PASSWORD_FIELD_TRANSLATIONS } from '../pages/forms/password-field/translations';
import { EMAIL_FIELD_TRANSLATIONS } from '../pages/forms/email-field/translations';
import { TEXTAREA_TRANSLATIONS } from '../pages/forms/textarea/translations';
import { CHECKBOX_TRANSLATIONS } from '../pages/forms/checkbox/translations';
import { CHECKBOX_GROUP_TRANSLATIONS } from '../pages/forms/checkbox-group/translations';
import { RADIO_TRANSLATIONS } from '../pages/forms/radio/translations';
import { RADIO_GROUP_TRANSLATIONS } from '../pages/forms/radio-group/translations';
import { SWITCH_TRANSLATIONS } from '../pages/forms/switch/translations';
import { SWITCH_GROUP_TRANSLATIONS } from '../pages/forms/switch-group/translations';
import { OPTION_TRANSLATIONS } from '../pages/forms/option/translations';
import { SELECT_TRANSLATIONS } from '../pages/forms/select/translations';
import { MULTI_SELECT_TRANSLATIONS } from '../pages/forms/multi-select/translations';
import { POPOVER_TRANSLATIONS } from '../pages/interaction/popover/translations';
import { TOOLTIP_TRANSLATIONS } from '../pages/interaction/tooltip/translations';
import { TOAST_TRANSLATIONS } from '../pages/feedback/toast/translations';
import { DIALOG_TRANSLATIONS } from '../pages/overlay/dialog/translations';
import { STEPPER_TRANSLATIONS } from '../pages/navigation/stepper/translations';

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
  TEXTAREA_TRANSLATIONS,
  PASSWORD_FIELD_TRANSLATIONS,
  EMAIL_FIELD_TRANSLATIONS,
  CHECKBOX_TRANSLATIONS,
  CHECKBOX_GROUP_TRANSLATIONS,
  RADIO_TRANSLATIONS,
  RADIO_GROUP_TRANSLATIONS,
  SWITCH_TRANSLATIONS,
  SWITCH_GROUP_TRANSLATIONS,
  OPTION_TRANSLATIONS,
  SELECT_TRANSLATIONS,
  MULTI_SELECT_TRANSLATIONS,
  POPOVER_TRANSLATIONS,
  TOOLTIP_TRANSLATIONS,
  TOAST_TRANSLATIONS,
  DIALOG_TRANSLATIONS,
  STEPPER_TRANSLATIONS,
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
