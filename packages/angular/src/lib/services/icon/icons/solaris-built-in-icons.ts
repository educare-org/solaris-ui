import type { SolarisIconDefinition } from '../model/solaris-icon-definition.interface';
import { NAVIGATION_ICONS } from './groups/navigation';
import { ACTIONS_ICONS } from './groups/actions';
import { STATUS_ICONS } from './groups/status';
import { LAYOUT_ICONS } from './groups/layout';
import { THEME_ICONS } from './groups/theme';
import { DATA_ICONS } from './groups/data';
import { COMMUNICATION_ICONS } from './groups/communication';
import { MEDIA_ICONS } from './groups/media';
import { BRAND_ICONS } from './groups/brands';

export const SOLARIS_BUILT_IN_ICONS: SolarisIconDefinition[] = [
  ...NAVIGATION_ICONS,
  ...ACTIONS_ICONS,
  ...STATUS_ICONS,
  ...THEME_ICONS,
  ...DATA_ICONS,
  ...LAYOUT_ICONS,
  ...COMMUNICATION_ICONS,
  ...MEDIA_ICONS,
  ...BRAND_ICONS,
];
