import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import {
  provideSolaris,
  provideSolarisShikiHighlighter,
} from '@solaris-ui/angular';

import { SHOWCASE_TRANSLATIONS } from './translations';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      }),
    ),
    provideSolarisShikiHighlighter(),
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
