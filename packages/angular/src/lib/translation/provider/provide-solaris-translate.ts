import type { Provider } from '@angular/core';

import type { SolarisTranslateConfig } from '../model/solaris-translate-config.interface';
import { SOLARIS_TRANSLATE_CONFIG } from '../token/solaris-translate.tokens';

export function provideSolarisTranslate(
  config: SolarisTranslateConfig,
): Provider[] {
  return [
    {
      provide: SOLARIS_TRANSLATE_CONFIG,
      useValue: config,
    },
  ];
}
