import { InjectionToken } from '@angular/core';

import type { SolarisThemeConfig } from '../model/solaris-theme-config.interface';

export const SOLARIS_THEME_CONFIG = new InjectionToken<SolarisThemeConfig>(
  'SOLARIS_THEME_CONFIG',
);
