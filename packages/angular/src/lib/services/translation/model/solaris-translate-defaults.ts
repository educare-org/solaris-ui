import type { SolarisTranslateConfig } from './solaris-translate-config.interface';
import type { SolarisTranslationMap } from './solaris-translation.types';
import enUS from '../en-US.json';
import ptBR from '../pt-BR.json';
import es419 from '../es-419.json';

type TranslationTree = string | { [key: string]: TranslationTree };

function flattenTranslations(
  tree: TranslationTree,
  prefix = '',
  out: SolarisTranslationMap = {},
): SolarisTranslationMap {
  if (typeof tree === 'string') {
    out[prefix] = tree;
    return out;
  }
  for (const [key, value] of Object.entries(tree)) {
    flattenTranslations(value, prefix ? `${prefix}.${key}` : key, out);
  }
  return out;
}

export const SOLARIS_TRANSLATE_DEFAULT_CONFIG: SolarisTranslateConfig = {
  locale: 'en-US',
  fallbackLocale: 'en-US',
  translations: {
    'en-US': flattenTranslations(enUS as TranslationTree),
    'pt-BR': flattenTranslations(ptBR as TranslationTree),
    'es-419': flattenTranslations(es419 as TranslationTree),
  },
  useBrowserLocale: true,
  persistKey: 'solaris:locale',
};
