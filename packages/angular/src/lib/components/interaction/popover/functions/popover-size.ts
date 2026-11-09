export interface SolarisPopoverSizeOptions {
  /** Trigger width in CSS pixels (fractional). */
  triggerWidth: number;
  matchTriggerWidth: boolean;
  minWidth?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
  /** Device pixel ratio the matched width snaps to; defaults to 1. */
  devicePixelRatio?: number;
}

export interface SolarisPopoverSize {
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
}

export function normalizePopoverDimension(
  value: string | number | undefined,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return typeof value === 'number' ? `${value}px` : value;
}

/** Snap a CSS-pixel width to whole device pixels (nearest). */
export function quantizeToDevicePixels(
  value: number,
  devicePixelRatio = 1,
): number {
  if (!Number.isFinite(value) || value <= 0) {
    return value;
  }
  const dpr =
    Number.isFinite(devicePixelRatio) && devicePixelRatio > 0
      ? devicePixelRatio
      : 1;
  return Math.round(value * dpr) / dpr;
}

/** Round a CSS-pixel width UP to whole device pixels (never below input). */
export function ceilToDevicePixels(
  value: number,
  devicePixelRatio = 1,
): number {
  if (!Number.isFinite(value) || value <= 0) {
    return value;
  }
  const dpr =
    Number.isFinite(devicePixelRatio) && devicePixelRatio > 0
      ? devicePixelRatio
      : 1;
  return Math.ceil(value * dpr - 1e-9) / dpr;
}

export function resolvePopoverSize(
  options: SolarisPopoverSizeOptions,
): SolarisPopoverSize {
  const {
    triggerWidth,
    matchTriggerWidth,
    minWidth,
    maxWidth,
    maxHeight,
    devicePixelRatio,
  } = options;
  const size: SolarisPopoverSize = {};

  if (matchTriggerWidth) {
    const snappedWidth = quantizeToDevicePixels(triggerWidth, devicePixelRatio);
    size.width = snappedWidth;
    size.minWidth = snappedWidth;
    if (maxWidth === undefined) {
      size.maxWidth = snappedWidth;
    }
  }

  const normalizedMinWidth = normalizePopoverDimension(minWidth);
  if (normalizedMinWidth !== undefined) {
    size.minWidth = normalizedMinWidth;
  }

  const normalizedMaxWidth = normalizePopoverDimension(maxWidth);
  if (normalizedMaxWidth !== undefined) {
    size.maxWidth = normalizedMaxWidth;
  }

  const normalizedMaxHeight = normalizePopoverDimension(maxHeight);
  if (normalizedMaxHeight !== undefined) {
    size.maxHeight = normalizedMaxHeight;
  }

  return size;
}
