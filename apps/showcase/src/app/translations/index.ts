import { CONFIGURATION_TRANSLATIONS } from '../pages/configuration/translations';
import { SHELL_TRANSLATIONS } from '../shell/translations';
import { BADGE_TRANSLATIONS } from '../pages/data-display/badge/translations';
import { AVATAR_TRANSLATIONS } from '../pages/data-display/avatar/translations';
import { SKELETON_TRANSLATIONS } from '../pages/feedback/skeleton/translations';
import { SPINNER_TRANSLATIONS } from '../pages/feedback/spinner/translations';
import { PROGRESS_TRANSLATIONS } from '../pages/feedback/progress/translations';
import { LOADING_TEXT_TRANSLATIONS } from '../pages/feedback/loading-text/translations';
import { CARD_TRANSLATIONS } from '../pages/data-display/card/translations';
import { CODE_BLOCK_TRANSLATIONS } from '../pages/data-display/code-block/translations';
import { PREVIEW_CODE_TRANSLATIONS } from '../pages/data-display/preview-code/translations';
import { TABLE_TRANSLATIONS } from '../pages/data-display/table/translations';
import { GRADEBOOK_TRANSLATIONS } from '../pages/data-display/tables/gradebook/translations';
import { RECORD_GRID_TRANSLATIONS } from '../pages/data-display/tables/record-grid/translations';
import { ALERT_TRANSLATIONS } from '../pages/feedback/alert/translations';
import { BUTTON_TRANSLATIONS } from '../pages/actions/button/translations';
import { ICON_BUTTON_TRANSLATIONS } from '../pages/actions/icon-button/translations';
import { BUTTON_GROUP_TRANSLATIONS } from '../pages/actions/button-group/translations';
import { FORM_FIELD_TRANSLATIONS } from '../pages/forms/form-field/translations';
import { INPUT_TRANSLATIONS } from '../pages/forms/input/translations';
import { PASSWORD_FIELD_TRANSLATIONS } from '../pages/forms/password-field/translations';
import { EMAIL_FIELD_TRANSLATIONS } from '../pages/forms/email-field/translations';
import { PHONE_FIELD_TRANSLATIONS } from '../pages/forms/phone-field/translations';
import { OTP_INPUT_TRANSLATIONS } from '../pages/forms/otp-input/translations';
import { FILE_UPLOAD_TRANSLATIONS } from '../pages/forms/file-upload/translations';
import { TEXTAREA_TRANSLATIONS } from '../pages/forms/textarea/translations';
import { CHECKBOX_TRANSLATIONS } from '../pages/forms/checkbox/translations';
import { CHECKBOX_GROUP_TRANSLATIONS } from '../pages/forms/checkbox-group/translations';
import { RADIO_TRANSLATIONS } from '../pages/forms/radio/translations';
import { RADIO_GROUP_TRANSLATIONS } from '../pages/forms/radio-group/translations';
import { SELECTION_CARD_TRANSLATIONS } from '../pages/forms/selection-card/translations';
import { DATE_PICKER_TRANSLATIONS } from '../pages/forms/date-picker/translations';
import { MONTH_VIEW_TRANSLATIONS } from '../pages/scheduling/month-view/translations';
import { WEEK_VIEW_TRANSLATIONS } from '../pages/scheduling/week-view/translations';
import { YEAR_VIEW_TRANSLATIONS } from '../pages/scheduling/year-view/translations';
import { SCHEDULE_VIEW_TRANSLATIONS } from '../pages/scheduling/schedule-view/translations';
import { EVENT_EDITOR_TRANSLATIONS } from '../pages/scheduling/event-editor/translations';
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
import { TABS_TRANSLATIONS } from '../pages/navigation/tabs/translations';
import { BREADCRUMB_TRANSLATIONS } from '../pages/navigation/breadcrumb/translations';
import { SEGMENTED_CONTROL_TRANSLATIONS } from '../pages/navigation/segmented-control/translations';
import { DIVIDER_TRANSLATIONS } from '../pages/content/divider/translations';
import { DROPDOWN_MENU_TRANSLATIONS } from '../pages/interaction/dropdown-menu/translations';
import { COLLAPSIBLE_TRANSLATIONS } from '../pages/interaction/collapsible/translations';
import { ACCORDION_TRANSLATIONS } from '../pages/interaction/accordion/translations';
import { EDITABLE_TABS_TRANSLATIONS } from '../pages/navigation/editable-tabs/translations';
import { PAGINATION_TRANSLATIONS } from '../pages/navigation/pagination/translations';
import { ICONS_TRANSLATIONS } from '../pages/icons/translations';
import { MEGA_MENU_TRANSLATIONS } from '../pages/navigation/mega-menu/translations';

const PAGE_MODULES = [
  SHELL_TRANSLATIONS,
  CONFIGURATION_TRANSLATIONS,
  AVATAR_TRANSLATIONS,
  BADGE_TRANSLATIONS,
  SKELETON_TRANSLATIONS,
  SPINNER_TRANSLATIONS,
  PROGRESS_TRANSLATIONS,
  LOADING_TEXT_TRANSLATIONS,
  CARD_TRANSLATIONS,
  CODE_BLOCK_TRANSLATIONS,
  PREVIEW_CODE_TRANSLATIONS,
  TABLE_TRANSLATIONS,
  GRADEBOOK_TRANSLATIONS,
  RECORD_GRID_TRANSLATIONS,
  ALERT_TRANSLATIONS,
  BUTTON_TRANSLATIONS,
  ICON_BUTTON_TRANSLATIONS,
  BUTTON_GROUP_TRANSLATIONS,
  FORM_FIELD_TRANSLATIONS,
  INPUT_TRANSLATIONS,
  TEXTAREA_TRANSLATIONS,
  PASSWORD_FIELD_TRANSLATIONS,
  EMAIL_FIELD_TRANSLATIONS,
  PHONE_FIELD_TRANSLATIONS,
  OTP_INPUT_TRANSLATIONS,
  FILE_UPLOAD_TRANSLATIONS,
  CHECKBOX_TRANSLATIONS,
  CHECKBOX_GROUP_TRANSLATIONS,
  RADIO_TRANSLATIONS,
  RADIO_GROUP_TRANSLATIONS,
  SELECTION_CARD_TRANSLATIONS,
  DATE_PICKER_TRANSLATIONS,
  MONTH_VIEW_TRANSLATIONS,
  WEEK_VIEW_TRANSLATIONS,
  YEAR_VIEW_TRANSLATIONS,
  SCHEDULE_VIEW_TRANSLATIONS,
  EVENT_EDITOR_TRANSLATIONS,
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
  TABS_TRANSLATIONS,
  BREADCRUMB_TRANSLATIONS,
  SEGMENTED_CONTROL_TRANSLATIONS,
  DIVIDER_TRANSLATIONS,
  DROPDOWN_MENU_TRANSLATIONS,
  COLLAPSIBLE_TRANSLATIONS,
  ACCORDION_TRANSLATIONS,
  EDITABLE_TABS_TRANSLATIONS,
  PAGINATION_TRANSLATIONS,
  ICONS_TRANSLATIONS,
  MEGA_MENU_TRANSLATIONS,
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
