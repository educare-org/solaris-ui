export type SolarisIconVariant = 'outline' | 'solid' | 'duotone';

export type SolarisIconClass = 'fillable' | 'redrawable' | 'stroke-only';

export interface SolarisIconMetadata {
  categories: string[];
  keywords: string[];
  aliases: string[];
  class: SolarisIconClass;
  availableVariants: SolarisIconVariant[];
}

export interface SolarisIconVariantContent {
  svg: string;
}
