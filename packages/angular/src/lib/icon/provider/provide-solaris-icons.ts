import type { Provider } from '@angular/core';

import type { SolarisIconsConfig } from '../token/solaris-icon.tokens';
import { SOLARIS_ICONS_CONFIG } from '../token/solaris-icon.tokens';

export function provideSolarisIcons(config?: SolarisIconsConfig): Provider[] {
  return [
    {
      provide: SOLARIS_ICONS_CONFIG,
      useValue: config ?? {},
    },
  ];
}
