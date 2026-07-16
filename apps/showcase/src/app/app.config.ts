import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import {
  provideSolarisTranslate,
  provideSolarisAccessibility,
  provideSolarisTheme,
  provideSolarisIcons,
  provideSolarisToast,
} from '@solaris-ui/angular';

import { SHOWCASE_TRANSLATIONS } from './translations';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideSolarisTranslate({
      locale: 'en-US',
      fallbackLocale: 'pt-BR',
      useBrowserLocale: true,
      translations: SHOWCASE_TRANSLATIONS,
    }),
    provideSolarisAccessibility(),
    provideSolarisTheme({
      colorScheme: 'system',
      density: 'comfortable',
    }),
    provideSolarisIcons(),
    provideSolarisToast(),
  ],
};
