/**
 * Flattens a nested translation package (`translation/*.json` shape) into the
 * flat dotted-key map (`SolarisTranslations`) that `provideSolarisTranslate*`
 * providers and `SolarisTranslateService` consume.
 */
export function flattenTestTranslations(
  tree: unknown,
  prefix = '',
  out: Record<string, string> = {},
): Record<string, string> {
  if (typeof tree === 'string') {
    out[prefix] = tree;
    return out;
  }
  if (typeof tree === 'object' && tree !== null) {
    for (const [key, value] of Object.entries(tree)) {
      flattenTestTranslations(value, prefix ? `${prefix}.${key}` : key, out);
    }
  }
  return out;
}
