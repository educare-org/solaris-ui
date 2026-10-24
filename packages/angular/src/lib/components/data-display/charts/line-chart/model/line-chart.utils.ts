export interface SolarisLineChartDotView {
  readonly seriesId: string;
  readonly index: number;
  readonly position: number;
  readonly value: number;
  readonly cx: number;
  readonly cy: number;
}

export const SOLARIS_LINE_CHART_AXES_SELECTOR =
  '.solaris-line-chart__grid, .solaris-line-chart__tick, .solaris-line-chart__reference, .solaris-line-chart__reference-label';

export const SOLARIS_LINE_CHART_OUT_MS = 250;
export const SOLARIS_LINE_CHART_DRAW_INITIAL_MS = 1000;
export const SOLARIS_LINE_CHART_DRAW_INITIAL_STAGGER_MS = 140;
export const SOLARIS_LINE_CHART_PEN_SWEEP_MS = 650;
export const SOLARIS_LINE_CHART_PEN_STAGGER_MS = 90;
export type SolarisLineChartTransitionPhase =
  | 'idle'
  | 'exiting'
  | 'rescaling'
  | 'entering';

export const SOLARIS_LINE_CHART_EXIT_MS = 450;
export const SOLARIS_LINE_CHART_RESCALE_FADE_MS = 200;
export const SOLARIS_LINE_CHART_ENTER_MS = 750;
export const SOLARIS_LINE_CHART_DOT_FADE_MS = 160;
export const SOLARIS_LINE_CHART_EASING_ACCELERATE =
  'cubic-bezier(0.4, 0, 1, 1)';
export const SOLARIS_LINE_CHART_EASING_DECELERATE =
  'cubic-bezier(0, 0, 0.2, 1)';
export const SOLARIS_LINE_CHART_EASING_STANDARD =
  'cubic-bezier(0.4, 0, 0.2, 1)';

let solarisLineChartInstanceCount = 0;

export function nextLineChartInstanceId(): number {
  solarisLineChartInstanceCount += 1;
  return solarisLineChartInstanceCount;
}
