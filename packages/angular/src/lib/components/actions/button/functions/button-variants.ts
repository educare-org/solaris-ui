export function resolveVariant<T>(dataValue: T | undefined, inputValue: T): T {
  return dataValue ?? inputValue;
}

export function resolveEffectiveSize(
  groupSize: string | undefined,
  resolvedSize: string,
): string {
  return groupSize ?? resolvedSize;
}

export function resolveGroupPlacement(
  attached: boolean,
  orientation: string | null,
): string | null {
  if (!attached) {
    return null;
  }
  return orientation;
}

export function resolveEffectiveDensity(
  groupDensity: string | undefined,
  dataDensity: string | undefined,
  density: string | undefined,
  themeDensity: string,
): string {
  return groupDensity ?? dataDensity ?? density ?? themeDensity;
}

export function resolveDisabled(disabled: boolean, loading: boolean): boolean {
  return disabled || loading;
}
