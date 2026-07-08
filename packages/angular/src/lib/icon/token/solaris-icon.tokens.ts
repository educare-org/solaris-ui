import { InjectionToken } from '@angular/core';

import type { SolarisIconDefinition } from '../model/solaris-icon-definition.interface';

export interface SolarisIconsConfig {
  extraIcons?: SolarisIconDefinition[];
}

export const SOLARIS_ICONS_CONFIG = new InjectionToken<SolarisIconsConfig>(
  'SOLARIS_ICONS_CONFIG',
);
