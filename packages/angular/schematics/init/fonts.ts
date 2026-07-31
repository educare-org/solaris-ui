export type SolarisFontScale = 'default' | 'sm' | 'lg';

export interface SolarisFontOptions {
  scale?: SolarisFontScale;
}

/**
 * Solaris uses the browser default root font-size (100%, typically 16px).
 * Overriding the root font-size breaks WCAG 1.4.4 Resize Text, so the
 * `default` scale is the only supported strategy.
 */
export function buildFontSizeComment(options: SolarisFontOptions): string {
  const scale = options.scale ?? 'default';

  if (scale !== 'default') {
    return `// WARNING: solaris.core() uses the browser default root font-size (100%).
// Custom root font-size strategies are not supported (WCAG 1.4.4 Resize Text).
// Requested scale "${scale}" was ignored; default scale applied.`;
  }

  return `// Uses browser default root font-size (100%). All Solaris tokens are
// calculated at 1rem = 16px. Do NOT override the root font-size.`;
}
