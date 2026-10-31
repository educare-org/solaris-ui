export type ButtonAsyncStatus = 'idle' | 'pending';

export function initialAsyncStatus(): ButtonAsyncStatus {
  return 'idle';
}

export function beginAsync(): ButtonAsyncStatus {
  return 'pending';
}

export function endAsync(): ButtonAsyncStatus {
  return 'idle';
}

export function shouldIgnoreClick(status: ButtonAsyncStatus): boolean {
  return status === 'pending';
}

export function resolveEffectiveLoading(
  manualLoading: boolean,
  status: ButtonAsyncStatus,
): boolean {
  return manualLoading || status === 'pending';
}

export function resolveAsyncDisabled(
  disabled: boolean,
  manualLoading: boolean,
  status: ButtonAsyncStatus,
): boolean {
  return disabled || resolveEffectiveLoading(manualLoading, status);
}
