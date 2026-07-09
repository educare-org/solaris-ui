export { SolarisIconRegistryService } from './service/solaris-icon-registry.service';
export { SOLARIS_BUILT_IN_ICONS } from './icons/solaris-built-in-icons';
export { provideSolarisIcons } from './provider/provide-solaris-icons';
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
export type { SolarisIconsConfig } from './token/solaris-icon.tokens';
