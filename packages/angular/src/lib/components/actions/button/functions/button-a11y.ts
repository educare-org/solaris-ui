export type ButtonTranslator = (key: string) => string | undefined;

export function resolveLoadingLabel(
  label: string | undefined,
  labelKey: string | undefined,
  translate: ButtonTranslator | undefined,
  fallbackKey: string,
): string | undefined {
  if (label) {
    return label;
  }
  if (labelKey && translate) {
    return translate(labelKey);
  }
  if (translate) {
    return translate(fallbackKey);
  }
  return undefined;
}

export function resolveAriaLabel(
  label: string | undefined,
  labelKey: string | undefined,
  translate: ButtonTranslator | undefined,
): string | undefined {
  if (label) {
    return label;
  }
  if (labelKey && translate) {
    return translate(labelKey);
  }
  return undefined;
}
