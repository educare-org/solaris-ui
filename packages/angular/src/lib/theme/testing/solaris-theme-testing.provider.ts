import type { Provider } from '@angular/core';

import type { SolarisThemeConfig } from '../model/solaris-theme-config.interface';
import { SOLARIS_THEME_CONFIG } from '../token/solaris-theme.tokens';

export function provideSolarisThemeTesting(
  config?: Partial<SolarisThemeConfig>,
): Provider[] {
  return [
    {
      provide: SOLARIS_THEME_CONFIG,
      useValue: config ?? {},
    },
  ];
}
