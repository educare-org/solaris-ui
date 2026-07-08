import type { Provider } from '@angular/core';

import type { SolarisAccessibilityConfig } from '../model/solaris-accessibility-config.interface';
import { SOLARIS_ACCESSIBILITY_CONFIG } from '../token/solaris-accessibility.tokens';

export function provideSolarisAccessibility(
  config?: SolarisAccessibilityConfig,
): Provider[] {
  return [
    {
      provide: SOLARIS_ACCESSIBILITY_CONFIG,
      useValue: config ?? {},
    },
  ];
}
