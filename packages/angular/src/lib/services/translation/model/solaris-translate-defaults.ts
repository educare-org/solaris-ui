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

      'solaris.multiSelect.selectedCount.singular': '1 selected',
      'solaris.multiSelect.selectedCount.plural': '{{ count }} selected',
      'solaris.multiSelect.search.placeholder': 'Search...',
      'solaris.multiSelect.loading': 'Loading...',
      'solaris.multiSelect.empty': 'No options available',
      'solaris.multiSelect.noResults': 'No results found',
      'solaris.multiSelect.clear': 'Clear selection',
      'solaris.multiSelect.selectAll': 'Select all',
      'solaris.multiSelect.removeChip': 'Remove',
    },
    'pt-BR': {
      'solaris.select.search.placeholder': 'Buscar...',
      'solaris.select.loading': 'Carregando...',
      'solaris.select.empty': 'Nenhuma opção disponível',
      'solaris.select.noResults': 'Nenhum resultado encontrado',
      'solaris.select.clear': 'Limpar seleção',

      'solaris.multiSelect.selectedCount.singular': '1 selecionado',
      'solaris.multiSelect.selectedCount.plural': '{{ count }} selecionados',
      'solaris.multiSelect.search.placeholder': 'Buscar...',
      'solaris.multiSelect.loading': 'Carregando...',
      'solaris.multiSelect.empty': 'Nenhuma opção disponível',
      'solaris.multiSelect.noResults': 'Nenhum resultado encontrado',
      'solaris.multiSelect.clear': 'Limpar seleção',
      'solaris.multiSelect.selectAll': 'Selecionar todos',
      'solaris.multiSelect.removeChip': 'Remover',
    },
  },
  useBrowserLocale: true,
};
