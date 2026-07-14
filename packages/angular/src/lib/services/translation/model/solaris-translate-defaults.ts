import type { SolarisTranslateConfig } from './solaris-translate-config.interface';

export const SOLARIS_TRANSLATE_DEFAULT_CONFIG: SolarisTranslateConfig = {
  locale: 'en-US',
  fallbackLocale: 'en-US',
  translations: {
    'en-US': {
      'solaris.select.search.placeholder': 'Search...',
      'solaris.select.loading': 'Loading...',
      'solaris.select.empty': 'No options available',
      'solaris.select.noResults': 'No results found',
      'solaris.select.clear': 'Clear selection',
    },
    'pt-BR': {
      'solaris.select.search.placeholder': 'Buscar...',
      'solaris.select.loading': 'Carregando...',
      'solaris.select.empty': 'Nenhuma opção disponível',
      'solaris.select.noResults': 'Nenhum resultado encontrado',
      'solaris.select.clear': 'Limpar seleção',
    },
  },
  useBrowserLocale: true,
};
