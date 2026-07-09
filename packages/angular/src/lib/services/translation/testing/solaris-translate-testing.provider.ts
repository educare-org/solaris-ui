import type { Provider } from '@angular/core';

import type { SolarisTranslateConfig } from '../model/solaris-translate-config.interface';
import { SOLARIS_TRANSLATE_CONFIG } from '../token/solaris-translate.tokens';

export function provideSolarisTranslateTesting(
  config?: Partial<SolarisTranslateConfig>,
): Provider[] {
  const defaults: SolarisTranslateConfig = {
    locale: 'en-US',
    fallbackLocale: 'pt-BR',
    translations: {
      'en-US': {
        greeting: 'Hello, {{name}}',
        farewell: 'Goodbye',
      },
      'pt-BR': {
        greeting: 'Olá, {{name}}',
        farewell: 'Adeus',
      },
    },
    useBrowserLocale: false,
  };

  return [
    {
      provide: SOLARIS_TRANSLATE_CONFIG,
      useValue: {
        ...defaults,
        ...config,
        translations: {
          ...defaults.translations,
          ...config?.translations,
        },
      },
    },
  ];
}
