import type { SolarisIconDefinition } from '../model/solaris-icon-definition.interface';
import { COMMUNICATION_ICONS } from './groups/communication';
import { NAVIGATION_ICONS } from './groups/navigation';
import { ACTIONS_ICONS } from './groups/actions';
import { STATUS_ICONS } from './groups/status';
import { LAYOUT_ICONS } from './groups/layout';
import { BRAND_ICONS } from './groups/brands';
import { THEME_ICONS } from './groups/theme';
import { MEDIA_ICONS } from './groups/media';
import { DATA_ICONS } from './groups/data';
import { PEOPLE_ICONS } from './groups/people';
import { DOCUMENTS_ICONS } from './groups/documents';

export const SOLARIS_BUILT_IN_ICONS: SolarisIconDefinition[] = [
  ...COMMUNICATION_ICONS,
  ...NAVIGATION_ICONS,
  ...ACTIONS_ICONS,
  ...LAYOUT_ICONS,
  ...STATUS_ICONS,
  ...THEME_ICONS,
  ...MEDIA_ICONS,
  ...BRAND_ICONS,
  ...DATA_ICONS,
  ...PEOPLE_ICONS,
  ...DOCUMENTS_ICONS,
];
