/**
 * Pure helpers to size a select trigger/panel from the widest option row.
 *
 * The panel lives in a CDK overlay (outside the host layout flow), so the
 * trigger cannot grow to fit its content with CSS alone. The component
 * measures the intrinsic content width with real DOM reads and clamps it
 * here, keeping every branch unit-testable without browser layout.
 */

import { ceilToDevicePixels } from '../../../interaction/popover/functions/popover-size';

export const SOLARIS_SELECT_MAX_INTRINSIC_WIDTH = 480;

/** Horizontal safety margin kept against the viewport edge. */
export const SOLARIS_SELECT_VIEWPORT_GUTTER = 32;

/**
 * Extra width on top of the measured list for a possible vertical scrollbar
 * and rounding slack. The options-list padding itself is part of the
 * measurement, so this stays small and never ratchets between opens.
 */
export const SOLARIS_SELECT_INTRINSIC_EXTRAS = 16;

export interface SolarisIntrinsicCapOptions {
  /** Inner width of the direct parent block, when measurable. */
  parentWidth?: number;
  /** Viewport inner width, when measurable. */
  viewportWidth?: number;
  /** Hard ceiling so the width never grows without bounds. */
  maxIntrinsic?: number;
  /** Explicit panelMaxWidth override set by the consumer. */
  maxWidthOverride?: string | number;
}

/**
 * Parse a CSS dimension to pixels when it is a number or a `NNNpx` string.
 * Anything else (%, rem, auto, ...) is left for the browser to resolve.
 */
export function parseCssPixelDimension(
  value: string | number | undefined,
): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0 ? value : undefined;
  }
  const match = /^\s*(\d+(?:\.\d+)?)\s*px\s*$/i.exec(value);
  if (!match) {
    return undefined;
  }
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

/**
 * Resolve the ceiling for content-driven growth. The smallest positive
 * candidate wins so narrow containers (auth cards, 320px, mobile) keep
 * wrapping instead of overflowing.
 */
export function resolveIntrinsicCap(
  options: SolarisIntrinsicCapOptions = {},
): number {
  const {
    parentWidth,
    viewportWidth,
    maxIntrinsic = SOLARIS_SELECT_MAX_INTRINSIC_WIDTH,
    maxWidthOverride,
  } = options;

  const candidates: number[] = [];
  if (maxIntrinsic > 0) {
    candidates.push(maxIntrinsic);
  }
  if (parentWidth !== undefined && parentWidth > 0) {
    candidates.push(parentWidth);
  }
  if (viewportWidth !== undefined && viewportWidth > 0) {
    candidates.push(
      Math.max(0, viewportWidth - SOLARIS_SELECT_VIEWPORT_GUTTER),
    );
  }
  const override = parseCssPixelDimension(maxWidthOverride);
  if (override !== undefined) {
    candidates.push(override);
  }
  if (candidates.length === 0) {
    return maxIntrinsic;
  }
  return Math.min(...candidates);
}

export interface SolarisIntrinsicTargetOptions {
  /** Measured widest option row plus extras, in pixels. */
  contentWidth: number;
  /** Current trigger (origin) width in pixels. */
  triggerWidth: number;
  /** Ceiling from {@link resolveIntrinsicCap}. */
  cap: number;
}

/**
 * Resolve the target width: grow toward the content width but never past
 * the cap and never below the current trigger width (no shrink surprises
 * while open; an already-wider trigger such as a filled narrow container
 * is left untouched).
 */
export function resolveIntrinsicTarget(
  options: SolarisIntrinsicTargetOptions,
): number {
  const { contentWidth, triggerWidth, cap } = options;
  if (!(contentWidth > 0)) {
    return Math.max(0, Math.ceil(triggerWidth));
  }
  const safeCap = cap > 0 ? cap : contentWidth;
  const desired = Math.max(Math.ceil(contentWidth), Math.ceil(triggerWidth));
  return Math.min(desired, Math.ceil(safeCap));
}

export interface SolarisDeviceAlignedFloorOptions {
  /** Measured widest option row, before extras. */
  contentWidth: number;
  /** Overlay origin (trigger) width in pixels. */
  triggerWidth: number;
  /** Inner width of the direct parent block, when measurable. */
  parentWidth?: number;
  /** Viewport inner width, when measurable. */
  viewportWidth?: number;
  /** Explicit panelMaxWidth override set by the consumer. */
  maxWidthOverride?: string | number;
  /** Device pixel ratio for the device-pixel grid snap. */
  devicePixelRatio?: number;
}

/**
 * Content-driven floor lifted onto the shared device-pixel grid, so the
 * trigger and the snapped panel land on the same device pixels.
 */
export function resolveDeviceAlignedFloor(
  options: SolarisDeviceAlignedFloorOptions,
): number {
  const {
    contentWidth,
    triggerWidth,
    parentWidth,
    viewportWidth,
    maxWidthOverride,
    devicePixelRatio,
  } = options;
  return Math.max(
    resolveIntrinsicTarget({
      contentWidth: contentWidth + SOLARIS_SELECT_INTRINSIC_EXTRAS,
      triggerWidth,
      cap: resolveIntrinsicCap({
        parentWidth,
        viewportWidth,
        maxWidthOverride,
      }),
    }),
    ceilToDevicePixels(triggerWidth, devicePixelRatio),
  );
}
