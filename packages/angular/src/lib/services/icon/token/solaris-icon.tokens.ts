import { InjectionToken } from '@angular/core';

import type { SolarisIconVariant } from '../model/solaris-icon-variant.types';
import type { SolarisIconDefinition } from '../model/solaris-icon-definition.interface';

export interface SolarisIconsConfig {
  extraIcons?: SolarisIconDefinition[];
  defaultVariant?: SolarisIconVariant;
  defaultStrokeWidth?: number;
  defaultSize?: number;
}

export const SOLARIS_ICONS_CONFIG = new InjectionToken<SolarisIconsConfig>(
  'SOLARIS_ICONS_CONFIG',
);
