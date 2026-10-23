import { CONFIGURATION_TRANSLATIONS } from '../pages/configuration/translation';
import { SHELL_TRANSLATIONS } from '../shell/translation';
import { BADGE_TRANSLATIONS } from '../pages/data-display/badge/translation';
import { AVATAR_TRANSLATIONS } from '../pages/data-display/avatar/translation';
import { SKELETON_TRANSLATIONS } from '../pages/feedback/skeleton/translation';
import { SPINNER_TRANSLATIONS } from '../pages/feedback/spinner/translation';
import { PROGRESS_TRANSLATIONS } from '../pages/feedback/progress/translation';
import { LOADING_TEXT_TRANSLATIONS } from '../pages/feedback/loading-text/translation';
import { CARD_TRANSLATIONS } from '../pages/data-display/card/translation';
import { CHART_SHELL_TRANSLATIONS } from '../pages/data-display/charts/shell/translation';
import { LINE_CHART_TRANSLATIONS } from '../pages/data-display/charts/line-chart/translation';
import { BAR_CHART_TRANSLATIONS } from '../pages/data-display/charts/bar-chart/translation';
import { PIE_CHART_TRANSLATIONS } from '../pages/data-display/charts/pie-chart/translation';
import { HEATMAP_TRANSLATIONS } from '../pages/data-display/charts/heatmap/translation';
import { RADAR_TRANSLATIONS } from '../pages/data-display/charts/radar/translation';
import { CODE_BLOCK_TRANSLATIONS } from '../pages/data-display/code-block/translation';
import { PREVIEW_CODE_TRANSLATIONS } from '../pages/data-display/preview-code/translation';
import { TABLE_TRANSLATIONS } from '../pages/data-display/table/translation';
import { GRADEBOOK_TRANSLATIONS } from '../pages/data-display/tables/gradebook/translation';
import { RECORD_GRID_TRANSLATIONS } from '../pages/data-display/tables/record-grid/translation';
import { ALERT_TRANSLATIONS } from '../pages/feedback/alert/translation';
import { BUTTON_TRANSLATIONS } from '../pages/actions/button/translation';
import { ICON_BUTTON_TRANSLATIONS } from '../pages/actions/icon-button/translation';
import { BUTTON_GROUP_TRANSLATIONS } from '../pages/actions/button-group/translation';
import { FORM_FIELD_TRANSLATIONS } from '../pages/forms/form-field/translation';
import { INPUT_TRANSLATIONS } from '../pages/forms/input/translation';
import { PASSWORD_FIELD_TRANSLATIONS } from '../pages/forms/password-field/translation';
import { EMAIL_FIELD_TRANSLATIONS } from '../pages/forms/email-field/translation';
import { PHONE_FIELD_TRANSLATIONS } from '../pages/forms/phone-field/translation';
import { OTP_INPUT_TRANSLATIONS } from '../pages/forms/otp-input/translation';
import { FILE_UPLOAD_TRANSLATIONS } from '../pages/forms/file-upload/translation';
import { TEXTAREA_TRANSLATIONS } from '../pages/forms/textarea/translation';
import { CHECKBOX_TRANSLATIONS } from '../pages/forms/checkbox/translation';
import { CHECKBOX_GROUP_TRANSLATIONS } from '../pages/forms/checkbox-group/translation';
import { RADIO_TRANSLATIONS } from '../pages/forms/radio/translation';
import { RADIO_GROUP_TRANSLATIONS } from '../pages/forms/radio-group/translation';
import { SELECTION_CARD_TRANSLATIONS } from '../pages/forms/selection-card/translation';
import { DATE_PICKER_TRANSLATIONS } from '../pages/forms/date-picker/translation';
import { MONTH_VIEW_TRANSLATIONS } from '../pages/scheduling/month-view/translation';
import { WEEK_VIEW_TRANSLATIONS } from '../pages/scheduling/week-view/translation';
import { YEAR_VIEW_TRANSLATIONS } from '../pages/scheduling/year-view/translation';
import { SCHEDULE_VIEW_TRANSLATIONS } from '../pages/scheduling/schedule-view/translation';
import { SHELL_VIEW_TRANSLATIONS } from '../pages/scheduling/shell/translation';
import { HOLIDAYS_VIEW_TRANSLATIONS } from '../pages/scheduling/holidays/translation';
import { PRINT_VIEW_TRANSLATIONS } from '../pages/scheduling/print/translation';
import { EVENT_EDITOR_TRANSLATIONS } from '../pages/scheduling/event-editor/translation';
import { SWITCH_TRANSLATIONS } from '../pages/forms/switch/translation';
import { SWITCH_GROUP_TRANSLATIONS } from '../pages/forms/switch-group/translation';
import { OPTION_TRANSLATIONS } from '../pages/forms/option/translation';
import { SELECT_TRANSLATIONS } from '../pages/forms/select/translation';
import { MULTI_SELECT_TRANSLATIONS } from '../pages/forms/multi-select/translation';
import { POPOVER_TRANSLATIONS } from '../pages/interaction/popover/translation';
import { TOOLTIP_TRANSLATIONS } from '../pages/interaction/tooltip/translation';
import { TOAST_TRANSLATIONS } from '../pages/feedback/toast/translation';
import { DIALOG_TRANSLATIONS } from '../pages/overlay/dialog/translation';
import { STEPPER_TRANSLATIONS } from '../pages/navigation/stepper/translation';
import { TABS_TRANSLATIONS } from '../pages/navigation/tabs/translation';
import { BREADCRUMB_TRANSLATIONS } from '../pages/navigation/breadcrumb/translation';
import { SEGMENTED_CONTROL_TRANSLATIONS } from '../pages/navigation/segmented-control/translation';
import { DIVIDER_TRANSLATIONS } from '../pages/content/divider/translation';
import { DROPDOWN_MENU_TRANSLATIONS } from '../pages/interaction/dropdown-menu/translation';
import { COLLAPSIBLE_TRANSLATIONS } from '../pages/interaction/collapsible/translation';
import { ACCORDION_TRANSLATIONS } from '../pages/interaction/accordion/translation';
import { EDITABLE_TABS_TRANSLATIONS } from '../pages/navigation/editable-tabs/translation';
import { PAGINATION_TRANSLATIONS } from '../pages/navigation/pagination/translation';
import { ICONS_TRANSLATIONS } from '../pages/icons/translation';
import { MEGA_MENU_TRANSLATIONS } from '../pages/navigation/mega-menu/translation';
import { TRANSLATE_TRANSLATIONS } from '../pages/services/translate/translation';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function deepMergeTranslations(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  for (const [key, value] of Object.entries(source)) {
    const current = target[key];
    if (isRecord(value) && current !== undefined && isRecord(current)) {
      target[key] = deepMergeTranslations({ ...current }, value);
    } else {
      target[key] = value;
    }
  }
  return target;
}

