import type {
  SolarisSliderColor,
  SolarisSliderOrientation,
  SolarisSliderScale,
  SolarisSliderSize,
  SolarisSliderValueDisplay,
  SolarisSliderZone,
} from './slider.types';

export const SOLARIS_SLIDER_DEFAULT_VALUE = 50;

export const SOLARIS_SLIDER_DEFAULT_MIN = 0;

export const SOLARIS_SLIDER_DEFAULT_MAX = 100;

export const SOLARIS_SLIDER_DEFAULT_STEP = 1;

export const SOLARIS_SLIDER_PAGE_STEP_FACTOR = 10;

export const SOLARIS_SLIDER_DEFAULT_ORIENTATION: SolarisSliderOrientation =
  'horizontal';

export const SOLARIS_SLIDER_DEFAULT_SIZE: SolarisSliderSize = 'md';

export const SOLARIS_SLIDER_DEFAULT_COLOR: SolarisSliderColor = 'neutral';

export const SOLARIS_SLIDER_DEFAULT_VALUE_DISPLAY: SolarisSliderValueDisplay =
  'inline';

export const SOLARIS_SLIDER_DEFAULT_SHOW_TICKS = false;

export const SOLARIS_SLIDER_DEFAULT_SHOW_MIN_MAX = false;

export const SOLARIS_SLIDER_DEFAULT_SCALE: SolarisSliderScale = {
  kind: 'linear',
};

export const SOLARIS_SLIDER_DEFAULT_LOG_BASE = 10;

export const SOLARIS_SLIDER_DEFAULT_POW_EXPONENT = 2;

export const SOLARIS_SLIDER_DEFAULT_TICK_VALUES: readonly number[] | undefined =
  undefined;

export const SOLARIS_SLIDER_DEFAULT_ZONES:
  | readonly SolarisSliderZone[]
  | undefined = undefined;

export const SOLARIS_SLIDER_DEFAULT_DISTRIBUTION:
  | readonly number[]
  | undefined = undefined;
