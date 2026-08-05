export const VIEW_BOX = 120;
export const VIEW_CENTER = VIEW_BOX / 2;
export const STROKE_WIDTH = 15;
export const RING_RADIUS = 46;

export const STACKED_BAR_COUNT = 8;
export const STACKED_ANGLE_STEP = 360 / STACKED_BAR_COUNT;
export const STACKED_INNER_RADIUS = 28;
export const STACKED_OUTER_RADIUS = 50;

export const RING_ARC_PATH = `M ${VIEW_CENTER} ${VIEW_CENTER - RING_RADIUS} A ${RING_RADIUS} ${RING_RADIUS} 0 0 1 ${
  VIEW_CENTER + RING_RADIUS
} ${VIEW_CENTER}`;

export interface SolarisStackedBar {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delayFactor: number;
  staticOpacity: number;
}

export const SOLARIS_STACKED_BARS: readonly SolarisStackedBar[] = Array.from(
  { length: STACKED_BAR_COUNT },
  (_, index) => {
    const angle = ((-90 + index * STACKED_ANGLE_STEP) * Math.PI) / 180;
    const delayFactor =
      -((STACKED_BAR_COUNT - index) % STACKED_BAR_COUNT) / STACKED_BAR_COUNT;
    const staticOpacity = 1 - (index / STACKED_BAR_COUNT) * 0.6;
    return {
      x1: VIEW_CENTER + STACKED_INNER_RADIUS * Math.cos(angle),
      y1: VIEW_CENTER + STACKED_INNER_RADIUS * Math.sin(angle),
      x2: VIEW_CENTER + STACKED_OUTER_RADIUS * Math.cos(angle),
      y2: VIEW_CENTER + STACKED_OUTER_RADIUS * Math.sin(angle),
      delayFactor,
      staticOpacity,
    };
  },
);
