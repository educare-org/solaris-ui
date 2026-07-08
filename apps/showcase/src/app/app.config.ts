import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import {
  provideSolarisTranslate,
  provideSolarisAccessibility,
} from '@solaris-ui/angular';

import { appRoutes } from './app.routes';

const translations: Record<string, Record<string, string>> = {
  'en-US': {
    greeting: 'Hello, {{name}}',
    farewell: 'Goodbye',
    'configuration.title': 'Configuration',
    'configuration.section.i18n': 'Translation (i18n)',
    'configuration.label.locale': 'Current locale',
    'configuration.label.fallback-locale': 'Fallback locale',
    'configuration.label.interpolation':
      'Translate: greeting with interpolation',
    'configuration.label.fallback':
      'Translate: missing key (falls back to fallbackLocale)',
    'configuration.label.missing': 'Translate: nonexistent key (returns key)',
    'configuration.section.a11y': 'Accessibility (a11y)',
    'configuration.label.reduced-motion': 'Reduced motion',
    'configuration.label.reduced-motion-value':
      'Reduced motion enabled: {{value}}',
    'configuration.label.visually-hidden': 'Visually hidden directive example',
    'configuration.text.visible': 'This text is visible.',
    'configuration.text.sr-only':
      'This text is only available to screen readers.',
  },
  'pt-BR': {
    greeting: 'Olá, {{name}}',
    farewell: 'Adeus',
    'configuration.title': 'Configuração',
    'configuration.section.i18n': 'Tradução (i18n)',
    'configuration.label.locale': 'Idioma atual',
    'configuration.label.fallback-locale': 'Idioma de fallback',
    'configuration.label.interpolation': 'Tradução: saudação com interpolação',
    'configuration.label.fallback': 'Tradução: chave ausente (usa fallback)',
    'configuration.label.missing':
      'Tradução: chave inexistente (retorna a chave)',
    'configuration.section.a11y': 'Acessibilidade (a11y)',
    'configuration.label.reduced-motion': 'Movimento reduzido',
    'configuration.label.reduced-motion-value':
      'Movimento reduzido ativado: {{value}}',
    'configuration.label.visually-hidden':
      'Exemplo de diretiva visually hidden',
    'configuration.text.visible': 'Este texto está visível.',
    'configuration.text.sr-only':
      'Este texto está disponível apenas para leitores de tela.',
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
  ],
};
