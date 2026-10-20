import {
  SOLARIS_PREVIEW_CODE_ALIGNS,
  SOLARIS_PREVIEW_CODE_MIN_HEIGHTS,
  SOLARIS_PREVIEW_CODE_PADDINGS,
  SOLARIS_PREVIEW_CODE_TABS,
  type SolarisPreviewCodeAlign,
  type SolarisPreviewCodeAppearance,
  type SolarisPreviewCodeMinHeight,
  type SolarisPreviewCodePadding,
  type SolarisPreviewCodeSize,
  type SolarisPreviewCodeTab,
} from './preview-code.types';

const APPEARANCES: ReadonlySet<string> = new Set(['surface', 'outline']);
const SIZES: ReadonlySet<string> = new Set(['sm', 'md', 'lg']);
const RADII: ReadonlySet<string> = new Set(['none', 'sm', 'md', 'lg', 'xl']);
const TABS: ReadonlySet<string> = new Set(SOLARIS_PREVIEW_CODE_TABS);
const ALIGNS: ReadonlySet<string> = new Set(SOLARIS_PREVIEW_CODE_ALIGNS);
const MIN_HEIGHTS: ReadonlySet<string> = new Set(
  SOLARIS_PREVIEW_CODE_MIN_HEIGHTS,
);
const PADDINGS: ReadonlySet<string> = new Set(SOLARIS_PREVIEW_CODE_PADDINGS);

export const DEFAULT_PREVIEW_CODE_TAB: SolarisPreviewCodeTab = 'preview';
export const DEFAULT_PREVIEW_CODE_APPEARANCE: SolarisPreviewCodeAppearance =
  'outline';
export const DEFAULT_PREVIEW_CODE_SIZE: SolarisPreviewCodeSize = 'md';
export const DEFAULT_PREVIEW_CODE_ALIGN: SolarisPreviewCodeAlign = 'center';
export const DEFAULT_PREVIEW_CODE_MIN_HEIGHT: SolarisPreviewCodeMinHeight =
  'md';
export const DEFAULT_PREVIEW_CODE_PADDING: SolarisPreviewCodePadding = 'md';
export const DEFAULT_PREVIEW_CODE_COLLAPSED_LINES = 8;

/**
 * Mirrors `--solaris-motion-duration-normal`: the tab-switch height tween
 * runs 300ms in CSS, and the TS fallback timer below adds a 100ms buffer.
 */
export const PREVIEW_CODE_TAB_HEIGHT_MS = 300;

export const DEFAULT_PREVIEW_CODE_ARIA_LABEL_KEY =
  'solaris.previewCode.ariaLabel';
export const DEFAULT_PREVIEW_CODE_ARIA_LABEL_TEXT = 'Preview code';
export const DEFAULT_PREVIEW_CODE_PREVIEW_LABEL_KEY =
  'solaris.previewCode.preview';
export const DEFAULT_PREVIEW_CODE_PREVIEW_LABEL_TEXT = 'Preview';
export const DEFAULT_PREVIEW_CODE_CODE_LABEL_KEY = 'solaris.previewCode.code';
export const DEFAULT_PREVIEW_CODE_CODE_LABEL_TEXT = 'Code';
export const DEFAULT_PREVIEW_CODE_FILE_SELECTOR_ARIA_LABEL_KEY =
  'solaris.previewCode.fileSelector.ariaLabel';
export const DEFAULT_PREVIEW_CODE_FILE_SELECTOR_ARIA_LABEL_TEXT = 'Code files';

function normalizeToken<T extends string>(
  value: string | null | undefined,
  allowed: ReadonlySet<string>,
  fallback: T,
): T {
  return typeof value === 'string' && allowed.has(value)
    ? (value as T)
    : fallback;
}

export function normalizePreviewCodeTab(
  value: string | null | undefined,
): SolarisPreviewCodeTab {
  return normalizeToken(value, TABS, DEFAULT_PREVIEW_CODE_TAB);
}

export function normalizeOptionalPreviewCodeTab(
  value: string | null | undefined,
): SolarisPreviewCodeTab | null {
  if (value == null) {
    return null;
  }
  return normalizePreviewCodeTab(value);
}

export function normalizePreviewCodeAppearance(
  value: string | null | undefined,
): SolarisPreviewCodeAppearance {
  return normalizeToken(value, APPEARANCES, DEFAULT_PREVIEW_CODE_APPEARANCE);
}

export function normalizeOptionalPreviewCodeAppearance(
  value: string | null | undefined,
): SolarisPreviewCodeAppearance | null {
  if (value == null) {
    return null;
  }
  return normalizePreviewCodeAppearance(value);
}

export function normalizePreviewCodeSize(
  value: string | null | undefined,
): SolarisPreviewCodeSize {
  return normalizeToken(value, SIZES, DEFAULT_PREVIEW_CODE_SIZE);
}

export function normalizeOptionalPreviewCodeSize(
  value: string | null | undefined,
): SolarisPreviewCodeSize | null {
  if (value == null) {
    return null;
  }
  return normalizePreviewCodeSize(value);
}

export function normalizePreviewCodeRadius(
  value: string | null | undefined,
): import('./preview-code.types').SolarisPreviewCodeRadius | null {
  if (value == null) {
    return null;
  }
  return RADII.has(value)
    ? (value as import('./preview-code.types').SolarisPreviewCodeRadius)
    : null;
}

export function normalizePreviewCodeAlign(
  value: string | null | undefined,
): SolarisPreviewCodeAlign {
  return normalizeToken(value, ALIGNS, DEFAULT_PREVIEW_CODE_ALIGN);
}

export function normalizePreviewCodeMinHeight(
  value: string | null | undefined,
): SolarisPreviewCodeMinHeight {
  return normalizeToken(value, MIN_HEIGHTS, DEFAULT_PREVIEW_CODE_MIN_HEIGHT);
}

export function normalizePreviewCodePadding(
  value: string | null | undefined,
): SolarisPreviewCodePadding {
  return normalizeToken(value, PADDINGS, DEFAULT_PREVIEW_CODE_PADDING);
}

export function normalizePreviewCodeCollapsedLines(
  value: number | null | undefined,
  fallback: number = DEFAULT_PREVIEW_CODE_COLLAPSED_LINES,
): number {
  if (typeof value !== 'number' || Number.isNaN(value) || value < 1) {
    return fallback;
  }
  return Math.floor(value);
}
