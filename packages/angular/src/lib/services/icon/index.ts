export { SolarisIconRegistryService } from './service/solaris-icon-registry.service';
export {
  sanitizeIconSvgInner,
  isSafeIconSvgInner,
} from './service/solaris-icon-sanitizer';
export { iconElementsToInner } from './service/solaris-icon-serializer';
export { SOLARIS_BUILT_IN_ICONS } from './icons/solaris-built-in-icons';
export { SOLARIS_ICONS_METADATA } from './icons/generated/solaris-icons-metadata';
export { SOLARIS_OUTLINE_SVG } from './icons/generated/solaris-icons-outline-svg';

export { SOLARIS_ICONS_CONFIG } from './token/solaris-icon.tokens';

export type { SolarisIconDefinition } from './model/solaris-icon-definition.interface';
export type {
  SvgElement,
  SvgPathElement,
  SvgLineElement,
  SvgPolylineElement,
  SvgPolygonElement,
  SvgCircleElement,
} from './model/solaris-icon-definition.interface';
export type {
  SolarisIconName,
  SolarisBuiltInIcon,
} from './model/solaris-icon.types';
export type {
  SolarisIconVariant,
  SolarisIconClass,
  SolarisIconMetadata,
  SolarisIconVariantContent,
} from './model/solaris-icon-variant.types';
export type { SolarisIconsConfig } from './token/solaris-icon.tokens';
