import type { SolarisTranslateConfig } from '../services/translation/model/solaris-translate-config.interface';
import type { SolarisTranslationMap } from '../services/translation/model/solaris-translation.types';
import { ALERT_TRANSLATION } from '../components/feedback/alert/translation';
import { ANNOUNCEMENT_TRANSLATION } from '../components/feedback/announcement/translation';
import { AVATAR_TRANSLATION } from '../components/data-display/avatar/translation';
import { BREADCRUMB_TRANSLATION } from '../components/navigation/breadcrumb/translation';
import { BUTTON_TRANSLATION } from '../components/actions/button/translation';
import { CALENDAR_TRANSLATION } from '../components/scheduling/calendar/translation';
import { CHART_TRANSLATION } from '../components/data-display/charts/translation';
import { COLLAPSIBLE_INPUT_TRANSLATION } from '../components/interaction/collapsible-input/translation';
import { COLLAPSIBLE_TRANSLATION } from '../components/interaction/collapsible/translation';
import { DATE_PICKER_TRANSLATION } from '../components/forms/date-picker/translation';
import { DATE_RANGE_PICKER_TRANSLATION } from '../components/forms/date-range-picker/translation';
import { DIALOG_TRANSLATION } from '../components/overlay/dialog/translation';
import { EDITABLE_TABS_TRANSLATION } from '../components/navigation/editable-tabs/translation';
import { EMAIL_FIELD_TRANSLATION } from '../components/forms/email-field/translation';
import { EXPORT_TRANSLATION } from '../services/export/translation';
import { FILE_UPLOAD_TRANSLATION } from '../components/forms/file-upload/translation';
import { FORM_FIELD_TRANSLATION } from '../components/forms/form-field/translation';
import { GRADEBOOK_TRANSLATION } from '../components/data-display/gradebook/translation';
import { ICON_BUTTON_TRANSLATION } from '../components/actions/icon-button/translation';
import { LOADING_TEXT_TRANSLATION } from '../components/feedback/loading-text/translation';
import { MULTI_SELECT_TRANSLATION } from '../components/forms/multi-select/translation';
import { OTP_INPUT_TRANSLATION } from '../components/forms/otp-input/translation';
import { PAGINATION_TRANSLATION } from '../components/navigation/pagination/translation';
import { PASSWORD_FIELD_TRANSLATION } from '../components/forms/password-field/translation';
import { PHONE_FIELD_TRANSLATION } from '../components/forms/phone-field/translation';
import { PROGRESS_TRANSLATION } from '../components/feedback/progress/translation';
import { RECORD_GRID_TRANSLATION } from '../components/data-display/record-grid/translation';
import { SELECT_TRANSLATION } from '../components/forms/select/translation';
import { SPINNER_TRANSLATION } from '../components/feedback/spinner/translation';
import { STEPPER_TRANSLATION } from '../components/navigation/stepper/translation';
import { TABLE_FILTER_TRANSLATION } from '../components/data-display/table-filter/translation';
import { TABLE_TRANSLATION } from '../components/data-display/table/translation';
import { TOAST_TRANSLATION } from '../components/feedback/toast/translation';

type TranslationTree = string | { [key: string]: TranslationTree };
type TranslationRecord = { [key: string]: TranslationTree };

function isTranslationRecord(
  value: TranslationTree,
): value is TranslationRecord {
  return typeof value === 'object' && value !== null;
}

function deepMergeTranslations(
  target: TranslationRecord,
  source: TranslationRecord,
): TranslationRecord {
  for (const [key, value] of Object.entries(source)) {
    const current = target[key];
    if (
      isTranslationRecord(value) &&
      current !== undefined &&
      isTranslationRecord(current)
    ) {
      target[key] = deepMergeTranslations({ ...current }, value);
    } else {
      target[key] = value;
    }
  }
  return target;
}

const TRANSLATION_PACKAGES: readonly Record<string, TranslationTree>[] = [
  BUTTON_TRANSLATION,
  ICON_BUTTON_TRANSLATION,
  SPINNER_TRANSLATION,
  PROGRESS_TRANSLATION,
  LOADING_TEXT_TRANSLATION,
  STEPPER_TRANSLATION,
  SELECT_TRANSLATION,
  MULTI_SELECT_TRANSLATION,
  TOAST_TRANSLATION,
  ALERT_TRANSLATION,
  ANNOUNCEMENT_TRANSLATION,
  DIALOG_TRANSLATION,
  EDITABLE_TABS_TRANSLATION,
  BREADCRUMB_TRANSLATION,
  FORM_FIELD_TRANSLATION,
  EMAIL_FIELD_TRANSLATION,
  PASSWORD_FIELD_TRANSLATION,
  PHONE_FIELD_TRANSLATION,
  OTP_INPUT_TRANSLATION,
  FILE_UPLOAD_TRANSLATION,
  DATE_PICKER_TRANSLATION,
  DATE_RANGE_PICKER_TRANSLATION,
  AVATAR_TRANSLATION,
  CALENDAR_TRANSLATION,
  CHART_TRANSLATION,
  TABLE_TRANSLATION,
  RECORD_GRID_TRANSLATION,
  GRADEBOOK_TRANSLATION,
  TABLE_FILTER_TRANSLATION,
  EXPORT_TRANSLATION,
  PAGINATION_TRANSLATION,
  COLLAPSIBLE_TRANSLATION,
  COLLAPSIBLE_INPUT_TRANSLATION,
];

function mergeLocaleTrees(locale: string): TranslationRecord {
  let merged: TranslationRecord = {};
  for (const pkg of TRANSLATION_PACKAGES) {
    const tree = pkg[locale];
    if (tree !== undefined && isTranslationRecord(tree)) {
      merged = deepMergeTranslations(merged, tree);
    }
  }
  return merged;
}

function flattenTranslations(
  tree: TranslationTree,
  prefix = '',
  out: SolarisTranslationMap = {},
): SolarisTranslationMap {
  if (typeof tree === 'string') {
    out[prefix] = tree;
    return out;
  }
  for (const [key, value] of Object.entries(tree)) {
    flattenTranslations(value, prefix ? `${prefix}.${key}` : key, out);
  }
  return out;
}

export const SOLARIS_TRANSLATE_DEFAULT_CONFIG: SolarisTranslateConfig = {
  locale: 'en-US',
  fallbackLocale: 'en-US',
  translations: {
    'en-US': flattenTranslations(mergeLocaleTrees('en-US')),
    'pt-BR': flattenTranslations(mergeLocaleTrees('pt-BR')),
    'es-419': flattenTranslations(mergeLocaleTrees('es-419')),
  },
  useBrowserLocale: true,
  persistKey: 'solaris:locale',
};
