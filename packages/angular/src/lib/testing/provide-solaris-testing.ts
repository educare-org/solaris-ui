import type { Provider } from '@angular/core';

import { provideSolarisAccessibilityTesting } from '../services/accessibility/testing/solaris-accessibility-testing.provider';
import { provideSolarisThemeTesting } from '../services/theme/testing/solaris-theme-testing.provider';
import { provideSolarisTranslateTesting } from '../services/translation/testing/solaris-translate-testing.provider';
import type { SolarisAccessibilityConfig } from '../services/accessibility/model/solaris-accessibility-config.interface';
import type { SolarisThemeConfig } from '../services/theme/model/solaris-theme-config.interface';
import type { SolarisTranslateConfig } from '../services/translation/model/solaris-translate-config.interface';

export interface SolarisTestingOptions {
  accessibility?: SolarisAccessibilityConfig;
  theme?: Partial<SolarisThemeConfig>;
  translate?: Partial<SolarisTranslateConfig>;
}

export function provideSolarisTesting(
  options?: SolarisTestingOptions,
): Provider[] {
  return [
    ...provideSolarisAccessibilityTesting(options?.accessibility),
    ...provideSolarisThemeTesting(options?.theme),
    ...provideSolarisTranslateTesting(options?.translate),
  ];
}
