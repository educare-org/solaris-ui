/**
 * CSS custom properties consumed by `solaris-preview-code`.
 * All values resolve to Solaris design tokens (`--solaris-*`); the component
 * never provides a fallback for a token.
 */
export const SOLARIS_PREVIEW_CODE_TOKENS = [
  '--solaris-preview-code-background',
  '--solaris-preview-code-border-color',
  '--solaris-preview-code-text',
  '--solaris-preview-code-muted-text',
  '--solaris-preview-code-preview-background',
  '--solaris-preview-code-radius',
  '--solaris-preview-code-gap',
  '--solaris-preview-code-padding-block',
  '--solaris-preview-code-padding-inline',
  '--solaris-preview-code-min-height',
] as const;

export type SolarisPreviewCodeToken =
  (typeof SOLARIS_PREVIEW_CODE_TOKENS)[number];
