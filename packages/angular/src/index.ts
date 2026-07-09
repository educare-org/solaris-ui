export { provideSolarisTranslateTesting } from './lib/services/translation/testing/solaris-translate-testing.provider';
export type { SolarisTranslateConfig } from './lib/services/translation/model/solaris-translate-config.interface';
export { provideSolarisTranslate } from './lib/services/translation/provider/provide-solaris-translate';
export { SolarisTranslateService } from './lib/services/translation/service/solaris-translate.service';
export { SolarisTranslatePipe } from './lib/services/translation/pipe/solaris-translate.pipe';
export { SOLARIS_TRANSLATE_CONFIG } from './lib/services/translation/token/solaris-translate.tokens';
export type {
  SolarisBuiltInLocale,
  SolarisLocale,
} from './lib/services/translation/model/solaris-locale.types';
export type {
  SolarisTranslationMap,
  SolarisTranslations,
  SolarisTranslateParams,
} from './lib/services/translation/model/solaris-translation.types';

export { provideSolarisAccessibilityTesting } from './lib/services/accessibility/testing/solaris-accessibility-testing.provider';
export type { SolarisAccessibilityConfig } from './lib/services/accessibility/model/solaris-accessibility-config.interface';
export { SolarisVisuallyHiddenDirective } from './lib/services/accessibility/directives/visually-hidden.directive';
export { provideSolarisAccessibility } from './lib/services/accessibility/provider/provide-solaris-accessibility';
export { SolarisAccessibilityService } from './lib/services/accessibility/service/solaris-accessibility.service';
export type { SolarisReducedMotionState } from './lib/services/accessibility/model/solaris-accessibility.types';
export { SOLARIS_ACCESSIBILITY_CONFIG } from './lib/services/accessibility/token/solaris-accessibility.tokens';

export { provideSolarisThemeTesting } from './lib/services/theme/testing/solaris-theme-testing.provider';
export type { SolarisThemeConfig } from './lib/services/theme/model/solaris-theme-config.interface';
export type {
  SolarisColorScheme,
  SolarisDensity,
  SolarisReducedMotionPreference,
} from './lib/services/theme/model/solaris-theme.types';
export { provideSolarisTheme } from './lib/services/theme/provider/provide-solaris-theme';
export { SolarisThemeService } from './lib/services/theme/service/solaris-theme.service';
export { SOLARIS_THEME_CONFIG } from './lib/services/theme/token/solaris-theme.tokens';

export { SolarisIconComponent } from './lib/components/icon/component/solaris-icon.component';
export { SolarisIconRegistryService } from './lib/services/icon/service/solaris-icon-registry.service';
export { provideSolarisIcons } from './lib/services/icon/provider/provide-solaris-icons';
export { SOLARIS_ICONS_CONFIG } from './lib/services/icon/token/solaris-icon.tokens';
export { SOLARIS_BUILT_IN_ICONS } from './lib/services/icon/icons/solaris-built-in-icons';
export type { SolarisIconDefinition } from './lib/services/icon/model/solaris-icon-definition.interface';
export type {
  SvgElement,
  SvgPathElement,
  SvgLineElement,
  SvgPolylineElement,
  SvgPolygonElement,
  SvgCircleElement,
} from './lib/services/icon/model/solaris-icon-definition.interface';
export type {
  SolarisIconName,
  SolarisBuiltInIcon,
} from './lib/services/icon/model/solaris-icon.types';
export type { SolarisIconsConfig } from './lib/services/icon/token/solaris-icon.tokens';

export { SolarisBadgeComponent } from './lib/components/data-display/badge/component/badge.component';
export { SolarisBadgeIconDirective } from './lib/components/data-display/badge/directives/badge-icon.directive';
export type {
  SolarisBadgeAppearance,
  SolarisBadgeColor,
  SolarisBadgeSize,
  SolarisBadgeRadius,
  SolarisBadgeVariant,
  SolarisBadgeDensity,
} from './lib/components/data-display/badge/model/badge.types';

export { SolarisCardComponent } from './lib/components/data-display/card/component/card.component';
export { SolarisCardHeaderComponent } from './lib/components/data-display/card/component/card-header.component';
export { SolarisCardContentComponent } from './lib/components/data-display/card/component/card-content.component';
export { SolarisCardMediaComponent } from './lib/components/data-display/card/component/card-media.component';
export { SolarisCardFooterComponent } from './lib/components/data-display/card/component/card-footer.component';
export { SolarisCardActionsComponent } from './lib/components/data-display/card/component/card-actions.component';
export { SolarisCardTitleDirective } from './lib/components/data-display/card/directives/card-title.directive';
export { SolarisCardDescriptionDirective } from './lib/components/data-display/card/directives/card-description.directive';
export type {
  SolarisCardAppearance,
  SolarisCardRadius,
  SolarisCardDensity,
  SolarisCardGlassTexture,
} from './lib/components/data-display/card/model/card.types';

export { SolarisSkeletonComponent } from './lib/components/feedback/skeleton/component/skeleton.component';
export type {
  SolarisSkeletonVariant,
  SolarisSkeletonAnimation,
  SolarisSkeletonSize,
  SolarisSkeletonRadius,
  SolarisSkeletonDensity,
} from './lib/components/feedback/skeleton/model/skeleton.types';

export { provideSolarisTesting } from './lib/testing/provide-solaris-testing';
export type { SolarisTestingOptions } from './lib/testing/provide-solaris-testing';
export { configureSolarisTesting } from './lib/testing/solaris-test-utilities';