function flattenTranslations(
  tree: unknown,
  prefix = '',
  out: Record<string, string> = {},
): Record<string, string> {
  if (typeof tree === 'string') {
    out[prefix] = tree;
    return out;
  }
  if (isRecord(tree)) {
    for (const [key, value] of Object.entries(tree)) {
      flattenTranslations(value, prefix ? `${prefix}.${key}` : key, out);
    }
  }
  return out;
}

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
  CHART_SHELL_TRANSLATIONS,
  LINE_CHART_TRANSLATIONS,
  BAR_CHART_TRANSLATIONS,
  PIE_CHART_TRANSLATIONS,
  HEATMAP_TRANSLATIONS,
  RADAR_TRANSLATIONS,
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
  SHELL_VIEW_TRANSLATIONS,
  HOLIDAYS_VIEW_TRANSLATIONS,
  PRINT_VIEW_TRANSLATIONS,
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
  TRANSLATE_TRANSLATIONS,
];

export const SHOWCASE_TRANSLATIONS: Record<string, Record<string, string>> = {};

for (const locale of ['en-US', 'pt-BR', 'es-419']) {
  let merged: Record<string, unknown> = {};
  for (const module of PAGE_MODULES) {
    const tree = (module as Record<string, unknown>)[locale];
    if (isRecord(tree)) {
      merged = deepMergeTranslations(merged, tree);
    }
  }
  SHOWCASE_TRANSLATIONS[locale] = flattenTranslations(merged);
}
