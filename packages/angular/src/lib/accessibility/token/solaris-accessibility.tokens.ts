import { InjectionToken } from '@angular/core';

import type { SolarisAccessibilityConfig } from '../model/solaris-accessibility-config.interface';

export const SOLARIS_ACCESSIBILITY_CONFIG =
  new InjectionToken<SolarisAccessibilityConfig>(
    'SOLARIS_ACCESSIBILITY_CONFIG',
  );
