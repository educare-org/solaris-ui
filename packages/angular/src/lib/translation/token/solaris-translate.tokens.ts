import { InjectionToken } from '@angular/core';

import type { SolarisTranslateConfig } from '../model/solaris-translate-config.interface';

export const SOLARIS_TRANSLATE_CONFIG =
  new InjectionToken<SolarisTranslateConfig>('SOLARIS_TRANSLATE_CONFIG');
