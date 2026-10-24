export const SOLARIS_PREVIEW_CODE_TABS = ['preview', 'code'] as const;

export type SolarisPreviewCodeTab = (typeof SOLARIS_PREVIEW_CODE_TABS)[number];

export type SolarisPreviewCodeAppearance = 'surface' | 'outline';

export type SolarisPreviewCodeSize = 'sm' | 'md' | 'lg';

export type SolarisPreviewCodeDensity = 'compact' | 'normal' | 'comfortable';

export type SolarisPreviewCodeRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export const SOLARIS_PREVIEW_CODE_ALIGNS = [
  'start',
  'center',
  'stretch',
] as const;

export type SolarisPreviewCodeAlign =
  (typeof SOLARIS_PREVIEW_CODE_ALIGNS)[number];

export const SOLARIS_PREVIEW_CODE_MIN_HEIGHTS = [
  'sm',
  'md',
  'lg',
  'xl',
] as const;

export type SolarisPreviewCodeMinHeight =
  (typeof SOLARIS_PREVIEW_CODE_MIN_HEIGHTS)[number];

export const SOLARIS_PREVIEW_CODE_PADDINGS = ['sm', 'md', 'lg'] as const;

export type SolarisPreviewCodePadding =
  (typeof SOLARIS_PREVIEW_CODE_PADDINGS)[number];

export interface SolarisPreviewCodeFile {
  readonly id: string;
  readonly label: string;
  readonly labelKey?: string;
  readonly language?: string;
  readonly code: string;
}

export interface SolarisPreviewCodeResolvedFile extends SolarisPreviewCodeFile {
  readonly resolvedLabel: string;
}
