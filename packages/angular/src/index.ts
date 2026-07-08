export { provideSolarisTranslateTesting } from './lib/translation/testing/solaris-translate-testing.provider';
export type { SolarisTranslateConfig } from './lib/translation/model/solaris-translate-config.interface';
export { provideSolarisTranslate } from './lib/translation/provider/provide-solaris-translate';
export { SolarisTranslateService } from './lib/translation/service/solaris-translate.service';
export { SolarisTranslatePipe } from './lib/translation/pipe/solaris-translate.pipe';
export { SOLARIS_TRANSLATE_CONFIG } from './lib/translation/token/solaris-translate.tokens';
export type {
  SolarisBuiltInLocale,
  SolarisLocale,
} from './lib/translation/model/solaris-locale.types';
export type {
  SolarisTranslationMap,
  SolarisTranslations,
  SolarisTranslateParams,
} from './lib/translation/model/solaris-translation.types';

export { provideSolarisAccessibilityTesting } from './lib/accessibility/testing/solaris-accessibility-testing.provider';
export type { SolarisAccessibilityConfig } from './lib/accessibility/model/solaris-accessibility-config.interface';
export { SolarisVisuallyHiddenDirective } from './lib/accessibility/directives/visually-hidden.directive';
export { provideSolarisAccessibility } from './lib/accessibility/provider/provide-solaris-accessibility';
export { SolarisAccessibilityService } from './lib/accessibility/service/solaris-accessibility.service';
export type { SolarisReducedMotionState } from './lib/accessibility/model/solaris-accessibility.types';
export { SOLARIS_ACCESSIBILITY_CONFIG } from './lib/accessibility/token/solaris-accessibility.tokens';
