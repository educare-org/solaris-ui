import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideSolaris } from '@solaris-ui/angular';

import { SHOWCASE_TRANSLATIONS } from './translations';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideSolaris({
      translate: {
        locale: 'en-US',
        fallbackLocale: 'pt-BR',
        useBrowserLocale: true,
        translations: SHOWCASE_TRANSLATIONS,
      },
      theme: {
        colorScheme: 'system',
        density: 'normal',
      },
    }),
  ],
};
