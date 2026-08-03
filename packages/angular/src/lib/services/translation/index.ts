export { provideSolarisTranslateTesting } from './testing/solaris-translate-testing.provider';

export { SolarisTranslateService } from './service/solaris-translate.service';
export { SolarisTranslatePipe } from './pipe/solaris-translate.pipe';
export { SOLARIS_TRANSLATE_CONFIG } from './token/solaris-translate.tokens';

export type {
  SolarisTranslationMap,
  SolarisTranslations,
  SolarisTranslateParams,
} from './model/solaris-translation.types';
export type { SolarisTranslateConfig } from './model/solaris-translate-config.interface';
export type {
  SolarisBuiltInLocale,
  SolarisLocale,
} from './model/solaris-locale.types';
