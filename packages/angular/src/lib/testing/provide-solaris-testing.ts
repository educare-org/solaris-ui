import type { Provider } from '@angular/core';

import { provideSolarisAccessibilityTesting } from '../accessibility/testing/solaris-accessibility-testing.provider';
import { provideSolarisThemeTesting } from '../theme/testing/solaris-theme-testing.provider';
import { provideSolarisTranslateTesting } from '../translation/testing/solaris-translate-testing.provider';
import type { SolarisAccessibilityConfig } from '../accessibility/model/solaris-accessibility-config.interface';
import type { SolarisThemeConfig } from '../theme/model/solaris-theme-config.interface';
import type { SolarisTranslateConfig } from '../translation/model/solaris-translate-config.interface';

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
