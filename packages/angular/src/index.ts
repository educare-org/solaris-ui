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

export { provideSolarisThemeTesting } from './lib/theme/testing/solaris-theme-testing.provider';
export type { SolarisThemeConfig } from './lib/theme/model/solaris-theme-config.interface';
export type {
  SolarisColorScheme,
  SolarisDensity,
  SolarisReducedMotionPreference,
} from './lib/theme/model/solaris-theme.types';
export { provideSolarisTheme } from './lib/theme/provider/provide-solaris-theme';
export { SolarisThemeService } from './lib/theme/service/solaris-theme.service';
export { SOLARIS_THEME_CONFIG } from './lib/theme/token/solaris-theme.tokens';

export { SolarisIconComponent } from './lib/icon/component/solaris-icon.component';
export { SolarisIconRegistryService } from './lib/icon/service/solaris-icon-registry.service';
export { provideSolarisIcons } from './lib/icon/provider/provide-solaris-icons';
export { SOLARIS_ICONS_CONFIG } from './lib/icon/token/solaris-icon.tokens';
export { SOLARIS_BUILT_IN_ICONS } from './lib/icon/icons/solaris-built-in-icons';
export type { SolarisIconDefinition } from './lib/icon/model/solaris-icon-definition.interface';
export type {
  SvgElement,
  SvgPathElement,
  SvgLineElement,
  SvgPolylineElement,
  SvgPolygonElement,
  SvgCircleElement,
} from './lib/icon/model/solaris-icon-definition.interface';
export type {
  SolarisIconName,
  SolarisBuiltInIcon,
} from './lib/icon/model/solaris-icon.types';
export type { SolarisIconsConfig } from './lib/icon/token/solaris-icon.tokens';

export { provideSolarisTesting } from './lib/testing/provide-solaris-testing';
export type { SolarisTestingOptions } from './lib/testing/provide-solaris-testing';
export { configureSolarisTesting } from './lib/testing/solaris-test-utilities';
