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
} from '@solaris-ui/angular';

import { appRoutes } from './app.routes';
import { CONFIGURATION_TRANSLATIONS } from './pages/configuration/translations';

const translations: Record<string, Record<string, string>> = {
  'en-US': {
    greeting: 'Hello, {{name}}',
    farewell: 'Goodbye',
    ...CONFIGURATION_TRANSLATIONS['en-US'],
  },
  'pt-BR': {
    greeting: 'Olá, {{name}}',
    farewell: 'Adeus',
    ...CONFIGURATION_TRANSLATIONS['pt-BR'],
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideSolarisTranslate({
      locale: 'en-US',
      fallbackLocale: 'pt-BR',
      useBrowserLocale: true,
      translations,
    }),
    provideSolarisAccessibility(),
    provideSolarisTheme({
      colorScheme: 'system',
      density: 'comfortable',
    }),
    provideSolarisIcons(),
  ],
};
