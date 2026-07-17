import type { SolarisIconDefinition } from '../model/solaris-icon-definition.interface';

import { NAVIGATION_ICONS } from './groups/navigation';
import { ACTIONS_ICONS } from './groups/actions';
import { STATUS_ICONS } from './groups/status';
import { THEME_ICONS } from './groups/theme';
import { DATA_ICONS } from './groups/data';

export const SOLARIS_BUILT_IN_ICONS: SolarisIconDefinition[] = [
  ...NAVIGATION_ICONS,
  ...ACTIONS_ICONS,
  ...STATUS_ICONS,
  ...THEME_ICONS,
  ...DATA_ICONS,
];
